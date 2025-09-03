import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Facebook, Twitter, MessageCircle, Copy } from "lucide-react";

export default function SocialSharing() {
  const { toast } = useToast();
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = "Join me in supporting the Chinpangura Outreach to help 30 underprivileged kids in Guruve!";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "The fundraiser link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy link. Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(url, '_blank');
  };

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl" data-testid="text-share-title">Share This Cause</CardTitle>
        <p className="text-muted-foreground">Help us reach more people by sharing this fundraiser</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Button
            onClick={shareOnFacebook}
            className="flex items-center justify-center py-3 bg-blue-500 hover:bg-blue-600 text-white"
            data-testid="button-share-facebook"
          >
            <Facebook className="w-4 h-4" />
          </Button>
          <Button
            onClick={shareOnTwitter}
            className="flex items-center justify-center py-3 bg-sky-500 hover:bg-sky-600 text-white"
            data-testid="button-share-twitter"
          >
            <Twitter className="w-4 h-4" />
          </Button>
          <Button
            onClick={shareOnWhatsApp}
            className="flex items-center justify-center py-3 bg-green-500 hover:bg-green-600 text-white"
            data-testid="button-share-whatsapp"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
        
        <div>
          <Label htmlFor="shareLink" className="text-sm font-medium mb-2 block">Share Link</Label>
          <div className="flex">
            <Input
              id="shareLink"
              type="text"
              value={shareUrl}
              readOnly
              className="rounded-r-none"
              data-testid="input-share-link"
            />
            <Button
              onClick={copyToClipboard}
              className="rounded-l-none bg-primary hover:bg-primary/90 text-primary-foreground"
              data-testid="button-copy-link"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
