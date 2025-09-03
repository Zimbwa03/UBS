import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNewsletterSubscription } from "@/hooks/use-campaign-stats";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const subscribeNewsletter = useNewsletterSubscription();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      await subscribeNewsletter.mutateAsync(email.trim());
      
      toast({
        title: "Subscribed!",
        description: "You've been successfully subscribed to our newsletter.",
      });
      
      setEmail("");
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-16 bg-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-newsletter-title">
            Stay Connected
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get updates on our outreach programs and see the ongoing impact of your support
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder-primary-foreground/70"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={subscribeNewsletter.isPending}
                data-testid="input-newsletter-email"
              />
              <Button
                type="submit"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                disabled={subscribeNewsletter.isPending}
                data-testid="button-newsletter-subscribe"
              >
                {subscribeNewsletter.isPending ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
            <p className="text-sm mt-3 opacity-80 flex items-center justify-center">
              <Shield className="w-4 h-4 mr-1" />
              We respect your privacy. No spam, unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
