import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface FloatingDonateButtonProps {
  onDonateClick: () => void;
}

export default function FloatingDonateButton({ onDonateClick }: FloatingDonateButtonProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 md:hidden">
      <Button
        onClick={onDonateClick}
        className="bg-accent hover:bg-accent/90 text-accent-foreground w-14 h-14 rounded-full shadow-lg transform hover:scale-110 transition-all"
        data-testid="button-floating-donate"
      >
        <Heart className="w-6 h-6" />
      </Button>
      <div className="pulse-ring absolute inset-0 border-2 border-accent rounded-full animate-pulse-ring" />
    </div>
  );
}
