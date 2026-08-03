import type { ReactNode } from "react"

/**
 * The four product shells of the "see it stitched" preview, drawn in CSS.
 *
 * They exist so a finished pattern can be shown on the things people actually
 * make with it — a hoop, a tote, a tee, a cushion — without shipping four
 * photographs. Real photos will replace them: every mockup is pure chrome and
 * receives the stitched motif as `children`, so swapping a shell for an
 * `<img>` (or dropping the motif on top of one) is a local edit that touches
 * nothing else.
 *
 * The pixel values and colours are the design system's, section
 * "07 PRODUCT PREVIEW", kept verbatim. They are inline styles rather than
 * Tailwind classes on purpose: none of these browns belong to the token
 * palette, and a one-off mockup is clearer read as the drawing it is.
 *
 * The `PRODUCTS` table that pairs these shells with their card colour lives in
 * ./products, not here — fast refresh only keeps working if a component file
 * exports nothing but components.
 */

export type MockProps = { children: ReactNode }

const LIFT = "0 6px 14px rgba(83,63,42,.18)"

export function HoopMock({ children }: MockProps) {
  return (
    <div
      style={{
        position: "relative",
        width: 150,
        height: 150,
        borderRadius: "50%",
        background: "#FBF6EA",
        boxShadow: `inset 0 0 0 7px #B98A5A, inset 0 0 0 9px #A0743F, ${LIFT}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* the tension screw */}
      <div
        style={{
          position: "absolute",
          top: -13,
          left: "50%",
          transform: "translateX(-50%)",
          width: 22,
          height: 14,
          borderRadius: 4,
          background: "#A0743F",
        }}
      />
      {children}
    </div>
  )
}

export function ToteMock({ children }: MockProps) {
  return (
    <div style={{ position: "relative", width: 130, height: 150, marginTop: 18 }}>
      {/* handle: an open-bottomed rounded rectangle */}
      <div
        style={{
          position: "absolute",
          top: -22,
          left: 28,
          width: 74,
          height: 46,
          borderWidth: "7px 7px 0 7px",
          borderStyle: "solid",
          borderColor: "#D9C6A4",
          borderRadius: "30px 30px 0 0",
        }}
      />
      {/* the bag itself */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#EFE2C8",
          borderRadius: "6px 6px 14px 14px",
          boxShadow: "0 6px 14px rgba(83,63,42,.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  )
}

export function ShirtMock({ children }: MockProps) {
  return (
    <div style={{ position: "relative", width: 170, height: 160 }}>
      {/* sleeves, tilted away from the body */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: -2,
          width: 52,
          height: 44,
          background: "#F7F2E7",
          borderRadius: "10px 4px 10px 18px",
          transform: "rotate(-18deg)",
          boxShadow: "0 3px 8px rgba(83,63,42,.10)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 8,
          right: -2,
          width: 52,
          height: 44,
          background: "#F7F2E7",
          borderRadius: "4px 10px 18px 10px",
          transform: "rotate(18deg)",
          boxShadow: "0 3px 8px rgba(83,63,42,.10)",
        }}
      />
      {/* body — drawn last so it sits over the sleeve seams */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 32,
          width: 106,
          height: 158,
          background: "#FBF6EA",
          borderRadius: "10px 10px 12px 12px",
          boxShadow: "0 6px 14px rgba(83,63,42,.14)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* collar */}
        <div
          style={{
            width: 48,
            height: 16,
            borderRadius: "0 0 24px 24px",
            background: "#EDE3CE",
            marginBottom: 18,
          }}
        />
        {children}
      </div>
    </div>
  )
}

export function CushionMock({ children }: MockProps) {
  return (
    <div
      style={{
        width: 150,
        height: 150,
        borderRadius: 22,
        background: "#F5EDDD",
        boxShadow: "inset 0 0 0 6px #E4D5B8, 0 8px 16px rgba(83,63,42,.16)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  )
}
