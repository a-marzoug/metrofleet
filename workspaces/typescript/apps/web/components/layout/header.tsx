export function Header() {
  return (
    <header className="h-14 bg-sidebar flex items-center justify-end px-6">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <span className="text-sm text-muted-foreground">System Online</span>
      </div>
    </header>
  );
}
