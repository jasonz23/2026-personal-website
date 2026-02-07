interface TerminalCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export default function TerminalCard({
  children,
  title,
  className = "",
}: TerminalCardProps) {
  return (
    <div
      className={`border border-term-accent-dim rounded-md bg-term-bg p-4 mb-2 ${className}`}
    >
      {title && (
        <div className="text-term-cyan font-bold mb-2 pb-1 border-b border-term-accent-dim">
          {title}
        </div>
      )}
      <div className="text-term-text text-sm">{children}</div>
    </div>
  );
}
