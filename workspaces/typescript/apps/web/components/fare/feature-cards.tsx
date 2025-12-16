import { Brain, TrendingUp, Zap, Target } from "lucide-react";

const features = [
  { icon: Brain, title: "ML-Powered", desc: "Trained on millions of NYC TLC records" },
  { icon: TrendingUp, title: "Dynamic Pricing", desc: "Accounts for time, demand & weather" },
  { icon: Zap, title: "Instant Results", desc: "Sub-second prediction latency" },
  { icon: Target, title: "High Accuracy", desc: "85%+ prediction confidence" },
];

export function FeatureCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {features.map((f) => (
        <div key={f.title} className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
            <f.icon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-sm font-medium mb-1">{f.title}</h3>
          <p className="text-xs text-muted-foreground">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}
