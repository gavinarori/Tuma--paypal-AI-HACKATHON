import type { SVGProps } from "react";

// Shared hand-drawn art for Tuma: acacia, baobab, a row of diamonds, and a small savanna scene.
// Pure SVG, no client code, so it works in both server and client components.

export function Acacia(props: SVGProps<SVGGElement>) {
  return (
    <g {...props}>
      <path d="M0 100C2 72-4 52-16 30M0 100C0 72 8 52 24 32" stroke="#0a3d2e" strokeWidth="5" strokeLinecap="round" fill="none" />
      <ellipse cx="0" cy="20" rx="80" ry="13" fill="#0a3d2e" />
      <ellipse cx="34" cy="8" rx="48" ry="10" fill="#0a3d2e" />
    </g>
  );
}

export function Baobab(props: SVGProps<SVGGElement>) {
  return (
    <g {...props}>
      <path d="M-20 124C-32 84-28 52-14 38h28c14 14 18 46 6 86z" fill="#0a3d2e" />
      <path d="M-12 40L-36 14M-4 38L-12 6M6 38L16 4M14 40L38 16" stroke="#0a3d2e" strokeWidth="4" strokeLinecap="round" fill="none" />
      {[[-36, 12], [-12, 4], [16, 2], [38, 14]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="7" fill="#0a3d2e" />)}
    </g>
  );
}

export function Diamonds({ className = "" }: { className?: string }) {
  const fills = ["var(--gold)", "var(--brand)", "var(--clay)", "var(--brand)", "var(--gold)"];
  return (
    <svg viewBox="0 0 132 12" className={`mx-auto h-3 w-32 ${className}`} aria-hidden="true">
      <path d="M0 6H132" stroke="var(--line)" strokeWidth="2" />
      {fills.map((f, i) => <path key={i} d={`M${i * 30} 6l6-6 6 6-6 6z`} fill={f} />)}
    </svg>
  );
}

// Small scene for the welcome screen: sun, hills, acacia, baobab
export function Savanna({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 96" className={`h-auto w-full ${className}`} aria-hidden="true" preserveAspectRatio="xMidYMax meet">
      <circle cx="238" cy="58" r="26" fill="var(--gold)" opacity=".85" />
      <path d="M0 70C50 52 100 72 160 60S270 70 320 58V96H0z" fill="#bfdcca" />
      <path d="M0 84C60 72 120 88 190 78S290 84 320 78V96H0z" fill="#7fb89d" />
      <Acacia transform="translate(72 30) scale(.5)" />
      <Baobab transform="translate(262 30) scale(.46)" />
      <path d="M0 92C80 86 200 94 320 88V96H0z" fill="var(--brand)" />
    </svg>
  );
}

export function Backdrop() {
  const rays = Array.from({ length: 16 }, (_, i) => {
    const a = (i * Math.PI) / 8;
    const p = (r: number) => `${(100 + r * Math.cos(a)).toFixed(1)} ${(100 + r * Math.sin(a)).toFixed(1)}`;
    return `M${p(56)}L${p(i % 2 ? 76 : 88)}`;
  });
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop-cloth" />
      <svg className="backdrop-sun" viewBox="0 0 200 200">
        <g className="rays" stroke="#d9951a" strokeWidth="5" strokeLinecap="round" opacity=".7">
          {rays.map((d) => <path key={d} d={d} />)}
        </g>
        <circle cx="100" cy="100" r="42" fill="#d9951a" opacity=".8" />
      </svg>
      <svg className="backdrop-land" viewBox="0 0 1440 360" preserveAspectRatio="xMidYMax slice">
        <path d="M0 220C180 160 340 200 520 170S900 215 1100 180 1360 190 1440 170V360H0z" fill="#bfdcca" />
        <Acacia transform="translate(720 100) scale(.45)" />
        <path d="M0 270C200 225 380 275 600 245S1000 285 1240 250 1400 250 1440 244V360H0z" fill="#9ccbb2" />
        <Acacia transform="translate(210 150)" />
        <Baobab transform="translate(1250 138)" />
        <path d="M0 320C240 290 460 330 700 308S1180 332 1440 300V360H0z" fill="#2f8f6e" />
      </svg>
    </div>
  );
}

// Tuma logo mark: a send arrow trailing woven gold and clay threads
export function Mark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <rect width="96" height="96" rx="26" fill="#0e7c5a" />
      <g strokeLinecap="round" fill="none">
        <path d="M24 37h32" stroke="#d9951a" strokeWidth="6" />
        <path d="M24 59h32" stroke="#e8764a" strokeWidth="6" />
        <path d="M18 48h52" stroke="#ffffff" strokeWidth="9" />
        <path d="M52 27l21 21-21 21" stroke="#ffffff" strokeWidth="9" strokeLinejoin="round" />
      </g>
    </svg>
  );
}