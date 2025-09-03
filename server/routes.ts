import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDonationSchema, insertNewsletterSubscriberSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all donations
  app.get("/api/donations", async (req, res) => {
    try {
      const donations = await storage.getDonations();
      res.json(donations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch donations" });
    }
  });

  // Create a new donation
  app.post("/api/donations", async (req, res) => {
    try {
      const donationData = insertDonationSchema.parse(req.body);
      const donation = await storage.createDonation(donationData);
      res.status(201).json(donation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid donation data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create donation" });
      }
    }
  });

  // Get donation statistics
  app.get("/api/donations/stats", async (req, res) => {
    try {
      const stats = await storage.getDonationStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch donation stats" });
    }
  });

  // Get campaign settings
  app.get("/api/campaign", async (req, res) => {
    try {
      const campaign = await storage.getCampaignSettings();
      if (!campaign) {
        res.status(404).json({ message: "Campaign not found" });
        return;
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaign settings" });
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = insertNewsletterSubscriberSchema.parse(req.body);
      const subscriber = await storage.subscribeToNewsletter(email);
      res.status(201).json({ message: "Successfully subscribed to newsletter", subscriber });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid email address", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to subscribe to newsletter" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
