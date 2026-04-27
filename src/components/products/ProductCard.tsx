"use client";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  url: string;
  label: string;
  description: string;
  features: string[];
  stack: string[];
}

export default function ProductCard({ product }: { product: Product }) {
  const host = product.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div
      className="border border-[var(--grid-accent)] bg-[var(--grid-panel-bg)] flex flex-col"
      style={{ boxShadow: "0 0 8px var(--grid-accent-glow)" }}
    >
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--grid-accent)] bg-[var(--grid-accent-dim)]">
        <span className="text-[11px] tracking-widest uppercase text-[var(--grid-accent)] font-bold">
          {product.id.toUpperCase()}.APP
        </span>
        <span className="text-[10px] tracking-wider uppercase text-[var(--grid-accent)]">
          {product.label}
        </span>
      </div>

      <div className="flex-1 px-4 py-5 sm:px-6 sm:py-6 flex flex-col gap-5">
        <div>
          <h2 className="text-lg sm:text-xl tracking-widest uppercase font-bold text-[var(--foreground)]">
            {product.name}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[var(--term-cyan)]">
            {product.tagline}
          </p>
        </div>

        <p className="text-xs sm:text-sm text-[var(--term-muted)] leading-relaxed">
          {product.description}
        </p>

        <div>
          <div className="text-[10px] tracking-widest uppercase text-[var(--grid-accent)] opacity-70 mb-2">
            FEATURES
          </div>
          <ul className="space-y-1.5">
            {product.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 text-xs sm:text-sm text-[var(--foreground)]"
              >
                <span className="text-[var(--grid-accent)] mt-0.5 shrink-0">
                  &gt;
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-[10px] tracking-widest uppercase text-[var(--grid-accent)] opacity-70 mb-2">
            STACK
          </div>
          <div className="flex flex-wrap gap-1.5">
            {product.stack.map((s) => (
              <span
                key={s}
                className="text-[10px] tracking-wider uppercase px-2 py-1 border border-[var(--grid-accent)] text-[var(--grid-accent)] bg-[var(--grid-accent-dim)]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-2 border-t border-dashed border-[var(--grid-accent-dim)]">
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs sm:text-sm tracking-widest uppercase font-bold text-[var(--grid-accent)] hover:opacity-80 transition-opacity"
          >
            <span>[&gt;] VISIT {host}</span>
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
