import { History } from "lucide-react";

export const HistoryEmptyState = () => (
  <div className="bg-sidebar rounded-xl p-8 text-center">
    <History className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
    <p className="text-muted-foreground">No trips found</p>
    <p className="text-sm text-muted-foreground mt-1">Make a fare prediction to see it here</p>
  </div>
);
