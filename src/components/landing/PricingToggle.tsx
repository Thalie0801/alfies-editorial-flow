import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PricingToggleProps {
  isAnnual: boolean;
  onChange: (isAnnual: boolean) => void;
}

export function PricingToggle({ isAnnual, onChange }: PricingToggleProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="bg-muted p-1 rounded-lg">
        <Button
          variant={!isAnnual ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange(false)}
          className="rounded-md"
        >
          Mensuel
        </Button>
        <Button
          variant={isAnnual ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange(true)}
          className="rounded-md"
        >
          Annuel
          <span className="ml-2 text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
            -20%
          </span>
        </Button>
      </div>
    </div>
  );
}