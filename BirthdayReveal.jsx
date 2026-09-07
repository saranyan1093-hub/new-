import { useEffect, useMemo, useRef, useState } from "react";
import { revealSequence } from "../data/birthdayData";
import "./BirthdayReveal.css";

function seededRandom(seed) {
  const x = Math.sin(seed * 999.123) * 10000;
  return x - Math.floor(x);
}

export default function BirthdayReveal({ clockRef, energyRef }) {
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

  const lightScale = Math.min(1, progress / 0.16);
  const dateOp = fadeWindow(progress, 0.14, 0.24, 0.32, 0.38);
  const happyOp = fadeWindow(progress, 0.36, 0.48, 0.56, 0.62);
  const nameOp = fadeWindow(progress, 0.58, 0.72, 1, 1);
  const nameGlow = Math.min(1, fadeWindow(progress, 0.58, 0.85, 1, 1));
  const heartOp = fadeWindow(progress, 0.88, 0.97, 1, 1);

  const energy = energyRef?.current?.level || 0;
  const particlesOn = progress > 0.12;

  const particles = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        left: seededRandom(i * 3.1) * 100,
        delay: seededRandom(i * 7.7) * 4,
        duration: 4 + seededRandom(i * 11.3) * 4,
        size: 2 + seededRandom(i * 5.5) * 4,
        gold: i % 2 === 0,
      })),
    []
  );

  return (
    <div className="reveal-scene">
      <div
        className="reveal-light"
        style={{
          transform: `translate(-50%, -50%) scale(${0.05 + lightScale * 6})`,
          opacity: Math.min(0.9, 0.2 + lightScale * 0.7 + energy * 0.1),
        }}
      />
      {particlesOn && (
        <div className="reveal-particles">
          {particles.map((p, i) => (
            <span
              key={i}
              className={`reveal-particle ${p.gold ? "gold" : "rose"}`}
              style={{
                left: `${p.left}%`,
                width: p.size,
                height: p.size,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration / (1 + energy * 0.4)}s`,
              }}
            />
          ))}
        </div>
      )}
      <div className="reveal-text-stack">
        <p className="reveal-date" style={{ opacity: dateOp }}>
          {revealSequence.date}
        </p>
        <p className="reveal-happy title-line" style={{ opacity: happyOp }}>
          {revealSequence.happyBirthday}
        </p>
        <h1
          className="reveal-name title-line"
          style={{
            opacity: nameOp,
            textShadow: `0 0 ${20 + nameGlow * 50}px rgba(217,178,107,${0.4 + nameGlow * 0.4}), 0 0 ${10 + nameGlow * 30}px rgba(231,182,189,${0.3 + nameGlow * 0.3})`,
            transform: `scale(${0.96 + nameGlow * 0.04})`,
          }}
        >
          {revealSequence.name}
        </h1>
        <p className="reveal-heart" style={{ opacity: heartOp }}>
          {revealSequence.heart}
        </p>
      </div>
    </div>
  );
}

function fadeWindow(p, inStart, inEnd, outStart, outEnd) {
  if (p <= inStart) return 0;
  if (p < inEnd) return (p - inStart) / (inEnd - inStart);
  if (p <= outStart) return 1;
  if (p < outEnd) return 1 - (p - outStart) / (outEnd - outStart);
  return outEnd >= 1 ? 1 : 0;
}
