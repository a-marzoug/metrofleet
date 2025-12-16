"use client";

import { DollarSign, History, Map, BarChart3, RefreshCw } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const navItems = [
  { href: "/live-map", icon: Map, label: "Live Map", subtitle: "Trip visualization", disabled: true },
  { href: "/", icon: DollarSign, label: "Fare Predict", subtitle: "Estimate fares" },
  { href: "/history", icon: History, label: "Trip History", subtitle: "Past records", disabled: true },
  { href: "/analytics", icon: BarChart3, label: "Analytics", subtitle: "Coming soon", disabled: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-sidebar flex flex-col">
      <div className="p-4">
        <Link href="/" className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.6 }}
            className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_15px_rgba(20,184,166,0.3)]"
          >
            <RefreshCw className="w-5 h-5 text-primary" />
          </motion.div>
          <div>
            <h1 className="font-bold text-lg tracking-wide neon-text">METROHAIL</h1>
            <p className="text-[10px] text-muted-foreground tracking-widest">NYC TLC ANALYTICS</p>
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
                "relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all overflow-hidden",
                item.disabled && "opacity-50 cursor-not-allowed",
                !isActive && !item.disabled && "hover:bg-secondary"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 border border-primary/50 shadow-[0_0_10px_rgba(20,184,166,0.2)] rounded-lg"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={cn("w-5 h-5 z-10", isActive ? "text-primary" : "text-muted-foreground")} />
              <div className="z-10">
                <p className={cn("text-sm font-medium", isActive && "text-primary")}>{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.subtitle}</p>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(20,184,166,0.8)] animate-pulse" />
          <div>
            <p className="text-xs font-medium">Model Status</p>
            <p className="text-[10px] text-muted-foreground">Fare prediction model ready</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
