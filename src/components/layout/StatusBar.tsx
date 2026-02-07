"use client";

export default function StatusBar() {
  return (
    <div className="flex items-center justify-between px-4 py-1.5 bg-[var(--grid-status-bg)] border-t border-[var(--grid-accent)] text-[10px] tracking-wider uppercase text-[var(--grid-status-text)] shrink-0">
      <div className="flex items-center gap-4">
        <span>DOCKING CHANNEL</span>
        <div className="flex gap-1">
          <div className="w-6 h-1.5 bg-[var(--grid-accent)] opacity-60" />
          <div className="w-4 h-1.5 bg-[var(--grid-accent)] opacity-40" />
          <div className="w-4 h-1.5 bg-[var(--grid-accent)] opacity-20" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline">INTERACTION SEQUENCING</span>
        <span>SYS | 012</span>
      </div>
    </div>
  );
}
