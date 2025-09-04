import { type Donation, type InsertDonation, type CampaignSettings, type NewsletterSubscriber } from "@shared/schema";
import { randomUUID } from "crypto";
import { createClient } from '@supabase/supabase-js';

export interface IStorage {
  // Donations
  getDonations(): Promise<Donation[]>;
  createDonation(donation: InsertDonation): Promise<Donation>;
  getDonationStats(): Promise<{
    totalRaised: number;
    donorCount: number;
    averageDonation: number;
  }>;
  
  // Campaign Settings
  getCampaignSettings(): Promise<CampaignSettings | null>;
  
  // Newsletter
  subscribeToNewsletter(email: string): Promise<NewsletterSubscriber>;
  
  // Database initialization
  initializeDatabase(): Promise<void>;
}

// Initialize Supabase connection
const supabaseUrl = 'https://sqbnzpwxbzlmjbqsclia.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxYm56cHd4YnpsbWpicXNjbGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4OTkzMDMsImV4cCI6MjA3MjQ3NTMwM30.9nn_-l1kjRZqHtl9iIFCaxUbnBxhLAXbL0jvE6vsW3Y';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export class DatabaseStorage implements IStorage {
  async initializeDatabase(): Promise<void> {
    try {
      // Create tables if they don't exist
      await sql_client`
        CREATE TABLE IF NOT EXISTS donations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          donor_name TEXT,
          email TEXT,
          amount DECIMAL(10,2) NOT NULL,
          message TEXT,
          is_anonymous BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;
      
      await sql_client`
        CREATE TABLE IF NOT EXISTS campaign_settings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          target_amount DECIMAL(10,2) NOT NULL,
          campaign_title TEXT NOT NULL,
          end_date TIMESTAMP,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      
      await sql_client`
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT NOT NULL UNIQUE,
          subscribed_at TIMESTAMP DEFAULT NOW()
        );
      `;

      // Initialize default campaign settings if not exists
      const existingCampaign = await db.select().from(campaignSettings).limit(1);
      if (existingCampaign.length === 0) {
        await db.insert(campaignSettings).values({
          targetAmount: "1000.00",
          campaignTitle: "Chipangura Outreach - Helping Underprivileged Kids",
          endDate: new Date("2025-09-26T16:00:00Z"),
          isActive: true,
        });
      }
    } catch (error) {
      console.error("Database initialization error:", error);
    }
  }

  async getDonations(): Promise<Donation[]> {
    try {
      return await db.select().from(donations).orderBy(desc(donations.createdAt));
    } catch (error) {
      console.error("Error fetching donations:", error);
      return [];
    }
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    try {
      const result = await db.insert(donations).values(insertDonation).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating donation:", error);
      throw error;
    }
  }

  async getDonationStats(): Promise<{
    totalRaised: number;
    donorCount: number;
    averageDonation: number;
  }> {
    try {
      const result = await db
        .select({
          totalRaised: sql<number>`COALESCE(SUM(CAST(${donations.amount} AS NUMERIC)), 0)`,
          donorCount: sql<number>`COUNT(*)`,
        })
        .from(donations);

      const stats = result[0];
      const totalRaised = Number(stats.totalRaised) || 0;
      const donorCount = Number(stats.donorCount) || 0;
      const averageDonation = donorCount > 0 ? totalRaised / donorCount : 0;

      return {
        totalRaised,
        donorCount,
        averageDonation,
      };
    } catch (error) {
      console.error("Error fetching donation stats:", error);
      return {
        totalRaised: 0,
        donorCount: 0,
        averageDonation: 0,
      };
    }
  }

  async getCampaignSettings(): Promise<CampaignSettings | null> {
    try {
      const result = await db.select().from(campaignSettings).where(eq(campaignSettings.isActive, true)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error("Error fetching campaign settings:", error);
      return null;
    }
  }

  async subscribeToNewsletter(email: string): Promise<NewsletterSubscriber> {
    try {
      const result = await db.insert(newsletterSubscribers).values({ email }).returning();
      return result[0];
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      throw error;
    }
  }
}

export class MemStorage implements IStorage {
  private donations: Map<string, Donation>;
  private campaignSettings: CampaignSettings | null;
  private newsletterSubscribers: Map<string, NewsletterSubscriber>;

  constructor() {
    this.donations = new Map();
    this.newsletterSubscribers = new Map();
    
    // Initialize campaign settings
    this.campaignSettings = {
      id: randomUUID(),
      targetAmount: "1000.00",
      campaignTitle: "Chipangura Outreach - Helping Underprivileged Kids",
      endDate: new Date("2025-09-26T16:00:00Z"),
      isActive: true,
      createdAt: new Date(),
    };
  }

  async initializeDatabase(): Promise<void> {
    // No initialization needed for memory storage
  }

  async getDonations(): Promise<Donation[]> {
    return Array.from(this.donations.values()).sort(
      (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = randomUUID();
    const now = new Date();
    const donation: Donation = {
      id,
      donorName: insertDonation.donorName || null,
      email: insertDonation.email || null,
      amount: insertDonation.amount,
      message: insertDonation.message || null,
      isAnonymous: insertDonation.isAnonymous || false,
      createdAt: now,
      updatedAt: now,
    };
    this.donations.set(id, donation);
    return donation;
  }

  async getDonationStats(): Promise<{
    totalRaised: number;
    donorCount: number;
    averageDonation: number;
  }> {
    const donations = Array.from(this.donations.values());
    const totalRaised = donations.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);
    const donorCount = donations.length;
    const averageDonation = donorCount > 0 ? totalRaised / donorCount : 0;
    
    return {
      totalRaised,
      donorCount,
      averageDonation,
    };
  }

  async getCampaignSettings(): Promise<CampaignSettings | null> {
    return this.campaignSettings;
  }

  async subscribeToNewsletter(email: string): Promise<NewsletterSubscriber> {
    const id = randomUUID();
    const subscriber: NewsletterSubscriber = {
      id,
      email,
      subscribedAt: new Date(),
    };
    this.newsletterSubscribers.set(email, subscriber);
    return subscriber;
  }
}

// Use database storage if DATABASE_URL is available, otherwise use memory storage
export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();

// Initialize database on startup
if (process.env.DATABASE_URL) {
  (storage as DatabaseStorage).initializeDatabase().catch(console.error);
}