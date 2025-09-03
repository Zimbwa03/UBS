import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateDonation } from "@/hooks/use-donations";
import { useToast } from "@/hooks/use-toast";
import { Heart, Lock } from "lucide-react";

const PRESET_AMOUNTS = [25, 50, 100, 200];

export default function DonationForm() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const createDonation = useCreateDonation();
  const { toast } = useToast();

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(amount.toString());
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && PRESET_AMOUNTS.includes(numValue)) {
      setSelectedAmount(numValue);
    } else {
      setSelectedAmount(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(customAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      });
      return;
    }

    if (!donorName.trim() && !isAnonymous) {
      toast({
        title: "Name Required",
        description: "Please enter your name or check anonymous donation.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createDonation.mutateAsync({
        donorName: isAnonymous ? null : donorName.trim(),
        email: email.trim() || null,
        amount: amount.toString(),
        message: message.trim() || null,
        isAnonymous,
      });

      toast({
        title: "Thank You!",
        description: `Your donation of $${amount} has been submitted successfully.`,
      });

      // Reset form
      setSelectedAmount(null);
      setCustomAmount("");
      setDonorName("");
      setEmail("");
      setMessage("");
      setIsAnonymous(false);
    } catch (error) {
      toast({
        title: "Donation Failed",
        description: "There was an error processing your donation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="rounded-2xl shadow-lg sticky top-24">
      <CardHeader>
        <CardTitle className="text-2xl text-center" data-testid="text-donation-title">
          Make a Donation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quick Amount Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Quick Amount Selection</Label>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={selectedAmount === amount ? "default" : "outline"}
                  className="py-3 px-4 font-medium transition-all"
                  onClick={() => handleAmountSelect(amount)}
                  data-testid={`button-amount-${amount}`}
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <Label htmlFor="customAmount" className="text-sm font-medium mb-2 block">
              Custom Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="customAmount"
                type="number"
                step="0.01"
                min="1"
                placeholder="0.00"
                className="pl-8"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                data-testid="input-custom-amount"
              />
            </div>
          </div>

          {/* Donor Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="donorName" className="text-sm font-medium mb-2 block">
                Full Name
              </Label>
              <Input
                id="donorName"
                type="text"
                placeholder="Enter your name"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                disabled={isAnonymous}
                data-testid="input-donor-name"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-email"
              />
            </div>
            
            <div>
              <Label htmlFor="message" className="text-sm font-medium mb-2 block">
                Message (Optional)
              </Label>
              <Textarea
                id="message"
                placeholder="Share your support message..."
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                data-testid="textarea-message"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={(checked) => setIsAnonymous(checked === true)}
                data-testid="checkbox-anonymous"
              />
              <Label htmlFor="anonymous" className="text-sm text-muted-foreground">
                Make this donation anonymous
              </Label>
            </div>
          </div>

          {/* Donate Button */}
          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-4 text-lg font-bold transform hover:scale-105 transition-all"
            disabled={createDonation.isPending}
            data-testid="button-submit-donation"
          >
            <Heart className="w-5 h-5 mr-2" />
            {createDonation.isPending ? "Processing..." : "Donate Now"}
          </Button>

          <p className="text-xs text-muted-foreground text-center flex items-center justify-center">
            <Lock className="w-3 h-3 mr-1" />
            Secure donation processing • Your information is protected
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
