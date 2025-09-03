-- Supabase Database Setup for Fundraising Event Web App
-- This script creates the necessary tables for the fundraising application

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    donor_name TEXT,
    email TEXT,
    amount DECIMAL(10,2) NOT NULL,
    message TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaign_settings table
CREATE TABLE IF NOT EXISTS campaign_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    target_amount DECIMAL(10,2) NOT NULL,
    campaign_title TEXT NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_amount ON donations(amount);
CREATE INDEX IF NOT EXISTS idx_campaign_settings_is_active ON campaign_settings(is_active);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);

-- Enable Row Level Security (RLS)
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for donations table
-- Allow anyone to read donations (for public display)
CREATE POLICY "Allow public read access to donations" ON donations
    FOR SELECT USING (true);

-- Allow anyone to insert donations (for donation form)
CREATE POLICY "Allow public insert access to donations" ON donations
    FOR INSERT WITH CHECK (true);

-- Create RLS policies for campaign_settings table
-- Allow anyone to read campaign settings (for public display)
CREATE POLICY "Allow public read access to campaign_settings" ON campaign_settings
    FOR SELECT USING (true);

-- Allow authenticated users to update campaign settings (admin functionality)
CREATE POLICY "Allow authenticated users to update campaign_settings" ON campaign_settings
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert campaign settings
CREATE POLICY "Allow authenticated users to insert campaign_settings" ON campaign_settings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create RLS policies for newsletter_subscribers table
-- Allow anyone to insert newsletter subscriptions
CREATE POLICY "Allow public insert access to newsletter_subscribers" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read newsletter subscribers (admin functionality)
CREATE POLICY "Allow authenticated users to read newsletter_subscribers" ON newsletter_subscribers
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at for donations
CREATE TRIGGER update_donations_updated_at 
    BEFORE UPDATE ON donations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default campaign settings
INSERT INTO campaign_settings (target_amount, campaign_title, end_date, is_active)
VALUES (50000.00, 'Fundraising Campaign 2024', NOW() + INTERVAL '30 days', true)
ON CONFLICT DO NOTHING;

-- Create a view for donation statistics
CREATE OR REPLACE VIEW donation_stats AS
SELECT 
    COUNT(*) as total_donations,
    COALESCE(SUM(amount), 0) as total_amount,
    COALESCE(AVG(amount), 0) as average_donation,
    COALESCE(MAX(amount), 0) as largest_donation,
    COALESCE(MIN(amount), 0) as smallest_donation
FROM donations;

-- Create a view for recent donations (last 10)
CREATE OR REPLACE VIEW recent_donations AS
SELECT 
    id,
    CASE 
        WHEN is_anonymous THEN 'Anonymous'
        ELSE COALESCE(donor_name, 'Anonymous')
    END as display_name,
    amount,
    message,
    created_at
FROM donations
ORDER BY created_at DESC
LIMIT 10;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Enable real-time for tables
ALTER PUBLICATION supabase_realtime ADD TABLE donations;
ALTER PUBLICATION supabase_realtime ADD TABLE campaign_settings;


