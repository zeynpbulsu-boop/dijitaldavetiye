/**
 * Hidden SVG <defs> block — defines the watercolor / paper /
 * gold-foil filters that other elements reference via
 * `filter: url(#id)` from CSS or `filter="url(#id)"` from SVG.
 *
 * Mount <SvgFilters /> ONCE near the top of the page; references
 * resolve anywhere in the same document.
 *
 * Filter recipes:
 *   #wc-edge      — turbulent edge displacement + gentle bleed
 *                   (corner ornaments wrap with this — petal
 *                   contours stop being vector-perfect, gain a
 *                   hand-painted wobble + soft halo)
 *   #wc-wash      — heavy displacement + heavy blur for a
 *                   pigment-wash backdrop layer
 *   #paper-pigment — pure noise field used as a multiply overlay
 *                    (paper grain pattern as a generated texture)
 *   #wax-foil     — animated gold linear gradient for the seal rim
 *   #wax-inner    — inner highlight ring on the wax seal
 */

export function SvgFilters() {
  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <defs>
        {/* ── Watercolor edge — wobbly painterly contour ──────── */}
        <filter
          id="wc-edge"
          x="-15%"
          y="-15%"
          width="130%"
          height="130%"
          colorInterpolationFilters="sRGB"
        >
          {/* Two-frequency turbulence map (xy split for organic feel) */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.013 0.020"
            numOctaves="3"
            seed="7"
            result="turb"
          />
          {/* Displace source pixels using the noise — wobble edges */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="turb"
            scale="7"
            xChannelSelector="R"
            yChannelSelector="G"
            result="disp"
          />
          {/* Tiny gaussian blur for the "color bleed" off the petal edge */}
          <feGaussianBlur in="disp" stdDeviation="0.7" result="bleed" />
          {/* Slight saturation lift so the pigment doesn't read washed-out */}
          <feColorMatrix
            in="bleed"
            type="matrix"
            values="
              1.05 0    0    0    0
              0    1.04 0    0    0
              0    0    1.03 0    0
              0    0    0    0.96 0
            "
          />
        </filter>

        {/* ── Watercolor wash — softer, more diffuse pigment puddle ── */}
        <filter
          id="wc-wash"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008"
            numOctaves="2"
            seed="3"
            result="turb2"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turb2"
            scale="14"
            xChannelSelector="R"
            yChannelSelector="G"
            result="dispWash"
          />
          <feGaussianBlur in="dispWash" stdDeviation="2.4" />
        </filter>

        {/* ── Paper pigment grain — multiply-blendable noise field ── */}
        <filter id="paper-pigment" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.6"
            numOctaves="2"
            seed="9"
            result="grain"
          />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="
              0 0 0 0 0.55
              0 0 0 0 0.40
              0 0 0 0 0.28
              0 0 0 0.30 0
            "
          />
        </filter>

        {/* ── Wax inner highlight ring — gives a 3D embossed feel ── */}
        <filter id="wax-inner" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.2" />
          <feOffset dy="-1" />
          <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="
              0 0 0 0 1
              0 0 0 0 0.95
              0 0 0 0 0.78
              0 0 0 0.50 0
            "
          />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>

        {/* ── Gold foil linear gradient (for SVG elements / seal rim) ── */}
        <linearGradient id="wax-foil" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A961" />
          <stop offset="22%" stopColor="#F0DBA0" />
          <stop offset="50%" stopColor="#B0894A" />
          <stop offset="78%" stopColor="#F0DBA0" />
          <stop offset="100%" stopColor="#C9A961" />
          <animate
            attributeName="x2"
            values="100%;180%;100%"
            dur="9s"
            repeatCount="indefinite"
          />
        </linearGradient>

        {/* ── Champagne foil — softer for blush palettes ── */}
        <linearGradient id="wax-champagne" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D9B89B" />
          <stop offset="25%" stopColor="#F2DEC6" />
          <stop offset="55%" stopColor="#C09575" />
          <stop offset="80%" stopColor="#F2DEC6" />
          <stop offset="100%" stopColor="#D9B89B" />
          <animate
            attributeName="x2"
            values="100%;180%;100%"
            dur="9s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
    </svg>
  );
}
