import { Heart, Phone, MapPin, Facebook, Twitter, Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary" data-testid="text-footer-org-name">
                  Ubalo Sungano
                </h3>
                <p className="text-muted-foreground">Extending Hope • Changing Lives</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Ubalo Sungano is dedicated to supporting underprivileged children in rural Zimbabwe through education, nutrition, and healthcare initiatives.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-colors"
                data-testid="link-footer-facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-colors"
                data-testid="link-footer-twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-colors"
                data-testid="link-footer-instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-colors"
                data-testid="link-footer-whatsapp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4" data-testid="text-footer-contact-title">Contact Info</h4>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary" />
                <span data-testid="text-footer-phone-primary">0784892792</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-secondary" />
                <span data-testid="text-footer-phone-secondary">0778964349</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span data-testid="text-footer-location">Guruve, Zimbabwe</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4" data-testid="text-footer-links-title">Quick Links</h4>
            <div className="space-y-2 text-muted-foreground">
              <a href="#" className="block hover:text-primary transition-colors" data-testid="link-footer-about">
                About Us
              </a>
              <a href="#" className="block hover:text-primary transition-colors" data-testid="link-footer-programs">
                Our Programs
              </a>
              <a href="#" className="block hover:text-primary transition-colors" data-testid="link-footer-volunteer">
                Volunteer
              </a>
              <a href="#" className="block hover:text-primary transition-colors" data-testid="link-footer-reports">
                Impact Reports
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p data-testid="text-footer-copyright">
            &copy; 2025 Ubalo Sungano. All rights reserved. Built with ❤️ for a better tomorrow.
          </p>
        </div>
      </div>
    </footer>
  );
}
