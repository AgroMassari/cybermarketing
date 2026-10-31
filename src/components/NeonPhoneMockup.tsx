import React from "react";
import { Heart, Users, Eye, Send, Repeat, Bookmark, MessageCircle, Music2, Youtube, Flame, Sparkles } from "lucide-react";

export type MockupIconType =
  | "followers"
  | "likes"
  | "views"
  | "stories"
  | "shares"
  | "repost"
  | "comments"
  | "music"
  | "stream";

interface NeonPhoneMockupProps {
  type: MockupIconType;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function NeonPhoneMockup({ type, label, size = "md" }: NeonPhoneMockupProps) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  const width = isSm ? 130 : isLg ? 230 : 170;
  const height = isSm ? 180 : isLg ? 330 : 250;
  const iconSize = isSm ? 32 : isLg ? 56 : 42;

  const renderIcon = () => {
    switch (type) {
      case "followers":
        return <Users size={iconSize} color="#d946ef" strokeWidth={2.2} />;
      case "likes":
        return <Heart size={iconSize} color="#f43f5e" fill="#f43f5e" fillOpacity={0.7} strokeWidth={2} />;
      case "views":
        return <Eye size={iconSize} color="#a855f7" strokeWidth={2.2} />;
      case "stories":
        return <Sparkles size={iconSize} color="#c084fc" strokeWidth={2.2} />;
      case "shares":
        return <Send size={iconSize} color="#818cf8" strokeWidth={2.2} />;
      case "repost":
        return <Repeat size={iconSize} color="#ec4899" strokeWidth={2.2} />;
      case "comments":
        return <MessageCircle size={iconSize} color="#a855f7" strokeWidth={2.2} />;
      case "music":
        return <Music2 size={iconSize} color="#22c55e" strokeWidth={2.2} />;
      case "stream":
        return <Flame size={iconSize} color="#f97316" strokeWidth={2.2} />;
      default:
        return <Users size={iconSize} color="#a855f7" strokeWidth={2.2} />;
    }
  };

  const defaultLabel = () => {
    switch (type) {
      case "followers": return "seguidores";
      case "likes": return "likes";
      case "views": return "views";
      case "stories": return "stories";
      case "shares": return "compartidos";
      case "repost": return "repost";
      case "comments": return "comentarios";
      case "music": return "streams";
      case "stream": return "en vivo";
      default: return "";
    }
  };

  return (
    <div
      style={{
        width,
        height,
        borderRadius: isSm ? 22 : 32,
        background: "linear-gradient(145deg, #1f0836 0%, #0d011c 100%)",
        border: "2px solid rgba(192, 132, 252, 0.4)",
        boxShadow: "0 10px 30px rgba(118, 40, 240, 0.35), inset 0 0 18px rgba(168, 85, 247, 0.25)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isSm ? "10px 8px" : "16px 12px",
        position: "relative",
        overflow: "hidden",
        userSelect: "none",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {/* Top Notch / Dynamic Island */}
      <div
        style={{
          width: isSm ? 38 : 56,
          height: isSm ? 8 : 12,
          borderRadius: 20,
          background: "#05000a",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: 4,
          gap: 3,
        }}
      >
        <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#22c55e" }} />
      </div>

      {/* Cyber Glow Centerpiece */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Glow backdrop ring */}
        <div
          style={{
            position: "absolute",
            width: iconSize * 1.8,
            height: iconSize * 1.8,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(127, 31, 255, 0.15) 50%, transparent 75%)",
            filter: "blur(8px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ filter: "drop-shadow(0 0 12px rgba(192, 132, 252, 0.8))" }}>
          {renderIcon()}
        </div>

        <span
          style={{
            marginTop: isSm ? 6 : 10,
            fontSize: isSm ? 10 : 13,
            fontWeight: 800,
            textTransform: "lowercase",
            letterSpacing: "0.08em",
            color: "#f3e8ff",
            textShadow: "0 0 10px rgba(192, 132, 252, 0.7)",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {label || defaultLabel()}
        </span>
      </div>

      {/* Bottom Home Indicator Bar */}
      <div
        style={{
          width: isSm ? 32 : 50,
          height: isSm ? 3 : 4,
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.35)",
        }}
      />

      {/* Cyber Neon Corner Accents */}
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -20,
          left: -20,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

