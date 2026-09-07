import { useEffect, useMemo, useRef, useState } from "react";
import WordReveal from "./WordReveal";
import { storyIntroWords } from "../data/birthdayData";
import "./StoryIntro.css";

function seededRandom(seed) {
  const x = Math.sin(seed * 999.123) * 10000;
  return x - Math.floor(x);
}

export default function StoryIntro({ clockRef, energyRef }) {
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

  const dust = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => ({
        left: seededRandom(i * 3.7) * 100,
        delay: seededRandom(i * 6.1) * 8,
        duration: 8 + seededRandom(i * 9.9) * 6,
        size: 1.5 + seededRandom(i * 4.4) * 2.5,
      })),
    []
  );

  const glow = 0.4 + (energyRef?.current?.level || 0) * 0.3;

  return (
    <div className="story-intro-scene">
      <div className="story-intro-glow" style={{ opacity: glow }} />
      <div className="grain-overlay" />
      <div className="light-leak" />
      <div className="bokeh-layer">
        {dust.map((d, i) => (
          <span
            key={i}
            className="bokeh-dot"
            style={{
              left: `${d.left}%`,
              width: d.size,
              height: d.size,
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.duration}s`,
            }}
          />
        ))}
      </div>
      <WordReveal wordLines={storyIntroWords} progress={progress} />
    </div>
  );
}
