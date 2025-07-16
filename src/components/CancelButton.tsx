import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface CancelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export function CancelButton({ children = "Cancel", ...props }: CancelButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="border-destructive text-destructive bg-transparent hover:bg-destructive hover:text-destructive-foreground"
      {...props}
    >
      <X className="h-4 w-4 inline-block align-text-bottom" />
      {children}
    </Button>
  );
} 