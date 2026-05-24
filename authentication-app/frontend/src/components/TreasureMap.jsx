import { useState, useRef, useCallback } from "react";
import "./TreasureMap.css";

const LANDMARKS = [
  { id: 0,  name: "The Gallows",      x: 88,  y: 55  },
  { id: 1,  name: "Shipwreck Bay",    x: 220, y: 45  },
  { id: 2,  name: "Skull Rock",       x: 370, y: 38  },
  { id: 3,  name: "Witch's Cove",     x: 490, y: 55  },
  { id: 4,  name: "Old Fort",         x: 62,  y: 160 },
  { id: 5,  name: "The Crossroads",   x: 175, y: 150 },
  { id: 6,  name: "Jungle Temple",    x: 300, y: 130 },
  { id: 7,  name: "Serpent Lake",     x: 420, y: 145 },
  { id: 8,  name: "Pirates' Rest",    x: 52,  y: 265 },
  { id: 9,  name: "Deadman's Cove",   x: 165, y: 258 },
  { id: 10, name: "Black Market",     x: 295, y: 240 },
  { id: 11, name: "Leviathan Deep",   x: 415, y: 255 },
  { id: 12, name: "Siren's Spire",    x: 510, y: 240 },
  { id: 13, name: "Smugglers' Wharf", x: 120, y: 335 },
  { id: 14, name: "Treasure Point",   x: 260, y: 330 },
  { id: 15, name: "The Kraken Pit",   x: 400, y: 330 },
];

function RouteLine({ ax, ay, bx, by, color }) {
  const len = Math.hypot(bx - ax, by - ay).toFixed(1);
  return (
    <path
      d={`M${ax},${ay}L${bx},${by}`}
      className="route-line"
      stroke={color || "rgba(139,32,32,.55)"}
      strokeWidth="1.8"
      style={{
        strokeDasharray: len,
        strokeDashoffset: len,
        animation: "tmDash .4s ease forwards",
      }}
    />
  );
}

function Landmark({ lm, state, seqNum, onHover, onOut, onClick }) {
  const { x, y, name } = lm;
  const isHov   = state === "hov";
  const isSel   = state === "sel-red" || state === "sel-green";
  const selColor = state === "sel-green" ? "#34d399" : "#8b2020";

  return (
    <g
      className="tm-landmark"
      onMouseEnter={() => onHover(lm.id)}
      onMouseLeave={() => onOut(lm.id)}
      onClick={() => onClick(lm.id)}
    >
      <circle cx={x} cy={y} r={18} fill="transparent" />
      <circle
        className="lm-ring"
        cx={x} cy={y}
        r={isSel ? 12 : isHov ? 10 : 8}
        fill={isSel ? (selColor === "#34d399" ? "rgba(52,211,153,.07)" : "rgba(139,32,32,.07)") : isHov ? "rgba(196,154,42,.06)" : "transparent"}
        stroke={isSel ? (selColor === "#34d399" ? "rgba(52,211,153,.3)" : "rgba(139,32,32,.3)") : isHov ? "rgba(196,154,42,.28)" : "transparent"}
        strokeWidth="1.4"
      />
      <g className="lm-xmark" opacity={isSel ? 1 : isHov ? 0.5 : 0.22} filter={isSel ? "url(#gB)" : "url(#gA)"}>
        <line x1={x-6} y1={y-6} x2={x+6} y2={y+6} stroke={isSel ? selColor : "#4a2f0a"} strokeWidth={isSel ? 2.2 : 1.8} strokeLinecap="round" />
        <line x1={x+6} y1={y-6} x2={x-6} y2={y+6} stroke={isSel ? selColor : "#4a2f0a"} strokeWidth={isSel ? 2.2 : 1.8} strokeLinecap="round" />
      </g>
      <circle
        className="lm-dot" cx={x} cy={y}
        r={isSel ? 5 : isHov ? 4.5 : 3.5}
        fill={isSel ? selColor : isHov ? "#c49a2a" : "#4a2f0a"}
        opacity={isSel ? 1 : isHov ? 0.9 : 0.5}
        filter={isSel ? "url(#gB)" : ""}
      />
      {seqNum && (
        <text x={x+9} y={y-7} className="lm-seq" fill={state === "sel-green" ? "#34d399" : "#8b2020"}>
          {seqNum}
        </text>
      )}
      <text x={x} y={y+16} textAnchor="middle" className="lm-label">{name}</text>
    </g>
  );
}

function MapDecor() {
  return (
    <>
      <ellipse cx="520" cy="80" rx="90" ry="55" fill="rgba(74,127,165,.22)" stroke="rgba(74,127,165,.14)" strokeWidth=".5" />
      <ellipse cx="540" cy="100" rx="60" ry="35" fill="rgba(107,159,194,.14)" />
      <path d="M478,72 Q485,68 492,72 Q499,76 506,72" fill="none" stroke="rgba(74,127,165,.4)" strokeWidth=".8" />
      <path d="M510,85 Q517,81 524,85 Q531,89 538,85" fill="none" stroke="rgba(74,127,165,.4)" strokeWidth=".8" />
      <path d="M490,96 Q497,92 504,96 Q511,100 518,96" fill="none" stroke="rgba(74,127,165,.35)" strokeWidth=".8" />
      <text x="518" y="78" textAnchor="middle" fill="rgba(74,127,165,.5)" fontFamily="IM Fell English,serif" fontStyle="italic" fontSize="7">Mare Ignotum</text>
      <ellipse cx="545" cy="300" rx="44" ry="27" fill="rgba(180,150,80,.22)" stroke="rgba(139,101,48,.18)" strokeWidth=".5" />
      <text x="545" y="303" textAnchor="middle" fill="rgba(42,26,6,.32)" fontFamily="IM Fell English,serif" fontStyle="italic" fontSize="6.5">Isla Dorada</text>
      <path d="M60,130 L75,108 L90,130 L105,112 L120,130" fill="none" stroke="rgba(42,26,6,.2)" strokeWidth="1.2" />
      <path d="M62,130 L75,111 L88,130Z" fill="rgba(42,26,6,.07)" />
      <path d="M103,130 L115,114 L127,130Z" fill="rgba(42,26,6,.07)" />
      <path d="M400,200 L412,183 L424,200 L436,188 L448,200" fill="none" stroke="rgba(42,26,6,.17)" strokeWidth="1" />
      <path d="M402,200 L413,185 L424,200Z" fill="rgba(42,26,6,.06)" />
      {[[200,290],[208,293],[195,295],[330,60],[338,63],[325,65],[460,165],[468,168],[455,170]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r={i%3===0?5:4} fill="rgba(45,90,39,.26)" stroke="rgba(45,90,39,.18)" strokeWidth=".5" />
      ))}
      <g transform="translate(555,30)">
        <circle cx="0" cy="0" r="18" fill="rgba(242,228,196,.6)" stroke="#8b6530" strokeWidth=".8" />
        <circle cx="0" cy="0" r="3" fill="#c49a2a" stroke="#8b6530" strokeWidth=".5" />
        <polygon points="0,-14 2.5,-4 -2.5,-4" fill="#8b2020" opacity=".85" />
        <polygon points="0,14 2.5,4 -2.5,4" fill="#4a2f0a" opacity=".65" />
        <polygon points="14,0 4,2.5 4,-2.5" fill="#4a2f0a" opacity=".65" />
        <polygon points="-14,0 -4,2.5 -4,-2.5" fill="#4a2f0a" opacity=".65" />
        <text x="0" y="-16" textAnchor="middle" fill="#8b2020" fontFamily="Cinzel Decorative,serif" fontSize="5" fontWeight="700">N</text>
        <text x="0" y="22" textAnchor="middle" fill="#4a2f0a" fontFamily="Cinzel Decorative,serif" fontSize="4.5">S</text>
        <text x="17" y="2" textAnchor="middle" fill="#4a2f0a" fontFamily="Cinzel Decorative,serif" fontSize="4.5">E</text>
        <text x="-17" y="2" textAnchor="middle" fill="#4a2f0a" fontFamily="Cinzel Decorative,serif" fontSize="4.5">W</text>
      </g>
      <rect x="4" y="4" width="592" height="352" rx="2" fill="none" stroke="rgba(139,101,48,.32)" strokeWidth="1.2" />
      <rect x="8" y="8" width="584" height="344" rx="1" fill="none" stroke="rgba(139,101,48,.18)" strokeWidth=".6" />
    </>
  );
}

export default function TreasureMap({ mode: propMode, onComplete }) {
  const [cur, setCur]                 = useState([]);
  const [lines, setLines]             = useState([]);
  const [hoverId, setHoverId]         = useState(null);
  const [canvasState, setCanvasState] = useState("");
  const [shaking, setShaking]         = useState(false);
  const [msgText, setMsgText]         = useState(
    propMode === "setup" ? "Tap landmarks to chart thy secret route"
    : propMode === "login" ? "Tap thy landmarks in the exact order thou set"
    : "The map awaits thy hand, navigator"
  );
  const [msgCls, setMsgCls] = useState("");
  const [done, setDone]     = useState(false);

  const msg = useCallback((t, cls = "") => {
    setMsgText(t);
    setMsgCls(cls);
  }, []);

  const addWaypoint = useCallback((id) => {
    if (done) return;
    if (propMode === "setup" && cur.includes(id)) return;

    const next = [...cur, id];
    setCur(next);

    if (next.length > 1) {
      const a = LANDMARKS[next[next.length - 2]];
      const b = LANDMARKS[id];
      setLines(l => [...l, { ax: a.x, ay: a.y, bx: b.x, by: b.y }]);
    }

    if (propMode === "setup") {
      msg(next.length >= 2
        ? `Route: ${next.length} waypoints — add more or seal it`
        : "Mark at least one more waypoint");
    } else {
      msg(`${next.length} waypoint${next.length !== 1 ? "s" : ""} marked — confirm when ready`);
    }
  }, [cur, done, propMode, msg]);

  const handleReset = () => {
    if (done) return;
    setCur([]);
    setLines([]);
    setCanvasState("");
    setMsgCls("");
    msg(propMode === "setup"
      ? "Tap landmarks to chart thy secret route"
      : "Tap thy landmarks in the exact order thou set");
  };

  const handleSeal = () => {
    if (cur.length < 2) return;
    const routeStr = cur.join(",");
    setDone(true);
    setCanvasState("ok");
    msg(
      propMode === "setup"
        ? "⚓ Route sealed — registering thy passage…"
        : "⟶ Route submitted — verifying…",
      "ok"
    );
    if (onComplete) onComplete(routeStr);
  };

  const getLmState = (id) => {
    if (cur.includes(id)) return "sel-red";
    if (id === hoverId && !done) return "hov";
    return "off";
  };

  const canvasClass = [
    "tm-canvas",
    canvasState ? `state-${canvasState}` : "",
    shaking ? "shake" : "",
  ].filter(Boolean).join(" ");

  const svgCls = ["tm-svg", !done ? "mode-active" : ""].filter(Boolean).join(" ");

  const showSeal    = propMode === "setup" && cur.length >= 2 && !done;
  const showConfirm = propMode === "login" && cur.length >= 1 && !done;

  return (
    <div className="tm-root">
      <header className="tm-header">
        <div className="tm-logo">⚓ The Secret Route</div>
        <div className="tm-sub">
          {propMode === "setup"
            ? "Step 2 — Chart thy secret passage across the map"
            : propMode === "login"
            ? "Retrace thy exact route to sail in"
            : "Chart thy passage · Mark the waypoints · Guard the treasure"}
        </div>
      </header>

      <div className={canvasClass}>
        <svg className={svgCls} viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="gA" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="gB" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <MapDecor />
          <g>{lines.map((ln, i) => <RouteLine key={i} {...ln} />)}</g>
          <g>
            {LANDMARKS.map((lm) => (
              <Landmark
                key={lm.id}
                lm={lm}
                state={getLmState(lm.id)}
                seqNum={cur.includes(lm.id) ? cur.indexOf(lm.id) + 1 : null}
                onHover={(id) => { if (!done) setHoverId(id); }}
                onOut={() => setHoverId(null)}
                onClick={addWaypoint}
              />
            ))}
          </g>
        </svg>
      </div>

      <div className="tm-status">
        <div className={`tm-msg ${msgCls}`}>{msgText}</div>
        <div className="tm-counter">waypoints: {cur.length}</div>
        <div className="tm-actions">
          {!done && (
            <button className="tm-btn" onClick={handleReset}>⟳ Reset</button>
          )}
          {showSeal && (
            <button className="tm-btn danger" onClick={handleSeal}>
              ⚓ Seal the Route ✓
            </button>
          )}
          {showConfirm && (
            <button className="tm-btn danger" onClick={handleSeal}>
              ⟶ Confirm Route
            </button>
          )}
        </div>
      </div>
    </div>
  );
}