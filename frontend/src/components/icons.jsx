// Minimal, aesthetic line-icon set (Feather-style) used across the site instead of emoji.
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function UploadIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
      <path d="M12 16V4" />
      <path d="M7 9l5-5 5 5" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

export function TagIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
      <path d="M12.59 2.59a2 2 0 0 0-1.42-.59H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.41l8.83 8.83a2 2 0 0 0 2.82 0l7.17-7.17a2 2 0 0 0 0-2.82z" />
      <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MessageIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export function CheckCircleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  );
}

export function LaptopIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
      <rect x="4" y="4" width="16" height="11" rx="1.2" />
      <path d="M2 19h20" />
    </svg>
  );
}

export function BookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

export function BagIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
      <path d="M6 2l1.5 5M18 2l-1.5 5" />
      <rect x="3.5" y="7" width="17" height="14" rx="2" />
    </svg>
  );
}

export function CouchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
      <path d="M4 13a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3H4z" />
      <path d="M3 13v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1" />
      <path d="M18 16v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-4" />
      <path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" />
    </svg>
  );
}

export function GridIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export function ShieldIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
      <path d="M12 2l8 3.5v6c0 5-3.4 8.5-8 10.5-4.6-2-8-5.5-8-10.5v-6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function CoinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M9.5 9.2c0-1.2 1.1-2.2 2.5-2.2s2.5 1 2.5 2c0 3-5 1.5-5 4.5 0 1 1.1 2 2.5 2s2.5-1 2.5-2.2" />
    </svg>
  );
}

export function ChatIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
      <path d="M4 4h16v11H8l-4 4z" />
    </svg>
  );
}

export function UsersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function PackageIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  );
}

export function TrendingUpIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
      <path d="M23 6l-9.5 9.5-5-5L1 18" />
      <path d="M17 6h6v6" />
    </svg>
  );
}
