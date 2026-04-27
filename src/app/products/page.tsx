"use client";

import Link from "next/link";
import HeaderBar from "@/components/layout/HeaderBar";
import StatusBar from "@/components/layout/StatusBar";
import ProductCard, { type Product } from "@/components/products/ProductCard";

const BUSINESS_NAME = "JYD ZHAO TECHNOLOGY CONSULTING";

const PRODUCTS: Product[] = [
  {
    id: "animeid",
    name: "Anime ID",
    tagline: "Reputation infrastructure for the anime & manga industry",
    url: "https://animeid.app",
    label: "CLIENT WORK",
    description: [
      "Built for a client to support projects, creators, brands, and IP across",
      "the anime & manga industry. Attests reputation with verifiable and",
      "authentic sources, ensuring quality of trusted identities and accurately",
      "rewarding those who legitimately deserve it.",
    ].join(" "),
    features: [
      "Verifiable on-chain identity attestation",
      "Reputation primitives for creators & brands",
      "Reward distribution for legitimate contributors",
    ],
    stack: [
      "Next.js",
      "Nest.js",
      "TypeScript",
      "Solidity",
      "PostgreSQL",
      "Tailwind",
    ],
  },
  {
    id: "yourtechstack",
    name: "Your Tech Stack",
    tagline: "Pick a stack. Get recommendations, pros, cons, guides & prompts.",
    url: "https://yourtechstack.app",
    label: "OWN PRODUCT",
    description: [
      "An interactive tool that helps developers pick the right tech stack.",
      "Delivers tailored recommendations, weighted pros and cons, integration",
      "guides, and ready-to-use AI prompts that can be pasted into editors or",
      "chatbots to bootstrap a new project.",
    ].join(" "),
    features: [
      "Stack picker with curated recommendations",
      "Pros & cons for every framework / library",
      "Step-by-step setup & integration guides",
      "Auto-generated prompts for AI coding tools",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind", "AI"],
  },
];

export default function SaasPage() {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[var(--background)]">
      <HeaderBar />
      <main className="flex-1 min-h-0 min-w-0 overflow-y-auto bg-[var(--grid-accent-dim)] p-1 sm:p-2 md:p-3">
        <div className="flex flex-col gap-[2px]">
          <BusinessHeader />
          <BusinessSummary />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[2px]">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <ContactPanel />
          <FooterPanel />
        </div>
      </main>
      <StatusBar />
    </div>
  );
}

function BusinessHeader() {
  return (
    <div
      className="border border-[var(--grid-accent)] bg-[var(--grid-panel-bg)]"
      style={{ boxShadow: "0 0 8px var(--grid-accent-glow)" }}
    >
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--grid-accent)] bg-[var(--grid-accent-dim)]">
        <span className="text-[11px] tracking-widest uppercase text-[var(--grid-accent)] font-bold">
          BUSINESS.PROFILE
        </span>
        <span className="text-[10px] tracking-wider uppercase text-[var(--grid-accent)]">
          REGISTERED
        </span>
      </div>
      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-[var(--grid-accent)] opacity-70 mb-2">
          <span>~/products</span>
          <span className="opacity-50">{"//"}</span>
          <span>LEGAL.ENTITY</span>
        </div>
        <h1 className="text-xl sm:text-3xl tracking-widest uppercase font-bold text-[var(--foreground)] break-words">
          {BUSINESS_NAME}
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-[var(--term-muted)] max-w-3xl leading-relaxed">
          A technology consulting business operated by Jason Zhao, building and
          shipping software products &mdash; both for clients and as
          first-party SaaS. The directory below catalogs the live products
          delivered under this entity.
        </p>
      </div>
    </div>
  );
}

function BusinessSummary() {
  const rows: Array<[string, string]> = [
    ["Legal Name", BUSINESS_NAME],
    ["Operator", "Jason Zhao"],
    ["Industry", "Software / Technology Consulting"],
    ["Services", "Custom software, SaaS products, technical advisory"],
    ["Location", "Vancouver, BC, Canada"],
    ["Status", "Active"],
  ];

  return (
    <div
      className="border border-[var(--grid-accent)] bg-[var(--grid-panel-bg)]"
      style={{ boxShadow: "0 0 8px var(--grid-accent-glow)" }}
    >
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--grid-accent)] bg-[var(--grid-accent-dim)]">
        <span className="text-[11px] tracking-widest uppercase text-[var(--grid-accent)] font-bold">
          ENTITY.MANIFEST
        </span>
        <span className="text-[10px] tracking-wider uppercase text-[var(--grid-accent)]">
          DETAILS
        </span>
      </div>
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs sm:text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex gap-3 border-b border-dashed border-[var(--grid-accent-dim)] py-1.5">
              <dt className="text-[10px] sm:text-[11px] tracking-widest uppercase text-[var(--grid-accent)] opacity-70 w-24 shrink-0">
                {k}
              </dt>
              <dd className="text-[var(--foreground)]">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function ContactPanel() {
  return (
    <div
      className="border border-[var(--grid-accent)] bg-[var(--grid-panel-bg)]"
      style={{ boxShadow: "0 0 8px var(--grid-accent-glow)" }}
    >
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--grid-accent)] bg-[var(--grid-accent-dim)]">
        <span className="text-[11px] tracking-widest uppercase text-[var(--grid-accent)] font-bold">
          CONTACT // SUPPORT
        </span>
        <span className="text-[10px] tracking-wider uppercase text-[var(--grid-accent)]">
          OPEN
        </span>
      </div>
      <div className="px-4 py-4 sm:px-6 sm:py-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
        <ContactRow label="Email" value="jason1382311@gmail.com" href="mailto:jason1382311@gmail.com" />
        <ContactRow label="Website" value="jasonydzhao.com" href="https://jasonydzhao.com" external />
        <ContactRow label="Location" value="Vancouver, BC, Canada" />
      </div>
    </div>
  );
}

function ContactRow({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <span className="text-[var(--foreground)] break-all hover:text-[var(--grid-accent)] transition-colors">
      {value}
    </span>
  );
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] tracking-widest uppercase text-[var(--grid-accent)] opacity-70">
        {label}
      </span>
      {href ? (
        <a
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}

function FooterPanel() {
  return (
    <div
      className="border border-[var(--grid-accent)] bg-[var(--grid-panel-bg)] px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] tracking-widest uppercase text-[var(--grid-accent)]"
      style={{ boxShadow: "0 0 8px var(--grid-accent-glow)" }}
    >
      <span className="opacity-70">{BUSINESS_NAME} &copy; {new Date().getFullYear()}</span>
      <Link
        href="/"
        className="hover:underline opacity-90 hover:opacity-100 transition-opacity"
      >
        [&lt;] RETURN TO TERMINAL
      </Link>
    </div>
  );
}
