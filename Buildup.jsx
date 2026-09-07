import { useEffect, useRef, useState } from "react";
import { buildupLines } from "../data/birthdayData";
import "./Buildup.css";

export default function Buildup({ clockRef, energyRef }) {
  const [progress, setProgress] = useState(0);
  const rafId = useRef(null);

  useEffect(() => {
    function loop() {
      setProgress(clockRef.current?.sceneProgress ?? 0);
      rafId.current = requestAnimationFrame(loop);
    }
    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, [clockRef]);

  const count = buildupLines.length;
  const slice = 1 / count;
  const activeIndex = Math.min(count - 1, Math.floor(progress / slice));
  const local = (progress - activeIndex * slice) / slice;

  let opacity = 1;
  if (local < 0.15) opacity = local / 0.15;
  else if (local > 0.8) opacity = Math.max(0, (1 - local) / 0.2);

  const isLast = activeIndex === count - 1;
  const glowIntensity = 0.15 + progress * 0.35 + (energyRef?.current?.level || 0) * 0.15;

  return (
    <div className="buildup-scene">
      <div className="buildup-glow" style={{ opacity: glowIntensity }} />
      <div className="grain-overlay" />
      <p
        className={`buildup-line ${isLast ? "title-line" : "script-line"}`}
        style={{ opacity, filter: `blur(${(1 - opacity) * 5}px)` }}
      >
        {buildupLines[activeIndex]}
      </p>
    </div>
  );
}
