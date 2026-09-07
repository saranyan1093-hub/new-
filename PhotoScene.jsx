import { useEffect, useRef, useState } from "react";
import SceneLines from "./SceneLines";
import "./PhotoScene.css";

const FADE_IN = 0.08;
const FADE_OUT = 0.1;

export default function PhotoScene({ clockRef, photoUrl, photoIndex, lines, movement, special, energyRef }) {
  const [progress, setProgress] = useState(0);
  const [orientation, setOrientation] = useState(null); // "landscape" | "portrait"
  const rafId = useRef(null);

  useEffect(() => {
    function loop() {
      setProgress(clockRef.current?.sceneProgress ?? 0);
      rafId.current = requestAnimationFrame(loop);
    }
    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, [clockRef]);

  function handleImgLoad(e) {
    const { naturalWidth, naturalHeight } = e.target;
    if (!naturalWidth || !naturalHeight) return;
    setOrientation(naturalWidth / naturalHeight >= 1.15 ? "landscape" : "portrait");
  }

  const fadeOpacity = crossfadeOpacity(progress, FADE_IN, FADE_OUT);
  const imgStyle = movementStyle(movement, progress);
  const isCover = orientation === "landscape";

  // Photo 10's special slow golden entrance: the frame emerges from
  // darkness during the first ~22% of the scene.
  const specialEntrance = special ? Math.min(1, progress / 0.22) : 1;

  return (
    <div className="photo-scene" style={{ opacity: fadeOpacity }}>
      {special && (
        <div
          className="special-golden-light"
          style={{ opacity: 0.6 * (1 - specialEntrance) + 0.15 }}
        />
      )}

      <div className="photo-scene-media" style={{ opacity: special ? specialEntrance : 1 }}>
        {!isCover && (
          <img
            src={photoUrl}
            alt=""
            aria-hidden="true"
            className="photo-scene-bg"
            style={imgStyle}
          />
        )}
        <div className="photo-scene-frame">
          <img
            src={photoUrl}
            alt={`memory ${photoIndex + 1}`}
            onLoad={handleImgLoad}
            className={`photo-scene-fg movement-${movement} ${isCover ? "fit-cover" : "fit-contain"}`}
            style={imgStyle}
          />
        </div>
      </div>

      <div className="vignette-overlay" />
      <div className="grain-overlay" />
      <div
        className="light-leak"
        style={{ opacity: 0.35 + 0.25 * Math.sin(progress * Math.PI) + (energyRef?.current?.level || 0) * 0.15 }}
      />
      <div className="photo-scene-text-wrap">
        <SceneLines lines={lines} progress={progress} />
      </div>
    </div>
  );
}

function crossfadeOpacity(p, fadeIn, fadeOut) {
  if (p < fadeIn) return p / fadeIn;
  if (p > 1 - fadeOut) return Math.max(0, (1 - p) / fadeOut);
  return 1;
}

function movementStyle(movement, p) {
  switch (movement) {
    case "push-in": {
      const scale = 1 + p * 0.09;
      return { transform: `scale(${scale})` };
    }
    case "pan-lr": {
      const x = -3 + p * 6;
      return { transform: `scale(1.08) translateX(${x}%)` };
    }
    case "pan-rl": {
      const x = 3 - p * 6;
      return { transform: `scale(1.08) translateX(${x}%)` };
    }
    case "zoom-out": {
      const scale = 1.1 - p * 0.08;
      return { transform: `scale(${scale})` };
    }
    case "diagonal": {
      const x = -2 + p * 4;
      const y = -2 + p * 4;
      return { transform: `scale(1.09) translate(${x}%, ${y}%)` };
    }
    case "slow-push-in": {
      const scale = 1 + p * 0.05;
      return { transform: `scale(${scale})` };
    }
    case "vertical": {
      const y = -3 + p * 6;
      return { transform: `scale(1.08) translateY(${y}%)` };
    }
    case "parallax": {
      const x = p * -3;
      const y = p * 1.5;
      return { transform: `scale(1.1) translate(${x}%, ${y}%)` };
    }
    case "zoom-light-leak": {
      const scale = 1 + p * 0.07;
      return { transform: `scale(${scale})`, filter: `brightness(${1 + p * 0.06})` };
    }
    case "dramatic-push-in": {
      const scale = 1 + p * 0.14;
      return { transform: `scale(${scale})`, filter: `brightness(${1 + p * 0.08})` };
    }
    default:
      return { transform: `scale(${1 + p * 0.06})` };
  }
}
