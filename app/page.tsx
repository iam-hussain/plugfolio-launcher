"use client";

import { useEffect, useState, type CSSProperties, type FormEvent } from "react";

const LAUNCH_DATE = "2026-10-28T09:00:00";
const CTA_LABEL = "Get early access";

function PlugMark({ body, prong }: { body: string; prong: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block", overflow: "visible" }}
    >
      <g strokeLinejoin="round">
        <polygon
          points="33,53 33,27 39.5,15 46,27 46,53"
          fill={prong}
          stroke={prong}
          strokeWidth="3"
        />
        <polygon
          points="54,53 54,27 60.5,15 67,27 67,53"
          fill={prong}
          stroke={prong}
          strokeWidth="3"
        />
        <rect
          x="18"
          y="43"
          width="64"
          height="44"
          rx="13"
          fill={body}
          stroke={body}
          strokeWidth="3"
        />
      </g>
    </svg>
  );
}

const sparkAnim: CSSProperties = {
  animation: "pf-pulse 2.4s ease-in-out infinite",
  transformOrigin: "center",
};

const cardStyle: CSSProperties = {
  position: "relative",
  background: "linear-gradient(180deg,#1A1630 0%,#141024 100%)",
  border: "1px solid rgba(124,58,237,0.35)",
  borderRadius: "18px",
  padding: "22px 12px 16px",
  overflow: "hidden",
};

const cardTopBar: CSSProperties = {
  position: "absolute",
  top: 0,
  left: "16px",
  right: "16px",
  height: "3px",
  background: "#C6FF3D",
  borderRadius: "0 0 3px 3px",
};

const cardLabel: CSSProperties = {
  fontFamily: "var(--font-space-mono),monospace",
  fontSize: "11px",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "#8C8798",
  marginTop: "6px",
};

const cardNumWrap: CSSProperties = {
  height: "clamp(46px,13vw,64px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

function TickNum({ value }: { value: string }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-sora),sans-serif",
        fontWeight: 800,
        fontSize: "clamp(38px,11vw,56px)",
        lineHeight: 1,
        letterSpacing: "-0.03em",
        color: "#fff",
        fontVariantNumeric: "tabular-nums",
        animation: "pf-tickIn 0.4s cubic-bezier(0.2,0.8,0.2,1)",
      }}
    >
      {value}
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

function countdownParts(now: number) {
  const target = new Date(LAUNCH_DATE).getTime();
  let diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  diff -= d * 86400000;
  const h = Math.floor(diff / 3600000);
  diff -= h * 3600000;
  const m = Math.floor(diff / 60000);
  diff -= m * 60000;
  const s = Math.floor(diff / 1000);
  return { d, h, m, s };
}

type FormState = "default" | "error" | "pending" | "success";

export default function Home() {
  // countdown renders client-side only (after mount) — no hydration mismatch
  const [now, setNow] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("default");
  const [errorMsg, setErrorMsg] = useState(
    "Please enter a valid email address.",
  );

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const parts = now === null ? null : countdownParts(now);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrorMsg("Please enter a valid email address.");
      setFormState("error");
      return;
    }
    setFormState("pending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      if (res.ok) {
        setFormState("success");
      } else {
        const data = await res.json().catch(() => null);
        setErrorMsg(data?.error ?? "Something went wrong. Please try again.");
        setFormState("error");
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setFormState("error");
    }
  }

  const cards: Array<{ label: string; value: number | null }> = [
    { label: "Days", value: parts?.d ?? null },
    { label: "Hours", value: parts?.h ?? null },
    { label: "Minutes", value: parts?.m ?? null },
    { label: "Seconds", value: parts?.s ?? null },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--font-inter),sans-serif",
        background: "#0C0A16",
        color: "#F5F4F8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* ambient background — grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(124,58,237,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.06) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, #000 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, #000 0%, transparent 75%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-18%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(140%,1100px)",
          height: "620px",
          background:
            "radial-gradient(ellipse at center, rgba(124,58,237,0.42) 0%, rgba(124,58,237,0.12) 42%, rgba(12,10,22,0) 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* content column */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "720px",
          padding: "32px 24px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          flex: 1,
        }}
      >
        {/* logo lockup */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "auto",
            paddingTop: "8px",
          }}
        >
          <div style={{ width: "40px", height: "40px", flexShrink: 0 }}>
            <PlugMark body="#FFFFFF" prong="#C6FF3D" />
          </div>
          <div
            style={{
              fontFamily: "var(--font-sora),sans-serif",
              fontSize: "24px",
              fontWeight: 700,
              letterSpacing: "-0.045em",
              color: "#fff",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            plugfolio
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "2px",
                background: "#C6FF3D",
                marginLeft: "4px",
                marginBottom: "5px",
                ...sparkAnim,
              }}
            />
          </div>
        </div>

        {/* hero block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "48px 0",
          }}
        >
          {/* status pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "9px",
              background: "rgba(198,255,61,0.10)",
              border: "1px solid rgba(198,255,61,0.35)",
              color: "#C6FF3D",
              borderRadius: "100px",
              padding: "8px 16px 8px 13px",
              fontFamily: "var(--font-space-mono),monospace",
              fontSize: "11.5px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#C6FF3D",
                ...sparkAnim,
              }}
            />
            Early access
          </div>

          {/* headline */}
          <h1
            style={{
              fontFamily: "var(--font-sora),sans-serif",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
              fontSize: "clamp(34px,8.5vw,62px)",
              margin: "26px 0 0",
              maxWidth: "14ch",
              color: "#fff",
              textWrap: "balance",
            }}
          >
            Your content is about to become{" "}
            <span style={{ color: "#C6FF3D" }}>shoppable.</span>
          </h1>

          {/* subheadline */}
          <p
            style={{
              fontSize: "clamp(15px,4vw,18px)",
              lineHeight: 1.6,
              color: "#B7B2C4",
              margin: "22px 0 0",
              maxWidth: "52ch",
              textWrap: "pretty",
            }}
          >
            Plugfolio turns your reels, videos, and posts into a shoppable
            storefront &mdash; one link in your bio that turns content into
            product clicks, affiliate revenue, and brand deals.
          </p>
        </div>

        {/* countdown */}
        <div style={{ width: "100%", maxWidth: "560px" }}>
          <div
            style={{
              fontFamily: "var(--font-space-mono),monospace",
              fontSize: "11px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#7C6F94",
              marginBottom: "16px",
            }}
          >
            Launching in
          </div>
          <div className="pf-grid">
            {cards.map(({ label, value }) => (
              <div key={label} style={cardStyle}>
                <div style={cardTopBar} />
                <div style={cardNumWrap}>
                  {value !== null && (
                    <TickNum key={pad(value)} value={pad(value)} />
                  )}
                </div>
                <div style={cardLabel}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* email capture */}
        <div
          style={{
            width: "100%",
            maxWidth: "520px",
            marginTop: "38px",
            minHeight: "132px",
          }}
        >
          {formState === "success" ? (
            <div
              style={{
                animation: "pf-rise 0.4s ease both",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                padding: "10px 0",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "rgba(198,255,61,0.12)",
                  border: "1px solid rgba(198,255,61,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {Array.from({ length: 8 }, (_, i) => {
                  const ang = (Math.PI * 2 * i) / 8;
                  return (
                    <span
                      key={i}
                      style={
                        {
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                          width: "7px",
                          height: "7px",
                          borderRadius: "50%",
                          background: "#C6FF3D",
                          "--bx": `${Math.cos(ang) * 46}px`,
                          "--by": `${Math.sin(ang) * 46}px`,
                          animation: "pf-burst 0.7s ease-out forwards",
                        } as CSSProperties
                      }
                    />
                  );
                })}
                <span
                  style={{
                    color: "#C6FF3D",
                    fontSize: "26px",
                    fontWeight: 700,
                    position: "relative",
                  }}
                >
                  {"✦"}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sora),sans-serif",
                  fontWeight: 700,
                  fontSize: "22px",
                  color: "#fff",
                  letterSpacing: "-0.02em",
                }}
              >
                You&rsquo;re on the list {"✦"}
              </div>
              <div
                style={{ fontSize: "14px", color: "#B7B2C4", lineHeight: 1.5 }}
              >
                We&rsquo;ll email you the moment we go live &mdash; and
                you&rsquo;ll get first pick of your handle.
              </div>
            </div>
          ) : (
            <div>
              <form
                onSubmit={submit}
                noValidate
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formState === "error") setFormState("default");
                  }}
                  onFocus={() => {
                    if (formState === "error") setFormState("default");
                  }}
                  placeholder="you@email.com"
                  aria-label="Email address"
                  className="pf-input"
                  data-error={formState === "error"}
                />
                <button
                  type="submit"
                  className="pf-cta"
                  disabled={formState === "pending"}
                >
                  {formState === "pending" ? "Joining…" : CTA_LABEL}
                </button>
              </form>
              {formState === "error" ? (
                <div
                  style={{
                    color: "#FF6B5C",
                    fontSize: "13px",
                    marginTop: "12px",
                    display: "flex",
                    gap: "7px",
                    justifyContent: "center",
                    alignItems: "center",
                    animation: "pf-rise 0.25s ease both",
                  }}
                >
                  <span style={{ fontWeight: 700 }}>!</span>
                  {errorMsg}
                </div>
              ) : (
                <div
                  style={{
                    color: "#7C6F94",
                    fontSize: "13px",
                    marginTop: "14px",
                    lineHeight: 1.5,
                  }}
                >
                  Be first to claim your handle. No spam &mdash; just one email
                  when we go live.
                </div>
              )}
            </div>
          )}
        </div>

        {/* footer */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "56px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <a href="#" aria-label="Instagram" className="pf-social">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1.2"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
            <a href="#" aria-label="TikTok" className="pf-social">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16.5 3c.4 2.6 2 4.2 4.5 4.4v3c-1.6.1-3.1-.4-4.5-1.3v6.2c0 3.6-2.7 6.2-6 6.2-3.1 0-5.5-2.3-5.5-5.4 0-3.2 2.6-5.5 5.9-5.2v3.1c-.5-.1-1-.2-1.4-.1-1.2.2-2.1 1.1-2 2.4.1 1.2 1 2.1 2.3 2.1 1.4 0 2.4-1.1 2.4-2.7V3h4.3z" />
              </svg>
            </a>
            <a href="#" aria-label="X" className="pf-social">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.9 2h3.3l-7.2 8.3L23.5 22h-6.6l-5.2-6.8L5.8 22H2.5l7.7-8.8L1.5 2h6.8l4.7 6.2L18.9 2zm-1.2 18h1.8L7.2 3.9H5.3L17.7 20z" />
              </svg>
            </a>
          </div>
          <div
            style={{
              fontFamily: "var(--font-space-mono),monospace",
              fontSize: "11px",
              letterSpacing: "0.1em",
              color: "#6B6577",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <a href="#" className="pf-footer-link">
              plugfolio.com
            </a>
            <span style={{ opacity: 0.5 }}>&middot;</span>
            <span>&copy; 2026 Plugfolio</span>
          </div>
        </div>
      </div>
    </div>
  );
}
