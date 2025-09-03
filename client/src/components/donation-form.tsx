import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateDonation } from "@/hooks/use-donations";
import { useToast } from "@/hooks/use-toast";
import { Heart, Lock, Smartphone, Copy, Check, Phone } from "lucide-react";

const PRESET_AMOUNTS = [25, 50, 100, 200];
const ECOCASH_NUMBER = "+263778864349";
const ECOCASH_NAME = "Anotida Kachepa";

export default function DonationForm() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedName, setCopiedName] = useState(false);

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

  const copyToClipboard = async (text: string, type: 'number' | 'name') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'number') {
        setCopiedNumber(true);
        setTimeout(() => setCopiedNumber(false), 2000);
      } else {
        setCopiedName(true);
        setTimeout(() => setCopiedName(false), 2000);
      }
      toast({
        title: "Copied!",
        description: `${type === 'number' ? 'EcoCash number' : 'Name'} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy manually",
        variant: "destructive",
      });
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
        title: "Donation Details Submitted!",
        description: `Thank you! Please complete your EcoCash payment of $${amount} to ${ECOCASH_NUMBER}`,
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
        title: "Submission Failed",
        description: "There was an error submitting your donation details. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* EcoCash Payment Card */}
      <Card className="rounded-2xl shadow-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-800" data-testid="text-donation-title">
            Donate via EcoCash
          </CardTitle>
          <p className="text-green-600 mt-2">Quick, secure, and convenient mobile payment</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* EcoCash Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-green-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Payment Details</h3>
            
            {/* EcoCash Number */}
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-600 mb-2 block">EcoCash Number</Label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 sm:px-4 py-3 font-mono text-base sm:text-lg break-all">
                    {ECOCASH_NUMBER}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(ECOCASH_NUMBER, 'number')}
                    className="px-3 sm:px-3 w-full sm:w-auto"
                  >
                    {copiedNumber ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    <span className="ml-2 sm:hidden">Copy Number</span>
                  </Button>
                </div>
              </div>
              
              {/* EcoCash Name */}
              <div>
                <Label className="text-sm font-medium text-gray-600 mb-2 block">Account Name</Label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 sm:px-4 py-3 font-semibold text-base sm:text-lg break-all">
                    {ECOCASH_NAME}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(ECOCASH_NAME, 'name')}
                    className="px-3 sm:px-3 w-full sm:w-auto"
                  >
                    {copiedName ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    <span className="ml-2 sm:hidden">Copy Name</span>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center text-base sm:text-lg">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                How to Pay:
              </h4>
              <ol className="text-sm sm:text-base text-blue-700 space-y-2 list-decimal list-inside">
                <li className="leading-relaxed">Dial <span className="font-mono bg-blue-100 px-2 py-1 rounded">*151#</span> on your mobile phone</li>
                <li className="leading-relaxed">Select <span className="font-semibold">"Send Money"</span></li>
                <li className="leading-relaxed">Enter the EcoCash number above</li>
                <li className="leading-relaxed">Enter your donation amount</li>
                <li className="leading-relaxed">Enter your EcoCash PIN to confirm</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donation Form */}
      <Card className="rounded-2xl shadow-lg sticky top-24">
        <CardHeader>
          <CardTitle className="text-xl text-center" data-testid="text-form-title">
            Record Your Donation
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Fill this form to track your donation and receive updates
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quick Amount Selection */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Donation Amount</Label>
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

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-4 text-lg font-bold transform hover:scale-105 transition-all"
              disabled={createDonation.isPending}
              data-testid="button-submit-donation"
            >
              <Heart className="w-5 h-5 mr-2" />
              {createDonation.isPending ? "Recording..." : "Record Donation"}
            </Button>

            <p className="text-xs text-muted-foreground text-center flex items-center justify-center">
              <Lock className="w-3 h-3 mr-1" />
              Secure form • Your information is protected
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
