import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const defaults = (size?: number): Partial<SVGProps<SVGSVGElement>> => ({
  width: size ?? 24,
  height: size ?? 24,
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
});

/** Credit card with angular mecha plating */
export function MechaCreditCard({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M2 7L4 5h16l2 2v10l-2 2H4l-2-2V7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="bevel" />
      <path d="M2 9h20" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      <path d="M6 15.5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
      {/* Circuit accents */}
      <circle cx="18" cy="14" r="1" fill="currentColor" opacity="0.5" />
      <path d="M16 14h-2" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

/** QR code with hexagonal mecha frame */
export function MechaQrCode({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="bevel" />
      <rect x="14" y="3" width="7" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="bevel" />
      <rect x="3" y="14" width="7" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="bevel" />
      <rect x="5.5" y="5.5" width="2" height="2" fill="currentColor" />
      <rect x="16.5" y="5.5" width="2" height="2" fill="currentColor" />
      <rect x="5.5" y="16.5" width="2" height="2" fill="currentColor" />
      {/* Circuit grid */}
      <path d="M14 14h3v3h-3zM19 14v3h2M14 19h3v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
    </svg>
  );
}

/** Clock/timer with angular mecha design */
export function MechaClock({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M12 2L14.5 4H9.5L12 2z" fill="currentColor" opacity="0.4" />
      <circle cx="12" cy="13" r="9" stroke="currentColor" strokeWidth="1.5" />
      {/* Inner hex accent */}
      <path d="M12 7v6l4 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      {/* Tick marks */}
      <path d="M12 5v1M17.5 8l-.7.7M19 13h-1M6 13h1M7.2 8.7l.7.7" stroke="currentColor" strokeWidth="1" opacity="0.4" strokeLinecap="square" />
    </svg>
  );
}

/** Percentage with mecha angular style */
export function MechaPercent({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
      <path d="M6.5 6L8.5 4h1L11.5 6v1L9.5 9h-1L6.5 7V6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="bevel" />
      <path d="M14.5 17L16.5 15h1L19.5 17v1L17.5 20h-1L14.5 18V17z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="bevel" />
    </svg>
  );
}

/** Dollar with angular plating */
export function MechaDollar({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M12 2v20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      <path d="M17 6H10L8 8v2l2 2h4l2 2v2l-2 2H7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="bevel" strokeLinecap="square" />
    </svg>
  );
}

/** Download/withdrawal with mecha arrows */
export function MechaDownload({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      <path d="M7 11l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="bevel" strokeLinecap="square" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      {/* Side plating */}
      <path d="M4 19l2-2M20 19l-2-2" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

/** Home/base with angular mecha structure */
export function MechaHome({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M3 11L12 4l9 7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="bevel" />
      <path d="M5 10v10h14V10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="bevel" />
      <path d="M10 20v-6h4v6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="bevel" />
      {/* Vent accents */}
      <path d="M7 14h2M7 16h1.5" stroke="currentColor" strokeWidth="0.8" opacity="0.4" strokeLinecap="square" />
    </svg>
  );
}

/** Lightning/Zap with sharp mecha edges */
export function MechaZap({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="bevel" fill="currentColor" fillOpacity="0.08" />
    </svg>
  );
}

/** Shield with armored mecha plating */
export function MechaShield({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M12 2L3 6v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="bevel" />
      {/* Inner chevron armor */}
      <path d="M12 6L7 8.5v3.5c0 3.2 2.2 6.2 5 7 2.8-.8 5-3.8 5-7V8.5L12 6z" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="bevel" opacity="0.3" />
      <path d="M10 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="bevel" />
    </svg>
  );
}

/** Repeat/cycle with angular mecha arrows */
export function MechaRepeat({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M17 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="bevel" strokeLinecap="square" />
      <path d="M3 11V9a4 4 0 014-4h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      <path d="M7 22l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="bevel" strokeLinecap="square" />
      <path d="M21 13v2a4 4 0 01-4 4H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

/** Arrow up-right with mecha chevron */
export function MechaArrowUpRight({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M7 17L17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      <path d="M8 7h9v9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="bevel" strokeLinecap="square" />
      {/* Corner accent */}
      <path d="M5 19l2-2" stroke="currentColor" strokeWidth="1" opacity="0.3" strokeLinecap="square" />
    </svg>
  );
}

/** Monitor with angular mecha frame */
export function MechaMonitor({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M3 5L5 3h14l2 2v10l-2 2H5l-2-2V5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="bevel" />
      <path d="M8 19h8M12 17v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      {/* Screen line accents */}
      <path d="M7 8h4M7 10.5h2" stroke="currentColor" strokeWidth="0.8" opacity="0.4" strokeLinecap="square" />
      <circle cx="16" cy="9" r="1.5" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

/** Check circle with mecha hex */
export function MechaCheckCircle({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      {/* Inner hex */}
      <path d="M12 4l6.9 4v8L12 20l-6.9-4V8L12 4z" stroke="currentColor" strokeWidth="0.6" opacity="0.2" strokeLinejoin="bevel" />
      <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="bevel" />
    </svg>
  );
}

/** Headphones with mecha angular design */
export function MechaHeadphones({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M3 18v-6a9 9 0 0118 0v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      <path d="M3 15L5 14h1v5H5l-2-1V15z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="bevel" />
      <path d="M21 15l-2-1h-1v5h1l2-1V15z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="bevel" />
    </svg>
  );
}

/** Mail with mecha angular envelope */
export function MechaMail({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M2 7L4 5h16l2 2v10l-2 2H4l-2-2V7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="bevel" />
      <path d="M2 7l10 6 10-6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="bevel" />
    </svg>
  );
}

/** Chat bubble with mecha angular edges */
export function MechaChat({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M4 4h16l2 2v10l-2 2h-8l-4 4v-4H4l-2-2V6l2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="bevel" />
      {/* Text line accents */}
      <path d="M7 9h10M7 12h6" stroke="currentColor" strokeWidth="1" opacity="0.4" strokeLinecap="square" />
    </svg>
  );
}

/** Phone with mecha angular body */
export function MechaPhone({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M5 4L7 2h10l2 2v16l-2 2H7l-2-2V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="bevel" />
      <path d="M5 5h14M5 17h14" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <circle cx="12" cy="19" r="1" fill="currentColor" opacity="0.5" />
      {/* Screen accent */}
      <path d="M8 8h3M8 10.5h2" stroke="currentColor" strokeWidth="0.8" opacity="0.3" strokeLinecap="square" />
    </svg>
  );
}
