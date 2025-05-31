
import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
}

export function ThemeToggle({ className, variant = "ghost" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  
  // Add mounted state to prevent hydration mismatch
  const [mounted, setMounted] = React.useState(false);
  
  // Only show the toggle after first render to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <Button variant={variant} size="sm" className={cn("h-8 w-8 px-0", className)}><span className="sr-only">Toggle theme</span></Button>;
  }
  
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn("h-8 w-8 px-0", className)}
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
