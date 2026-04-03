import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from "remotion";

// ─── Utility: interpolate with clamp ────────────────────────────────────────
const lerp = (frame: number, from: number, to: number, start: number, end: number) =>
  interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// ─── COLORS ──────────────────────────────────────────────────────────────────
const ORANGE = "#F6851B";
const PURPLE = "#7C3AED";
const BG = "#030303";
const WHITE = "#FFFFFF";

// ─── Scene 1: THE HOOK (frames 0–180) ────────────────────────────────────────
const SceneHook: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const titleOpacity = lerp(frame, 0, 1, 0, 20);
  const titleY = lerp(frame, 60, 0, 0, 25);
  const line2Opacity = lerp(frame, 0, 1, 30, 55);
  const line2Y = lerp(frame, 40, 0, 30, 55);
  const pulseScale = 1 + 0.015 * Math.sin((frame / fps) * Math.PI * 2);
  const exitOpacity = lerp(frame, 1, 0, 150, 180);

  return (
    <AbsoluteFill
      style={{
        background: BG,
        opacity: exitOpacity,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${ORANGE}18 0%, transparent 70%)`,
          scale: String(pulseScale),
          filter: "blur(60px)",
        }}
      />

      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: '"Arial Black", Impact, sans-serif',
            fontSize: 120,
            fontWeight: 900,
            color: WHITE,
            letterSpacing: "-4px",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          SCIENCE
        </div>
        <div
          style={{
            fontFamily: '"Arial Black", Impact, sans-serif',
            fontSize: 120,
            fontWeight: 900,
            color: WHITE,
            letterSpacing: "-4px",
            textTransform: "uppercase",
            lineHeight: 1,
            opacity: 0.15,
            textDecoration: "line-through",
          }}
        >
          IS BROKEN.
        </div>
      </div>

      <div
        style={{
          opacity: line2Opacity,
          transform: `translateY(${line2Y}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontFamily: "monospace",
            color: `${WHITE}60`,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
          }}
        >
          $35 PER PAPER. YEARS OF PEER REVIEW.
        </div>
        <div
          style={{
            fontSize: 28,
            fontFamily: "monospace",
            color: `${ORANGE}90`,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            marginTop: 8,
          }}
        >
          REPRODUCIBILITY CRISIS. GATEKEEPERS.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: BIOTRY REVEAL (frames 180–360) ─────────────────────────────────
const SceneBiotry: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const localFrame = frame - 180;
  const logoScale = spring({ frame: localFrame, fps, config: { damping: 12, stiffness: 80 } });
  const logoOpacity = lerp(localFrame, 0, 1, 0, 15);
  const titleOpacity = lerp(localFrame, 0, 1, 20, 40);
  const subtitleOpacity = lerp(localFrame, 0, 1, 50, 75);
  const node1Opacity = lerp(localFrame, 0, 1, 70, 90);
  const node2Opacity = lerp(localFrame, 0, 1, 85, 105);
  const node3Opacity = lerp(localFrame, 0, 1, 100, 120);
  const exitOpacity = lerp(localFrame, 1, 0, 150, 180);

  const rotateGlob = (localFrame / fps) * 30;

  return (
    <AbsoluteFill
      style={{ background: BG, opacity: exitOpacity }}
    >
      {/* Left: Logo + Brand */}
      <div
        style={{
          position: "absolute",
          left: 160,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        {/* Logo Circle */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 32,
            background: `linear-gradient(135deg, ${ORANGE}, #FFAB5E)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            boxShadow: `0 0 60px ${ORANGE}60`,
          }}
        >
          <svg viewBox="0 0 40 40" width={60} height={60}>
            <circle cx="20" cy="20" r="8" fill="white" />
            <circle cx="8" cy="12" r="4" fill="white" opacity="0.7" />
            <circle cx="32" cy="12" r="4" fill="white" opacity="0.7" />
            <circle cx="8" cy="28" r="4" fill="white" opacity="0.5" />
            <circle cx="32" cy="28" r="4" fill="white" opacity="0.5" />
            <line x1="20" y1="20" x2="8" y2="12" stroke="white" strokeWidth="1.5" opacity="0.4" />
            <line x1="20" y1="20" x2="32" y2="12" stroke="white" strokeWidth="1.5" opacity="0.4" />
            <line x1="20" y1="20" x2="8" y2="28" stroke="white" strokeWidth="1.5" opacity="0.3" />
            <line x1="20" y1="20" x2="32" y2="28" stroke="white" strokeWidth="1.5" opacity="0.3" />
          </svg>
        </div>

        <div style={{ opacity: titleOpacity }}>
          <div
            style={{
              fontFamily: '"Arial Black", Impact, sans-serif',
              fontSize: 96,
              fontWeight: 900,
              color: WHITE,
              letterSpacing: "-3px",
              textTransform: "uppercase",
              lineHeight: 0.9,
            }}
          >
            BIOTRY
            <span style={{ color: ORANGE }}>.</span>
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 16,
              color: `${WHITE}40`,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              marginTop: 12,
            }}
          >
            THE UNIVERSAL PROTOCOL FOR OPEN SCIENCE
          </div>
        </div>

        {/* Feature bullets */}
        <div style={{ opacity: subtitleOpacity, display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "ON-CHAIN RESEARCH JOURNAL", delay: 0, op: node1Opacity },
            { label: "AI MULTI-AGENT SIMULATOR", delay: 15, op: node2Opacity },
            { label: "x402 MICROPAYMENT ENGINE", delay: 30, op: node3Opacity },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                opacity: item.op,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: ORANGE,
                  boxShadow: `0 0 12px ${ORANGE}`,
                }}
              />
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 18,
                  color: `${WHITE}70`,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Animated Globe */}
      <div
        style={{
          position: "absolute",
          right: 160,
          top: "50%",
          transform: "translateY(-50%)",
          width: 500,
          height: 500,
          opacity: logoOpacity,
        }}
      >
        <svg viewBox="0 0 500 500" width={500} height={500} style={{ overflow: "visible" }}>
          <defs>
            <radialGradient id="globeGrad" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor={ORANGE} stopOpacity="0.15" />
              <stop offset="100%" stopColor={PURPLE} stopOpacity="0.05" />
            </radialGradient>
          </defs>
          <circle cx="250" cy="250" r="200" fill="url(#globeGrad)" stroke={`${WHITE}10`} strokeWidth="1" />
          <circle cx="250" cy="250" r="200" fill="none" stroke={`${ORANGE}30`} strokeWidth="1" strokeDasharray="6 6" />
          <circle cx="250" cy="250" r="140" fill="none" stroke={`${PURPLE}20`} strokeWidth="1" />
          
          {/* Orbiting nodes */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = ((angle + rotateGlob) * Math.PI) / 180;
            const x = 250 + 200 * Math.cos(rad);
            const y = 250 + 200 * Math.sin(rad);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={i % 2 === 0 ? 8 : 5} fill={i % 2 === 0 ? ORANGE : PURPLE} opacity={0.8} />
                <circle cx={x} cy={y} r={i % 2 === 0 ? 16 : 10} fill="none" stroke={i % 2 === 0 ? ORANGE : PURPLE} strokeWidth="1" opacity={0.3} />
                <line x1="250" y1="250" x2={x} y2={y} stroke={`${WHITE}10`} strokeWidth="1" />
              </g>
            );
          })}
          
          {/* Center */}
          <circle cx="250" cy="250" r="20" fill={`${ORANGE}80`} />
          <circle cx="250" cy="250" r="30" fill="none" stroke={ORANGE} strokeWidth="2" opacity={0.4} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: AI SIMULATOR (frames 360–540) ──────────────────────────────────
const SceneAI: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const localFrame = frame - 360;
  const headerOp = lerp(localFrame, 0, 1, 0, 20);
  const terminalOp = lerp(localFrame, 0, 1, 15, 40);
  const agent1Op = lerp(localFrame, 0, 1, 30, 50);
  const agent2Op = lerp(localFrame, 0, 1, 50, 70);
  const agent3Op = lerp(localFrame, 0, 1, 70, 90);
  const scorePulse = 1 + 0.02 * Math.sin((localFrame / fps) * Math.PI * 4);
  const exitOpacity = lerp(localFrame, 1, 0, 150, 180);

  const progressWidth = lerp(localFrame, 0, 94, 40, 120);
  const typeIdx = Math.min(Math.floor(localFrame / 2.5), 36);
  const typeText = "[AI] EXTRACTING METHODOLOGY... READY.".slice(0, typeIdx);

  return (
    <AbsoluteFill
      style={{
        background: BG,
        opacity: exitOpacity,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 80,
      }}
    >
      {/* Left: Terminal */}
      <div
        style={{
          width: 700,
          opacity: terminalOp,
          background: "#0a0a0a",
          borderRadius: 24,
          border: `1px solid ${WHITE}10`,
          overflow: "hidden",
          boxShadow: `0 0 60px ${PURPLE}20`,
        }}
      >
        {/* Terminal header */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: `1px solid ${WHITE}10`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
          <span
            style={{
              marginLeft: 8,
              fontFamily: "monospace",
              fontSize: 12,
              color: `${WHITE}40`,
              letterSpacing: "0.3em",
            }}
          >
            SIM_NODE_EXECUTOR // ACTIVE
          </span>
        </div>

        {/* Viability scan */}
        <div style={{ padding: "24px 32px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "monospace",
              fontSize: 13,
              color: `${WHITE}40`,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              marginBottom: 12,
            }}
          >
            <span>VIABILITY_SCAN</span>
            <span style={{ color: "#28C840" }}>94% SUCCESS</span>
          </div>
          <div
            style={{
              height: 8,
              background: `${WHITE}10`,
              borderRadius: 4,
              overflow: "hidden",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progressWidth}%`,
                background: `linear-gradient(90deg, ${ORANGE}, ${PURPLE})`,
                borderRadius: 4,
                transition: "width 0.1s",
              }}
            />
          </div>

          <div
            style={{
              background: "#000",
              borderRadius: 12,
              padding: 20,
              fontFamily: "monospace",
              fontSize: 13,
              color: `${PURPLE}CC`,
              lineHeight: 1.8,
              letterSpacing: "0.1em",
              minHeight: 120,
            }}
          >
            {`[SYSTEM] INGESTING DATASET_REF_882\n[AI] AGENT_1 DR.BIO ANALYZING...\n${typeText}`}
            <span style={{ animation: "blink 1s infinite" }}>_</span>
          </div>
        </div>
      </div>

      {/* Right: Agents */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ opacity: headerOp }}>
          <div
            style={{
              fontFamily: '"Arial Black", Impact, sans-serif',
              fontSize: 56,
              fontWeight: 900,
              color: WHITE,
              letterSpacing: "-2px",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            AI WAR
          </div>
          <div
            style={{
              fontFamily: '"Arial Black", Impact, sans-serif',
              fontSize: 56,
              fontWeight: 900,
              color: PURPLE,
              letterSpacing: "-2px",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            ROOM.
          </div>
        </div>

        {[
          { name: "DR. BIO", role: "DESCI AUDITOR", score: "94%", color: ORANGE, op: agent1Op },
          { name: "SOL ARCHITECT", role: "CHAIN ANALYST", score: "87%", color: PURPLE, op: agent2Op },
          { name: "ZK SHADOW", role: "RISK GUARDIAN", score: "91%", color: "#3B82F6", op: agent3Op },
        ].map((agent) => (
          <div
            key={agent.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "16px 24px",
              background: `${WHITE}05`,
              border: `1px solid ${agent.color}30`,
              borderRadius: 16,
              opacity: agent.op,
              width: 380,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `${agent.color}20`,
                border: `1px solid ${agent.color}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "monospace",
                fontSize: 18,
                color: agent.color,
                fontWeight: 700,
              }}
            >
              {agent.name.slice(0, 2)}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 14,
                  fontWeight: 700,
                  color: WHITE,
                  letterSpacing: "0.1em",
                }}
              >
                {agent.name}
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  color: `${WHITE}40`,
                  letterSpacing: "0.2em",
                }}
              >
                {agent.role}
              </div>
            </div>
            <div
              style={{
                fontFamily: '"Arial Black", sans-serif',
                fontSize: 24,
                fontWeight: 900,
                color: agent.color,
                transform: `scale(${scorePulse})`,
              }}
            >
              {agent.score}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: x402 MICROPAYMENT (frames 540–720) ─────────────────────────────
const SceneFunding: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const localFrame = frame - 540;
  const titleOp = lerp(localFrame, 0, 1, 0, 20);
  const cardOp = lerp(localFrame, 0, 1, 25, 50);
  const txOp = lerp(localFrame, 0, 1, 60, 80);
  const confirmedOp = lerp(localFrame, 0, 1, 100, 120);
  const gaugeWidth = lerp(localFrame, 0, 68, 55, 130);
  const exitOpacity = lerp(localFrame, 1, 0, 150, 180);

  const txScale = spring({ frame: Math.max(0, localFrame - 80), fps, config: { damping: 14, stiffness: 100 } });

  return (
    <AbsoluteFill
      style={{
        background: BG,
        opacity: exitOpacity,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 80,
      }}
    >
      {/* Left: Title + Context */}
      <div style={{ opacity: titleOp }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 13,
            color: ORANGE,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          ⚡ NATIVE MICROPAYMENT ENGINE
        </div>
        <div
          style={{
            fontFamily: '"Arial Black", Impact, sans-serif',
            fontSize: 80,
            fontWeight: 900,
            color: WHITE,
            letterSpacing: "-3px",
            textTransform: "uppercase",
            lineHeight: 0.95,
          }}
        >
          1-CLICK
          <br />
          <span style={{ color: ORANGE }}>SCIENCE.</span>
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 16,
            color: `${WHITE}40`,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginTop: 24,
            maxWidth: 400,
            lineHeight: 1.8,
          }}
        >
          No API keys. No subscriptions.
          <br />
          Just a wallet and an HTTP request.
        </div>
      </div>

      {/* Right: Research Card + tx */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 560 }}>
        {/* Research Card */}
        <div
          style={{
            opacity: cardOp,
            background: "#0f0f0f",
            border: `1px solid ${WHITE}10`,
            borderRadius: 24,
            padding: 32,
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              color: `${WHITE}30`,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            SCIENTIFIC FUNDING PROGRAM
          </div>
          <div
            style={{
              fontFamily: '"Arial Black", sans-serif',
              fontSize: 32,
              fontWeight: 900,
              color: WHITE,
              marginBottom: 8,
            }}
          >
            $10.00{" "}
            <span style={{ fontSize: 18, color: `${WHITE}40`, fontWeight: 400 }}>/ $100 GOAL</span>
          </div>

          <div style={{ height: 6, background: `${WHITE}10`, borderRadius: 3, marginBottom: 16, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${gaugeWidth}%`,
                background: `linear-gradient(90deg, ${ORANGE}, ${PURPLE})`,
                borderRadius: 3,
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "monospace",
              fontSize: 11,
              color: `${WHITE}30`,
              letterSpacing: "0.2em",
            }}
          >
            <span>{Math.round(gaugeWidth)}% FUNDED</span>
            <span>8 CONTRIBUTORS</span>
          </div>
        </div>

        {/* Transaction Confirmation */}
        <div
          style={{
            opacity: txOp,
            transform: `scale(${txScale})`,
            background: `${ORANGE}10`,
            border: `2px solid ${ORANGE}40`,
            borderRadius: 20,
            padding: "20px 28px",
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: `${ORANGE}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            ⚡
          </div>
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: ORANGE, letterSpacing: "0.1em" }}>
              FUNDING PROVEN ON-CHAIN
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: `${WHITE}40`, letterSpacing: "0.2em", marginTop: 4 }}>
              TX: 5Hs8...k2mP • SOLANA DEVNET
            </div>
          </div>
          <div
            style={{
              marginLeft: "auto",
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#28C840",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: confirmedOp,
            }}
          >
            ✓
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 5: CTA (frames 720–900) ──────────────────────────────────────────
const SceneCTA: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const localFrame = frame - 720;
  const entryOp = lerp(localFrame, 0, 1, 0, 25);
  const logoScale = spring({ frame: localFrame, fps, config: { damping: 10, stiffness: 60 } });
  const taglineOp = lerp(localFrame, 0, 1, 30, 60);
  const ctaOp = lerp(localFrame, 0, 1, 70, 100);
  const pulseScale = 1 + 0.03 * Math.sin((localFrame / fps) * Math.PI * 2);

  return (
    <AbsoluteFill
      style={{
        background: BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 40,
        opacity: entryOp,
      }}
    >
      {/* Big ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 1000,
          height: 1000,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${ORANGE}18 0%, ${PURPLE}08 40%, transparent 70%)`,
          scale: String(pulseScale),
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          background: `linear-gradient(135deg, ${ORANGE}, #FFAB5E)`,
          width: 140,
          height: 140,
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 80px ${ORANGE}60, 0 0 200px ${ORANGE}20`,
        }}
      >
        <svg viewBox="0 0 40 40" width={80} height={80}>
          <circle cx="20" cy="20" r="8" fill="white" />
          <circle cx="8" cy="12" r="4" fill="white" opacity="0.8" />
          <circle cx="32" cy="12" r="4" fill="white" opacity="0.8" />
          <circle cx="8" cy="28" r="4" fill="white" opacity="0.6" />
          <circle cx="32" cy="28" r="4" fill="white" opacity="0.6" />
          <line x1="20" y1="20" x2="8" y2="12" stroke="white" strokeWidth="2" opacity="0.5" />
          <line x1="20" y1="20" x2="32" y2="12" stroke="white" strokeWidth="2" opacity="0.5" />
          <line x1="20" y1="20" x2="8" y2="28" stroke="white" strokeWidth="2" opacity="0.4" />
          <line x1="20" y1="20" x2="32" y2="28" stroke="white" strokeWidth="2" opacity="0.4" />
        </svg>
      </div>

      {/* Title */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: '"Arial Black", Impact, sans-serif',
            fontSize: 120,
            fontWeight: 900,
            color: WHITE,
            letterSpacing: "-4px",
            textTransform: "uppercase",
            lineHeight: 0.9,
          }}
        >
          BIOTRY
          <span style={{ color: ORANGE }}>.</span>
        </div>
      </div>

      {/* Tagline */}
      <div style={{ opacity: taglineOp, textAlign: "center" }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 22,
            color: `${WHITE}50`,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
          }}
        >
          RECODE SCIENCE. FUND DISCOVERY.
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 16,
            color: `${ORANGE}80`,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            marginTop: 8,
          }}
        >
          PROVEN ON-CHAIN.
        </div>
      </div>

      {/* CTA Pill */}
      <div
        style={{
          opacity: ctaOp,
          display: "flex",
          gap: 24,
          marginTop: 20,
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${ORANGE}, #FFAB5E)`,
            borderRadius: 100,
            padding: "16px 48px",
            fontFamily: '"Arial Black", sans-serif',
            fontSize: 18,
            fontWeight: 900,
            color: WHITE,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            boxShadow: `0 0 40px ${ORANGE}40`,
          }}
        >
          biotry.vercel.app
        </div>
        <div
          style={{
            background: `${WHITE}08`,
            border: `1px solid ${WHITE}20`,
            borderRadius: 100,
            padding: "16px 48px",
            fontFamily: '"Arial Black", sans-serif',
            fontSize: 18,
            fontWeight: 900,
            color: `${WHITE}60`,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          @Joseph-hackathon
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── MAIN COMPOSITION ────────────────────────────────────────────────────────
export const BiotryHype: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: "system-ui, sans-serif" }}>
      {/* Scene 1: Hook (0–180) */}
      <Sequence from={0} durationInFrames={180}>
        <SceneHook frame={frame} fps={fps} />
      </Sequence>

      {/* Scene 2: Biotry Reveal (180–360) */}
      <Sequence from={180} durationInFrames={180}>
        <SceneBiotry frame={frame} fps={fps} />
      </Sequence>

      {/* Scene 3: AI Simulator (360–540) */}
      <Sequence from={360} durationInFrames={180}>
        <SceneAI frame={frame} fps={fps} />
      </Sequence>

      {/* Scene 4: x402 Funding (540–720) */}
      <Sequence from={540} durationInFrames={180}>
        <SceneFunding frame={frame} fps={fps} />
      </Sequence>

      {/* Scene 5: CTA (720–900) */}
      <Sequence from={720} durationInFrames={180}>
        <SceneCTA frame={frame} fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};
