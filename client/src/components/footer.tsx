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
        
        <div className="border-t border-border mt-8 pt-8">
          <div className="text-center text-muted-foreground mb-4">
            <p data-testid="text-footer-copyright">
              &copy; 2025 Ubalo Sungano. All rights reserved. Built with ❤️ for a better tomorrow.
            </p>
          </div>
          
          {/* Built by Neuronet AI Solutions */}
          <div className="flex items-center justify-center space-x-3 text-sm text-muted-foreground">
            <span>Built by</span>
            <a 
              href="https://neuronetai.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-primary transition-colors"
            >
              <img 
                src="https://sqbnzpwxbzlmjbqsclia.supabase.co/storage/v1/object/sign/Neuronet%20Ai%20Solutions/WhatsApp%20Image%202025-09-03%20at%2021.38.04_75dce74b.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYzdhNTNjYS04ZGVjLTRlNjMtOWNkNi05NGJiMGNmNTEyYmYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJOZXVyb25ldCBBaSBTb2x1dGlvbnMvV2hhdHNBcHAgSW1hZ2UgMjAyNS0wOS0wMyBhdCAyMS4zOC4wNF83NWRjZTc0Yi5qcGciLCJpYXQiOjE3NTY5MjgzNTUsImV4cCI6NTI1NzQyNDM1NX0.07k7ZQMAkV5J2m5bBvz9mT5Qtz3lQDvST4_3p_KX7GU"
                alt="Neuronet AI Solutions Logo"
                className="w-6 h-6 rounded-sm object-cover"
              />
              <span className="font-medium">Neuronet AI Solutions Pvt.</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
