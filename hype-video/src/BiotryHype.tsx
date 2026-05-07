import React from "react";
import {
    AbsoluteFill,
    interpolate,
    useCurrentFrame,
    useVideoConfig,
    spring,
    Sequence,
} from "remotion";
import {
    ShieldCheck,
    FlaskConical,
    Network,
    Lock,
    BrainCircuit,
    Zap,
    TrendingUp,
    Database,
    Binary,
    Activity,
    Users,
} from "lucide-react";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

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

// ─── Scene 1: THE CATALYST (0–150) ──────────────────────
const SceneCatalyst: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
    const textOpacity = lerp(frame, 0, 1, 20, 50);
    const textScale = lerp(frame, 0.95, 1.05, 0, 150);
    const exitOpacity = lerp(frame, 1, 0, 130, 150);

    return (
        <AbsoluteFill style={{ background: BG, opacity: exitOpacity, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ opacity: textOpacity, transform: `scale(${textScale})`, textAlign: "center" }}>
                <div style={{ fontFamily: "monospace", color: `${WHITE}40`, fontSize: 18, letterSpacing: "1em", marginBottom: 32 }}>CORE_AXIOM</div>
                <div style={{ color: WHITE, fontSize: 80, fontWeight: 900, fontFamily: '"Arial Black", sans-serif', letterSpacing: "-2px", lineHeight: 1.1 }}>
                    PRIVACY IS THE <br />
                    <span style={{ color: ORANGE }}>CATALYST</span> FOR TRUTH.
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── Scene 2: THE NETWORK IDENTITY (150–300) ──────────────────────
const SceneIdentity: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
    const localFrame = frame - 150;
    const entryOp = lerp(localFrame, 0, 1, 0, 20);
    const logoScale = spring({ frame: localFrame, fps, config: { damping: 10, stiffness: 80 } });
    const exitOpacity = lerp(localFrame, 1, 0, 130, 150);

    return (
        <AbsoluteFill style={{ background: BG, opacity: exitOpacity, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
            <div style={{ transform: `scale(${logoScale})`, opacity: entryOp, position: "relative" }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 240, height: 240, background: `${ORANGE}20`, borderRadius: "50%", filter: "blur(40px)" }} />
                <FlaskConical size={160} color={ORANGE} strokeWidth={1.5} />
            </div>
            <div style={{ textAlign: "center", opacity: entryOp }}>
                <div style={{ color: WHITE, fontSize: 90, fontWeight: 900, fontFamily: '"Arial Black", sans-serif', letterSpacing: "-4px" }}>BIOTRY<span style={{ color: ORANGE }}>.</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginTop: 12 }}>
                    <div style={{ width: 40, height: 1, background: `${WHITE}20` }} />
                    <div style={{ color: `${WHITE}40`, fontSize: 12, fontFamily: "monospace", letterSpacing: "0.4em" }}>SCIENTIFIC DISCOVERY NETWORK</div>
                    <div style={{ width: 40, height: 1, background: `${WHITE}20` }} />
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── Scene 3: THE SYNERGY BRIDGE (300–550) ─────────────────────────────
const SceneSynergyBridge: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
    const localFrame = frame - 300;
    const uiOp = lerp(localFrame, 0, 1, 10, 40);
    const bridgeProgress = lerp(localFrame, 0, 1, 50, 100);
    const exitOpacity = lerp(localFrame, 1, 0, 230, 250);

    return (
        <AbsoluteFill style={{ background: BG, opacity: exitOpacity, padding: 80 }}>
            <div style={{ marginBottom: 80, opacity: uiOp }}>
                <div style={{ color: ORANGE, fontFamily: "monospace", letterSpacing: "0.2em", fontSize: 14 }}>PROTOCOL_INTEGRATION</div>
                <div style={{ color: WHITE, fontSize: 64, fontWeight: 900, fontFamily: 'sans-serif', marginTop: 10 }}>BRIDGING REPUTATION & PRIVACY.</div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 400, position: "relative" }}>
                {/* Tapestry */}
                <div style={{ flex: 1, background: "#080808", border: "1px solid #E2F06320", borderRadius: 32, padding: 40, opacity: uiOp, height: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <Network color="#E2F063" size={32} />
                        <div style={{ fontSize: 24, fontWeight: 700, color: "#E2F063", letterSpacing: "-1px" }}>TAPESTRY</div>
                    </div>
                    <div style={{ color: `${WHITE}40`, fontSize: 13, fontFamily: "monospace" }}>Decentralized Social Graph for Verified Expertise.</div>
                    <div style={{ marginTop: "auto", display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {["RP_WEIGHT", "SOCIAL_MESH", "VERIFIED"].map(t => <span key={t} style={{ fontSize: 9, border: "1px solid #E2F06330", color: "#E2F06360", padding: "4px 8px", borderRadius: 4 }}>{t}</span>)}
                    </div>
                </div>

                <div style={{ width: 100, height: 2, background: `linear-gradient(90deg, #E2F06320, #3ABFFD20)`, opacity: bridgeProgress / 100 }} />

                {/* Umbra */}
                <div style={{ flex: 1, background: "#080808", border: "1px solid #3ABFFD20", borderRadius: 32, padding: 40, opacity: uiOp, height: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <ShieldCheck color="#3ABFFD" size={32} />
                        <div style={{ fontSize: 24, fontWeight: 700, color: "#3ABFFD", letterSpacing: "-1px" }}>UMBRA</div>
                    </div>
                    <div style={{ color: `${WHITE}40`, fontSize: 13, fontFamily: "monospace" }}>Privacy Protocol for Shielded Research Funding.</div>
                    <div style={{ marginTop: "auto", display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {"STEALTH_GRANT PHANTOM_TX_0x".split(" ").map(t => <span key={t} style={{ fontSize: 9, border: "1px solid #3ABFFD30", color: "#3ABFFD60", padding: "4px 8px", borderRadius: 4 }}>{t}</span>)}
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── Scene 4: THE DISCOVERY CYCLE (550–950) ──────────────────────────────
const SceneCycle: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
    const localFrame = frame - 550;
    const stage = Math.floor(localFrame / 130);
    const exitOpacity = lerp(localFrame, 1, 0, 380, 400);

    return (
        <AbsoluteFill style={{ background: BG, opacity: exitOpacity }}>
            <div style={{ position: "absolute", top: 80, left: 80, opacity: 0.8 }}>
                <div style={{ color: ORANGE, fontFamily: "monospace", letterSpacing: "0.2em", fontSize: 14 }}>EXECUTION_CYCLE v2.0</div>
            </div>

            {stage === 0 && (
                <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
                    <div style={{ fontSize: 120, fontWeight: 900, color: WHITE, letterSpacing: "-8px" }}>1. FUND</div>
                    <div style={{ width: 800, padding: 40, background: "#0a0a09", border: `2px solid #3ABFFD30`, borderRadius: 32 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                            <div style={{ color: "#3ABFFD", fontFamily: "monospace" }}>UMBRA_SHIELDED_FUNDING</div>
                            <div style={{ color: "#3ABFFD" }}>[ACTIVE]</div>
                        </div>
                        <div style={{ fontSize: 40, color: WHITE, fontWeight: 700 }}>+ 50.00 SOL</div>
                        <div style={{ color: `${WHITE}20`, fontSize: 12, marginTop: 12, fontFamily: "monospace" }}>TX: PHANTOM_ENCRYPTED_SIGNATURE_VERIFIED</div>
                    </div>
                    <div style={{ color: `${WHITE}40`, fontSize: 18, fontFamily: "monospace" }}>BIAS-FREE CAPITAL FOR DISCOVERY.</div>
                </AbsoluteFill>
            )}

            {stage === 1 && (
                <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
                    <div style={{ fontSize: 120, fontWeight: 900, color: WHITE, letterSpacing: "-8px" }}>2. VERIFY</div>
                    <div style={{ width: 800, padding: 40, background: "#0a0a09", border: `2px solid #E2F06330`, borderRadius: 32 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                            <div style={{ color: "#E2F063", fontFamily: "monospace" }}>TAPESTRY_REPUTATION_MESH</div>
                            <div style={{ color: "#E2F063" }}>94% WEIGHT</div>
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                            {[1, 2, 3, 4, 5].map(i => <div key={i} style={{ width: 40, height: 40, borderRadius: "50%", background: "#E2F06320", border: "1px solid #E2F06340" }} />)}
                        </div>
                        <div style={{ color: `${WHITE}20`, fontSize: 12, marginTop: 12, fontFamily: "monospace" }}>EXPERTISE-WEIGHTED COLLECTIVE TRUTH.</div>
                    </div>
                    <div style={{ color: `${WHITE}40`, fontSize: 18, fontFamily: "monospace" }}>WISDOM OVER IDENTITY.</div>
                </AbsoluteFill>
            )}

            {stage >= 2 && (
                <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
                    <div style={{ fontSize: 120, fontWeight: 900, color: WHITE, letterSpacing: "-8px" }}>3. ASSETIZE</div>
                    <div style={{ width: 800, padding: 40, background: "linear-gradient(135deg, #0a0a0a, #111)", border: `2px solid ${ORANGE}40`, borderRadius: 32, boxShadow: `0 0 60px ${ORANGE}10` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                            <Lock color={ORANGE} size={32} />
                            <div style={{ color: ORANGE, fontFamily: "monospace" }}>ZK_SOVEREIGN_VAULT</div>
                        </div>
                        <div style={{ fontSize: 24, color: WHITE, fontWeight: 700 }}>LOGIC_ASSET_SHA256:8fd1...</div>
                        <div style={{ color: `${WHITE}20`, fontSize: 12, marginTop: 12, fontFamily: "monospace" }}>CONVERTING HUMAN KNOWLEDGE INTO LIQUID VALUE.</div>
                    </div>
                </AbsoluteFill>
            )}
        </AbsoluteFill>
    );
};

// ─── Scene 5: THE SOVEREIGN ECOSYSTEM (950–1150) ───────────────────────
const SceneEcosystem: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
    const localFrame = frame - 950;
    const uiOp = lerp(localFrame, 0, 1, 0, 30);
    const textScale = lerp(localFrame, 0.9, 1, 0, 50);
    const exitOpacity = lerp(localFrame, 1, 0, 180, 200);

    return (
        <AbsoluteFill style={{ background: BG, opacity: exitOpacity, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 60 }}>
            <div style={{ opacity: uiOp, transform: `scale(${textScale})`, textAlign: "center" }}>
                <div style={{ fontFamily: "monospace", color: ORANGE, fontSize: 14, letterSpacing: "0.5em", marginBottom: 24 }}>BIAS_FREE_FUTURE</div>
                <div style={{ color: WHITE, fontSize: 72, fontWeight: 900, fontFamily: 'sans-serif', letterSpacing: "-3px", lineHeight: 1.1 }}>
                    A SOVEREIGN ECOSYSTEM FOR THE <br />
                    <span style={{ color: ORANGE }}>ASSETIZATION</span> OF LOGIC.
                </div>
            </div>

            <div style={{ display: "flex", gap: 40, opacity: uiOp }}>
                 {[
                     { label: "Verifiable", icon: Activity },
                     { label: "Sovereign", icon: Zap },
                     { label: "High-Performance", icon: TrendingUp }
                 ].map(item => (
                     <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 16, background: "white/5", padding: "12px 24px", borderRadius: 16, border: "1px solid white/10" }}>
                         <item.icon size={20} color={ORANGE} />
                         <span style={{ color: WHITE, fontSize: 14, fontWeight: 700, fontFamily: "monospace" }}>{item.label.toUpperCase()}</span>
                     </div>
                 ))}
            </div>
        </AbsoluteFill>
    );
};

// ─── Scene 6: OUTRO - CTA (1150–1400) ────────────────────────────────
const SceneOutro: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
    const localFrame = frame - 1150;
    const entryOp = lerp(localFrame, 0, 1, 0, 25);
    const logoScale = spring({ frame: localFrame, fps, config: { damping: 10, stiffness: 60 } });

    return (
        <AbsoluteFill style={{ background: BG, opacity: entryOp, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 48 }}>
            <div style={{ transform: `scale(${logoScale})`, opacity: 0.9 }}>
                <FlaskConical size={120} color={ORANGE} />
            </div>

            <div style={{ textAlign: "center" }}>
                <div style={{ color: WHITE, fontSize: 100, fontWeight: 900, fontFamily: '"Arial Black", sans-serif', letterSpacing: "-4px" }}>BIOTRY<span style={{ color: ORANGE }}>.</span></div>
                <div style={{ color: `${WHITE}40`, fontSize: 18, fontFamily: "monospace", letterSpacing: "0.5em", marginTop: 10 }}>JOIN THE DISCOVERY REVOLUTION.</div>
            </div>

            <div style={{ marginTop: 40, background: `linear-gradient(90deg, ${ORANGE}, ${PURPLE})`, padding: "24px 64px", borderRadius: 24, boxShadow: `0 0 80px ${ORANGE}40` }}>
                <div style={{ color: WHITE, fontSize: 32, fontWeight: 900, fontFamily: "monospace" }}>biotry.vercel.app</div>
            </div>

            <div style={{ position: "absolute", bottom: 60, fontFamily: "monospace", color: `${WHITE}10`, fontSize: 12, letterSpacing: "0.2em" }}>
                FUND • VERIFY • ASSETIZE
            </div>
        </AbsoluteFill>
    );
};

// ─── MAIN COMPOSITION ────────────────────────────────────────────────────────
export const BiotryHype: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    return (
        <AbsoluteFill style={{ background: BG, color: WHITE }}>
            <Sequence from={0} durationInFrames={150}>
                <SceneCatalyst frame={frame} fps={fps} />
            </Sequence>
            <Sequence from={150} durationInFrames={150}>
                <SceneIdentity frame={frame} fps={fps} />
            </Sequence>
            <Sequence from={300} durationInFrames={250}>
                <SceneSynergyBridge frame={frame} fps={fps} />
            </Sequence>
            <Sequence from={550} durationInFrames={400}>
                <SceneCycle frame={frame} fps={fps} />
            </Sequence>
            <Sequence from={950} durationInFrames={200}>
                <SceneEcosystem frame={frame} fps={fps} />
            </Sequence>
            <Sequence from={1150} durationInFrames={250}>
                <SceneOutro frame={frame} fps={fps} />
            </Sequence>
        </AbsoluteFill>
    );
};
