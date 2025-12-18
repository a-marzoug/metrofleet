import { Brain, TrendingUp, Zap, Target } from "lucide-react";
import { motion } from "motion/react";

const features = [
  { icon: Brain, title: "ML-Powered", desc: "Trained on millions of NYC TLC records" },
  { icon: TrendingUp, title: "Dynamic Pricing", desc: "Accounts for time, demand & weather" },
  { icon: Zap, title: "Instant Results", desc: "Sub-second prediction latency" },
  { icon: Target, title: "High Accuracy", desc: "85%+ prediction confidence" },
];

export const FeatureCards = () => (
  <div className="grid grid-cols-4 gap-4">
    {features.map((f, i) => (
      <motion.div
        key={f.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: i * 0.1 }}
        whileHover={{ scale: 1.02 }}
        className="bg-sidebar rounded-xl p-4 text-center transition-colors"
      >
        <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
          <f.icon className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-sm font-medium mb-1">{f.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
      </motion.div>
    ))}
  </div>
);
