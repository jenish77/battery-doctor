"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const modes = [
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "light", icon: Sun, label: "Light" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1">
      {modes.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          variant="ghost"
          size="icon"
          onClick={() => setTheme(value)}
          className={`h-7 w-7 ${
            theme === value
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title={label}
        >
          <Icon className="h-3.5 w-3.5" />
        </Button>
      ))}
    </div>
  );
}
