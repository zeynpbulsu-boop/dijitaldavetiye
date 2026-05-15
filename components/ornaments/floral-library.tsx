/**
 * Floral ornament library — 6 hand-coded SVG components.
 *
 * Each motif uses NUVE's palette family:
 *   cognac    #8C5A3C   — anchors, deep petal centers
 *   rose-taupe #B98E78  — mid-tone petals
 *   blush     #E8C9B7   — outer petal washes (derived, not a brand token)
 *   sage      #8DA286   — leaves, stems (derived earthier sage)
 *   ink/22    rgba(43,30,22,0.22) — fine outline strokes
 *
 * Style notes:
 *   - "Watercolor" feel is faked by stacking multiple <path> with low opacity
 *     fills in slightly different hues, then drawing a thin outline on top.
 *   - Curves are intentionally asymmetric — too-perfect symmetry reads as
 *     vector clipart, not botanical illustration.
 *   - Each component accepts size + opacity for ambient placement use cases.
 *
 * All paths are original creative work for NUVE — no traced references.
 */

type FloralProps = {
  size?: number;
  /** 0–1 multiplier on top of internal fill opacity. */
  opacity?: number;
  /** Mirror horizontally — useful for placing the same motif on the opposite corner. */
  flip?: boolean;
  className?: string;
};

const COGNAC = "#8C5A3C";
const ROSE = "#B98E78";
const BLUSH = "#E8C9B7";
const BLUSH_DEEP = "#D8A892";
const SAGE = "#8DA286";
const SAGE_DEEP = "#6E8470";
const INK_22 = "rgba(43, 30, 22, 0.22)";
const INK_14 = "rgba(43, 30, 22, 0.14)";

function svgWrap(size: number, viewBox: string, opacity: number, flip: boolean, className: string | undefined, children: React.ReactNode) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ opacity, transform: flip ? "scaleX(-1)" : undefined }}
      className={className}
    >
      {children}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  1. PEONY — full open bloom with 14 stacked petals                 */
/* ------------------------------------------------------------------ */
export function Peony({ size = 220, opacity = 1, flip = false, className }: FloralProps) {
  return svgWrap(
    size,
    "0 0 220 220",
    opacity,
    flip,
    className,
    <>
      {/* Outer petal layer — blush wash, 6 petals */}
      <g fill={BLUSH} fillOpacity="0.65">
        <path d="M110 38 Q 70 28, 56 60 Q 50 92, 84 96 Q 96 78, 110 66 Z" />
        <path d="M164 60 Q 198 70, 196 108 Q 188 138, 156 132 Q 140 112, 134 90 Z" />
        <path d="M188 130 Q 200 168, 162 188 Q 130 192, 124 158 Q 142 142, 160 130 Z" />
        <path d="M140 192 Q 110 210, 78 188 Q 60 162, 90 148 Q 110 158, 128 168 Z" />
        <path d="M48 168 Q 22 138, 38 102 Q 60 78, 82 100 Q 80 124, 76 148 Z" />
        <path d="M40 80 Q 56 46, 96 44 Q 116 60, 102 82 Q 80 84, 60 84 Z" />
      </g>
      {/* Mid petal layer — rose-taupe, 8 petals */}
      <g fill={ROSE} fillOpacity="0.7">
        <path d="M110 56 Q 88 56, 78 76 Q 84 96, 104 96 Q 116 84, 110 56 Z" />
        <path d="M140 64 Q 156 72, 154 96 Q 142 108, 124 98 Q 124 80, 140 64 Z" />
        <path d="M156 96 Q 168 110, 158 128 Q 138 132, 130 116 Q 138 100, 156 96 Z" />
        <path d="M148 132 Q 140 152, 118 152 Q 106 138, 118 122 Q 134 122, 148 132 Z" />
        <path d="M112 158 Q 92 154, 84 134 Q 96 122, 116 128 Q 122 144, 112 158 Z" />
        <path d="M76 130 Q 68 116, 76 96 Q 96 92, 102 110 Q 96 128, 76 130 Z" />
        <path d="M76 92 Q 76 74, 92 64 Q 110 70, 110 88 Q 96 100, 76 92 Z" />
        <path d="M130 144 Q 134 124, 116 116 Q 102 124, 104 138 Q 118 150, 130 144 Z" />
      </g>
      {/* Inner ruffle — cognac center cluster */}
      <g fill={COGNAC} fillOpacity="0.78">
        <ellipse cx="110" cy="105" rx="14" ry="11" />
        <path d="M104 100 Q 108 90, 116 92 Q 122 100, 116 108 Q 108 110, 104 100 Z" />
        <path d="M100 110 Q 96 118, 104 122 Q 114 122, 114 114 Z" />
      </g>
      {/* Tiny stamens — gold dots */}
      <g fill="#C9A961">
        <circle cx="106" cy="102" r="1.2" />
        <circle cx="113" cy="106" r="1.2" />
        <circle cx="109" cy="112" r="1.2" />
        <circle cx="115" cy="100" r="1" />
        <circle cx="103" cy="108" r="1" />
      </g>
      {/* Outline accents — fine ink strokes */}
      <g fill="none" stroke={INK_22} strokeWidth="0.7" strokeLinecap="round">
        <path d="M110 56 Q 95 70, 92 92" />
        <path d="M140 64 Q 138 84, 130 96" />
        <path d="M156 96 Q 146 110, 140 122" />
        <path d="M76 130 Q 88 122, 96 116" />
      </g>
      {/* Stem stub + leaf */}
      <g fill="none" stroke={SAGE_DEEP} strokeWidth="1.2" strokeLinecap="round">
        <path d="M110 168 Q 112 184, 116 200" />
      </g>
      <g fill={SAGE} fillOpacity="0.6">
        <path d="M116 182 Q 132 178, 138 192 Q 128 200, 116 196 Z" />
      </g>
    </>,
  );
}

/* ------------------------------------------------------------------ */
/*  2. ROSE VINE — climbing stem, 3 buds + 5 leaves                   */
/* ------------------------------------------------------------------ */
export function RoseVine({ size = 240, opacity = 1, flip = false, className }: FloralProps) {
  return svgWrap(
    size,
    "0 0 160 320",
    opacity,
    flip,
    className,
    <>
      {/* Main stem — flowing S-curve */}
      <path
        d="M40 300 Q 60 240, 50 200 Q 30 160, 60 120 Q 90 80, 80 40"
        fill="none"
        stroke={SAGE_DEEP}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Small thorny ticks along stem */}
      <g stroke={SAGE_DEEP} strokeWidth="1" strokeLinecap="round">
        <line x1="56" y1="260" x2="52" y2="266" />
        <line x1="46" y1="220" x2="42" y2="224" />
        <line x1="38" y1="178" x2="36" y2="184" />
        <line x1="58" y1="140" x2="55" y2="146" />
        <line x1="80" y1="100" x2="78" y2="106" />
      </g>
      {/* Leaves — 5 pairs along the stem */}
      <g>
        <Leaf x={32} y={258} rotate={-30} />
        <Leaf x={70} y={228} rotate={20} flip />
        <Leaf x={22} y={194} rotate={-50} />
        <Leaf x={70} y={158} rotate={30} flip />
        <Leaf x={42} y={120} rotate={-25} />
      </g>
      {/* Three rose buds — bottom open, mid half-open, top tight */}
      <RoseBud x={42} y={280} scale={1} open />
      <RoseBud x={54} y={170} scale={0.85} half />
      <RoseBud x={84} y={42} scale={0.7} />
    </>,
  );
}

function Leaf({
  x,
  y,
  rotate,
  flip,
}: {
  x: number;
  y: number;
  rotate: number;
  flip?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) ${flip ? "scale(-1 1)" : ""}`}>
      <path
        d="M0 0 Q 12 -4, 22 -2 Q 28 6, 20 14 Q 8 12, 0 0 Z"
        fill={SAGE}
        fillOpacity="0.7"
      />
      <path
        d="M0 0 Q 10 4, 20 6"
        fill="none"
        stroke={SAGE_DEEP}
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </g>
  );
}

function RoseBud({
  x,
  y,
  scale,
  open,
  half,
}: {
  x: number;
  y: number;
  scale: number;
  open?: boolean;
  half?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* Calyx — green base */}
      <path
        d="M-10 8 Q -2 14, 6 12 Q 12 8, 10 0 Q 0 4, -10 8 Z"
        fill={SAGE_DEEP}
        fillOpacity="0.7"
      />
      {open ? (
        <>
          {/* Open rose — 5 visible petals */}
          <g fill={BLUSH} fillOpacity="0.85">
            <path d="M0 -12 Q -14 -10, -16 4 Q -6 8, 0 -2 Z" />
            <path d="M0 -12 Q 14 -10, 16 4 Q 6 8, 0 -2 Z" />
            <path d="M-12 -2 Q -16 12, -4 14 Q 0 6, -6 -4 Z" />
            <path d="M12 -2 Q 16 12, 4 14 Q 0 6, 6 -4 Z" />
          </g>
          <g fill={ROSE} fillOpacity="0.85">
            <path d="M-4 -6 Q -8 4, 0 8 Q 8 4, 4 -6 Q 0 -10, -4 -6 Z" />
            <ellipse cx="0" cy="0" rx="3" ry="4" fill={COGNAC} fillOpacity="0.85" />
          </g>
        </>
      ) : half ? (
        <>
          {/* Half-open — fewer petals, more bud */}
          <g fill={ROSE} fillOpacity="0.85">
            <path d="M-8 -4 Q -12 6, -2 8 Q 4 4, -4 -6 Z" />
            <path d="M8 -4 Q 12 6, 2 8 Q -4 4, 4 -6 Z" />
            <path d="M-3 -10 Q -6 -2, 0 2 Q 6 -2, 3 -10 Q 0 -14, -3 -10 Z" fill={COGNAC} fillOpacity="0.85" />
          </g>
        </>
      ) : (
        <>
          {/* Tight bud — almost a teardrop */}
          <path
            d="M-5 -10 Q -8 0, -4 6 Q 0 8, 4 6 Q 8 0, 5 -10 Q 0 -14, -5 -10 Z"
            fill={COGNAC}
            fillOpacity="0.9"
          />
          <path
            d="M-3 -8 Q -2 0, 0 4 Q 2 0, 3 -8"
            fill="none"
            stroke="#F2EEE6"
            strokeOpacity="0.4"
            strokeWidth="0.6"
          />
        </>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  3. EUCALYPTUS SPRIG — silver-dollar leaves on a curving stem      */
/* ------------------------------------------------------------------ */
export function Eucalyptus({ size = 240, opacity = 1, flip = false, className }: FloralProps) {
  return svgWrap(
    size,
    "0 0 200 280",
    opacity,
    flip,
    className,
    <>
      {/* Main stem */}
      <path
        d="M100 270 Q 90 220, 110 170 Q 130 110, 100 40"
        fill="none"
        stroke={SAGE_DEEP}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Pairs of round leaves */}
      {[
        { y: 250, side: -1, size: 18 },
        { y: 246, side: 1, size: 16 },
        { y: 220, side: -1, size: 20 },
        { y: 214, side: 1, size: 17 },
        { y: 188, side: -1, size: 22 },
        { y: 184, side: 1, size: 18 },
        { y: 154, side: -1, size: 19 },
        { y: 148, side: 1, size: 21 },
        { y: 118, side: -1, size: 17 },
        { y: 114, side: 1, size: 18 },
        { y: 88, side: -1, size: 14 },
        { y: 82, side: 1, size: 15 },
        { y: 60, side: -1, size: 11 },
        { y: 54, side: 1, size: 12 },
      ].map((l, i) => {
        const cx = 100 + l.side * (8 + l.size * 0.7);
        return (
          <g key={i}>
            <ellipse
              cx={cx}
              cy={l.y}
              rx={l.size * 0.85}
              ry={l.size * 0.7}
              fill={i % 2 === 0 ? SAGE : SAGE_DEEP}
              fillOpacity="0.65"
              transform={`rotate(${l.side * 18} ${cx} ${l.y})`}
            />
            <ellipse
              cx={cx}
              cy={l.y}
              rx={l.size * 0.85}
              ry={l.size * 0.7}
              fill="none"
              stroke={SAGE_DEEP}
              strokeOpacity="0.4"
              strokeWidth="0.6"
              transform={`rotate(${l.side * 18} ${cx} ${l.y})`}
            />
            {/* Connector twig */}
            <path
              d={`M100 ${l.y + l.side * 2} L ${cx - l.side * l.size * 0.6} ${l.y}`}
              stroke={SAGE_DEEP}
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          </g>
        );
      })}
    </>,
  );
}

/* ------------------------------------------------------------------ */
/*  4. ANEMONE — single bloom, 6 petals around dark center            */
/* ------------------------------------------------------------------ */
export function Anemone({ size = 180, opacity = 1, flip = false, className }: FloralProps) {
  return svgWrap(
    size,
    "0 0 180 180",
    opacity,
    flip,
    className,
    <>
      {/* 6 petals around center — pale blush wash */}
      <g fill={BLUSH} fillOpacity="0.85">
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i * 60 * Math.PI) / 180;
          const cx = 90 + Math.cos(angle) * 36;
          const cy = 90 + Math.sin(angle) * 36;
          return (
            <ellipse
              key={i}
              cx={cx}
              cy={cy}
              rx="32"
              ry="20"
              transform={`rotate(${i * 60} ${cx} ${cy})`}
            />
          );
        })}
      </g>
      {/* Petal vein lines */}
      <g fill="none" stroke={BLUSH_DEEP} strokeOpacity="0.5" strokeWidth="0.8">
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i * 60 * Math.PI) / 180;
          const x2 = 90 + Math.cos(angle) * 64;
          const y2 = 90 + Math.sin(angle) * 64;
          return <line key={i} x1="90" y1="90" x2={x2} y2={y2} />;
        })}
      </g>
      {/* Inner petal accents */}
      <g fill={ROSE} fillOpacity="0.55">
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i * 60 * Math.PI) / 180;
          const cx = 90 + Math.cos(angle) * 22;
          const cy = 90 + Math.sin(angle) * 22;
          return (
            <ellipse
              key={i}
              cx={cx}
              cy={cy}
              rx="14"
              ry="8"
              transform={`rotate(${i * 60} ${cx} ${cy})`}
            />
          );
        })}
      </g>
      {/* Dark center — anemone signature */}
      <circle cx="90" cy="90" r="14" fill="#2B1E16" fillOpacity="0.88" />
      {/* Stamen dots radiating from center */}
      <g fill="#2B1E16">
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 22.5 * Math.PI) / 180;
          const cx = 90 + Math.cos(angle) * 10;
          const cy = 90 + Math.sin(angle) * 10;
          return <circle key={i} cx={cx} cy={cy} r="1.2" />;
        })}
      </g>
      <circle cx="90" cy="90" r="4" fill={COGNAC} />
    </>,
  );
}

/* ------------------------------------------------------------------ */
/*  5. BABY'S BREATH — cluster of tiny dots in soft cloud shape       */
/* ------------------------------------------------------------------ */
export function BabysBreath({ size = 220, opacity = 1, flip = false, className }: FloralProps) {
  // Pre-computed dot positions — fixed seed so SSR matches client.
  const dots = [
    [90, 60], [110, 58], [128, 64], [76, 76], [98, 78], [120, 82], [142, 78],
    [60, 92], [82, 96], [104, 100], [124, 100], [148, 94], [168, 88],
    [50, 116], [72, 118], [94, 124], [118, 126], [140, 122], [162, 114], [180, 108],
    [44, 142], [68, 146], [92, 150], [116, 152], [138, 148], [160, 142], [182, 132],
    [56, 168], [80, 170], [104, 174], [126, 172], [148, 166], [170, 156],
    [72, 192], [96, 192], [120, 188], [142, 180],
  ];

  return svgWrap(
    size,
    "0 0 220 220",
    opacity,
    flip,
    className,
    <>
      {/* Stem branches — fan out from bottom */}
      <g fill="none" stroke={SAGE_DEEP} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.7">
        <path d="M110 200 Q 90 170, 70 130 Q 56 100, 50 70" />
        <path d="M110 200 Q 110 170, 110 130 Q 110 100, 100 60" />
        <path d="M110 200 Q 130 170, 150 130 Q 168 100, 170 70" />
        <path d="M110 200 Q 100 170, 80 140 Q 60 110, 56 90" />
        <path d="M110 200 Q 120 170, 140 140 Q 158 110, 160 90" />
      </g>
      {/* Cloud of tiny flowers */}
      <g fill={BLUSH}>
        {dots.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={1.5 + ((i * 7) % 5) * 0.4}
            fillOpacity={0.55 + ((i * 3) % 10) * 0.04}
          />
        ))}
      </g>
      <g fill={ROSE} fillOpacity="0.45">
        {dots.filter((_, i) => i % 4 === 0).map(([x, y], i) => (
          <circle key={`r-${i}`} cx={x + 2} cy={y + 1} r="2.2" />
        ))}
      </g>
      <g fill={COGNAC} fillOpacity="0.5">
        {dots.filter((_, i) => i % 7 === 0).map(([x, y], i) => (
          <circle key={`c-${i}`} cx={x - 1} cy={y - 1} r="1.2" />
        ))}
      </g>
    </>,
  );
}

/* ------------------------------------------------------------------ */
/*  6. FERN FROND — single curling frond with paired pinnae            */
/* ------------------------------------------------------------------ */
export function FernFrond({ size = 220, opacity = 1, flip = false, className }: FloralProps) {
  return svgWrap(
    size,
    "0 0 200 320",
    opacity,
    flip,
    className,
    <>
      {/* Main spine — curling like a fiddlehead at top */}
      <path
        d="M100 300 Q 96 240, 102 180 Q 108 120, 130 80 Q 148 50, 138 32 Q 124 22, 116 38 Q 124 50, 138 46"
        fill="none"
        stroke={SAGE_DEEP}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Pairs of pinnae — get smaller toward the curl */}
      {[
        { y: 290, len: 28, angle: 35 },
        { y: 270, len: 32, angle: 38 },
        { y: 248, len: 36, angle: 40 },
        { y: 224, len: 38, angle: 42 },
        { y: 200, len: 36, angle: 44 },
        { y: 176, len: 32, angle: 46 },
        { y: 154, len: 28, angle: 48 },
        { y: 132, len: 24, angle: 50 },
        { y: 112, len: 18, angle: 52 },
        { y: 94, len: 14, angle: 55 },
      ].map((p, i) => (
        <g key={i}>
          {/* Left pinna */}
          <g transform={`translate(100 ${p.y}) rotate(${-p.angle})`}>
            <path
              d={`M0 0 Q ${p.len * 0.3} -3, ${p.len} 0 Q ${p.len * 0.6} 6, 0 0 Z`}
              fill={SAGE}
              fillOpacity="0.65"
            />
            <path
              d={`M0 0 L ${p.len} 0`}
              stroke={SAGE_DEEP}
              strokeWidth="0.6"
              strokeOpacity="0.6"
              fill="none"
            />
            {/* Tiny serrations */}
            {Array.from({ length: Math.max(2, Math.floor(p.len / 6)) }).map((_, j) => {
              const x = (p.len * (j + 1)) / (Math.floor(p.len / 6) + 1);
              return (
                <line
                  key={j}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="-3"
                  stroke={SAGE_DEEP}
                  strokeWidth="0.5"
                  strokeOpacity="0.5"
                />
              );
            })}
          </g>
          {/* Right pinna */}
          <g transform={`translate(100 ${p.y}) rotate(${p.angle}) scale(1 -1)`}>
            <path
              d={`M0 0 Q ${p.len * 0.3} -3, ${p.len} 0 Q ${p.len * 0.6} 6, 0 0 Z`}
              fill={SAGE}
              fillOpacity="0.55"
            />
            <path
              d={`M0 0 L ${p.len} 0`}
              stroke={SAGE_DEEP}
              strokeWidth="0.6"
              strokeOpacity="0.6"
              fill="none"
            />
          </g>
        </g>
      ))}
      {/* Tip dot — fiddlehead center */}
      <circle cx="138" cy="46" r="2.5" fill={COGNAC} fillOpacity="0.7" />
    </>,
  );
}

/* ------------------------------------------------------------------ */
/*  Decorative line frame — gold-leaf style border for accent use     */
/* ------------------------------------------------------------------ */
export function VintageFrame({
  width = 600,
  height = 360,
  opacity = 1,
  className,
}: {
  width?: number;
  height?: number;
  opacity?: number;
  className?: string;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
      style={{ opacity }}
    >
      {/* Inner double rule */}
      <rect
        x="14"
        y="14"
        width={width - 28}
        height={height - 28}
        fill="none"
        stroke="#C9A961"
        strokeOpacity="0.65"
        strokeWidth="0.8"
      />
      <rect
        x="20"
        y="20"
        width={width - 40}
        height={height - 40}
        fill="none"
        stroke={INK_14}
        strokeWidth="0.6"
      />
      {/* Corner ornament fleurons */}
      {[
        [20, 20, 0],
        [width - 20, 20, 90],
        [width - 20, height - 20, 180],
        [20, height - 20, 270],
      ].map(([cx, cy, rot], i) => (
        <g key={i} transform={`translate(${cx} ${cy}) rotate(${rot})`}>
          <path
            d="M0 0 L 22 0 M 0 0 L 0 22"
            stroke="#C9A961"
            strokeOpacity="0.85"
            strokeWidth="0.8"
          />
          <circle r="2" fill="#C9A961" fillOpacity="0.8" />
          <path
            d="M6 6 Q 14 4, 18 12 Q 14 18, 6 14 Z"
            fill="#C9A961"
            fillOpacity="0.4"
          />
        </g>
      ))}
      {/* Center top tiny crown ornament */}
      <g transform={`translate(${width / 2} 18)`}>
        <path
          d="M -16 0 Q -8 -8, 0 0 Q 8 -8, 16 0"
          fill="none"
          stroke="#C9A961"
          strokeOpacity="0.85"
          strokeWidth="0.9"
        />
        <circle r="1.5" cy="-2" fill="#C9A961" />
      </g>
    </svg>
  );
}
