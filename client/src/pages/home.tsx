import HeroSection from "@/components/hero-section";
import ProgressSection from "@/components/progress-section";
import DonationForm from "@/components/donation-form";
import RecentDonations from "@/components/recent-donations";
import SocialSharing from "@/components/social-sharing";
import GallerySection from "@/components/gallery-section";
import TestimonialsSection from "@/components/testimonials-section";
import NewsletterSection from "@/components/newsletter-section";
import Footer from "@/components/footer";
import FloatingDonateButton from "@/components/floating-donate-button";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Clock, MapPin } from "lucide-react";

export default function Home() {
  const scrollToDonation = () => {
    const donationSection = document.getElementById('donation-section');
    if (donationSection) {
      donationSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shadow-md">
                <img 
                  src="https://sqbnzpwxbzlmjbqsclia.supabase.co/storage/v1/object/sign/Neuronet%20Ai%20Solutions/WhatsApp%20Image%202025-09-03%20at%2022.01.38_0a8ab4b9.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYzdhNTNjYS04ZGVjLTRlNjMtOWNkNi05NGJiMGNmNTEyYmYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJOZXVyb25ldCBBaSBTb2x1dGlvbnMvV2hhdHNBcHAgSW1hZ2UgMjAyNS0wOS0wMyBhdCAyMi4wMS4zOF8wYThhYjRiOS5qcGciLCJpYXQiOjE3NTY5Mjk4NTUsImV4cCI6NTI1NzQyNTg1NX0.KKloM4ugoy7K78DyBIADp9GMqpIvxmumUK1iUw5A2gw"
                  alt="Ubabalo Sungano Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-primary">Ubabalo Sungano</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Extending Hope</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={scrollToDonation}
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm sm:text-base px-3 sm:px-4 py-2"
                data-testid="header-donate-button"
              >
                <span className="hidden sm:inline">Donate Now</span>
                <span className="sm:hidden">Donate</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection onDonateClick={scrollToDonation} />

      {/* Progress Section */}
      <ProgressSection />

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Story and Event Details */}
            <div className="lg:col-span-2">
              <Card className="rounded-2xl p-6 sm:p-8 shadow-lg mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6" data-testid="text-about-title">About This Event</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 text-primary">Our Mission</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Ubabalo Sungano is organizing the Chipangura Outreach to extend a helping hand to 30 underprivileged children in the Guruve area. This initiative aims to provide essential support including educational materials, nutritious meals, and healthcare assistance to children who need it most.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-muted rounded-lg p-4">
                      <h4 className="font-semibold mb-2 flex items-center text-sm sm:text-base">
                        <MapPin className="w-4 h-4 text-accent mr-2 flex-shrink-0" />
                        Event Location
                      </h4>
                      <p className="text-muted-foreground text-sm sm:text-base">Guruve, Zimbabwe</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <h4 className="font-semibold mb-2 flex items-center text-sm sm:text-base">
                        <Clock className="w-4 h-4 text-accent mr-2 flex-shrink-0" />
                        Event Time
                      </h4>
                      <p className="text-muted-foreground text-sm sm:text-base">12:00 PM - 4:00 PM</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 text-primary">What Your Donation Provides</h3>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center bg-secondary/10 rounded-lg p-4">
                        <div className="w-8 h-8 mx-auto mb-2 bg-secondary rounded-full flex items-center justify-center">
                          📚
                        </div>
                        <div className="font-medium">$50</div>
                        <div className="text-sm text-muted-foreground">School supplies for one child</div>
                      </div>
                      <div className="text-center bg-accent/10 rounded-lg p-4">
                        <div className="w-8 h-8 mx-auto mb-2 bg-accent rounded-full flex items-center justify-center">
                          🍽️
                        </div>
                        <div className="font-medium">$100</div>
                        <div className="text-sm text-muted-foreground">Nutritious meals for a week</div>
                      </div>
                      <div className="text-center bg-primary/10 rounded-lg p-4">
                        <div className="w-8 h-8 mx-auto mb-2 bg-primary rounded-full flex items-center justify-center">
                          🏥
                        </div>
                        <div className="font-medium">$150</div>
                        <div className="text-sm text-muted-foreground">Healthcare support package</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Contact Information */}
              <Card className="rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Primary Contact</div>
                      <div className="text-muted-foreground">0784892792</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <div className="font-medium">Alternative Contact</div>
                      <div className="text-muted-foreground">0778964349</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Donation Form and Activity */}
            <div className="space-y-8" id="donation-section">
              <DonationForm />
              <RecentDonations />
              <SocialSharing />
            </div>
          </div>
        </div>
      </section>

      <GallerySection />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
      <FloatingDonateButton onDonateClick={scrollToDonation} />
    </div>
  );
}
