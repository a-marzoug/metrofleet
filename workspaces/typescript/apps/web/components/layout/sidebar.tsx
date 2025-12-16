"use client";

import { Car, DollarSign, History, Map, BarChart3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/live-map", icon: Map, label: "Live Map", subtitle: "Trip visualization", disabled: true },
  { href: "/", icon: DollarSign, label: "Fare Predict", subtitle: "Estimate fares" },
  { href: "/history", icon: History, label: "Trip History", subtitle: "Past records", disabled: true },
  { href: "/analytics", icon: BarChart3, label: "Analytics", subtitle: "Coming soon", disabled: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center neon-border">
            <Car className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg neon-text">METROHAIL</h1>
            <p className="text-[10px] text-muted-foreground tracking-wider">NYC TLC ANALYTICS</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                isActive && "bg-primary/20 neon-border",
                item.disabled && "opacity-50 cursor-not-allowed",
                !isActive && !item.disabled && "hover:bg-secondary"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
              <div>
                <p className={cn("text-sm font-medium", isActive && "text-primary")}>{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.subtitle}</p>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <div>
            <p className="text-xs font-medium">Model Status</p>
            <p className="text-[10px] text-muted-foreground">Fare prediction model ready</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
