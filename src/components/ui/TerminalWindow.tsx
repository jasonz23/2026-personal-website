interface TerminalWindowProps {
  children: React.ReactNode;
  className?: string;
}

export default function TerminalWindow({
  children,
  className = "",
}: TerminalWindowProps) {
  return (
    <div className={`bg-term-bg p-3 md:p-5 ${className}`}>
      <div className="border-2 border-term-accent rounded-lg p-1 shadow-[0_0_20px_var(--term-shadow)]">
        <div className="border border-term-accent-dim rounded p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
