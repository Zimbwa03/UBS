import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const donations = pgTable("donations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  donorName: text("donor_name"),
  email: text("email"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  message: text("message"),
  isAnonymous: boolean("is_anonymous").default(false),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
});

export const campaignSettings = pgTable("campaign_settings", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
  campaignTitle: text("campaign_title").notNull(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`NOW()`),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").default(sql`NOW()`),
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCampaignSettingsSchema = createInsertSchema(campaignSettings).omit({
  id: true,
  createdAt: true,
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({
  id: true,
  subscribedAt: true,
});

export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;
export type CampaignSettings = typeof campaignSettings.$inferSelect;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
