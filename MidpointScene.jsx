import { useEffect, useRef, useState } from "react";
import { midpointLines } from "../data/birthdayData";
import "./MidpointScene.css";

export default function MidpointScene({ clockRef }) {
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

  const count = midpointLines.length;
  const slice = 1 / count;
  const activeIndex = Math.min(count - 1, Math.floor(progress / slice));
  const local = (progress - activeIndex * slice) / slice;

  let opacity = 1;
  if (local < 0.15) opacity = local / 0.15;
  else if (local > 0.8) opacity = Math.max(0, (1 - local) / 0.2);

  const isThankYou = activeIndex >= count - 2;

  return (
    <div className="midpoint-scene">
      <div className="grain-overlay" />
      <p
        className={`midpoint-line ${isThankYou ? "title-line" : "script-line"}`}
        style={{ opacity, filter: `blur(${(1 - opacity) * 5}px)` }}
      >
        {midpointLines[activeIndex]}
      </p>
    </div>
  );
}
