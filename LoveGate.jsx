import { useEffect, useMemo, useRef, useState } from "react";
import { loveGateText } from "../data/birthdayData";
import "./LoveGate.css";

function seededRandom(seed) {
  const x = Math.sin(seed * 999.123) * 10000;
  return x - Math.floor(x);
}

const STEP_BEFORE = 0;
const STEP_ONE_WORD = 1;
const STEP_INPUT = 2;

export default function LoveGate({ audioRef, onComplete }) {
  const [step, setStep] = useState(STEP_BEFORE);
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(STEP_ONE_WORD), 2600);
    const t2 = setTimeout(() => setStep(STEP_INPUT), 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (step === STEP_INPUT) {
      const t = setTimeout(() => inputRef.current?.focus(), 500);
      return () => clearTimeout(t);
    }
  }, [step]);

  function handleChange(e) {
    const raw = e.target.value.toLowerCase();
    setValue(raw);

    const target = loveGateText.targetWord;

    if (raw.length === 0) {
      setWrong(false);
      return;
    }

    if (raw === target) {
      // SUCCESS - this must happen synchronously inside the user's
      // keystroke event so the browser treats audio.play() as a
      // direct result of user interaction (autoplay policy).
      setWrong(false);
      setSucceeded(true);
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
      setTimeout(() => {
        onComplete();
      }, 2200);
      return;
    }

    if (target.startsWith(raw)) {
      setWrong(false);
    } else {
      setWrong(true);
    }
  }

  const glowStrength = Math.min(1, value.length / loveGateText.targetWord.length);

  const dust = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        left: seededRandom(i * 3.7) * 100,
        delay: seededRandom(i * 6.1) * 8,
        duration: 8 + seededRandom(i * 9.9) * 6,
        size: 1.5 + seededRandom(i * 4.4) * 2.5,
      })),
    []
  );

  return (
    <div className={`love-gate ${succeeded ? "love-gate-success" : ""}`}>
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

      <div className="love-gate-content">
        <p className={`love-gate-line script-line ${step === STEP_BEFORE ? "visible" : "hidden"}`}>
          {loveGateText.before}
        </p>
        <p className={`love-gate-line script-line ${step === STEP_ONE_WORD ? "visible" : "hidden"}`}>
          {loveGateText.oneWord}
        </p>

        <div className={`love-gate-input-wrap ${step === STEP_INPUT ? "visible" : "hidden"}`}>
          {!succeeded ? (
            <>
              <div
                className="glass-box"
                style={{
                  boxShadow: `0 0 ${20 + glowStrength * 40}px rgba(217,178,107,${0.15 + glowStrength * 0.35})`,
                  borderColor: `rgba(217,178,107,${0.3 + glowStrength * 0.5})`,
                }}
              >
                <input
                  ref={inputRef}
                  className="glass-input"
                  type="text"
                  value={value}
                  onChange={handleChange}
                  placeholder={loveGateText.placeholder}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
                <span className="glass-cursor" />
              </div>
              {wrong && <p className="wrong-message fade-text-enter">{loveGateText.wrongWord}</p>}
            </>
          ) : (
            <p className="found-message title-line">{loveGateText.correctWord}</p>
          )}
        </div>
      </div>
    </div>
  );
}
