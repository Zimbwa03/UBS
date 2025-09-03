import { type Donation, type InsertDonation, type CampaignSettings, type NewsletterSubscriber } from "@shared/schema";
import { randomUUID } from "crypto";

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
      targetAmount: "4000.00",
      campaignTitle: "Chinpangura Outreach - Helping Underprivileged Kids",
      endDate: new Date("2025-09-26T16:00:00Z"),
      isActive: true,
      createdAt: new Date(),
    };
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
      ...insertDonation,
      id,
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

export const storage = new MemStorage();
