import { useEffect, useState } from "react";
import { photoUrls, songUrl, loadingText } from "../data/birthdayData";
import "./LoadingScreen.css";

/**
 * Preloads all 10 photos + the song's metadata (so its real duration
 * is already known before the "love" gate ever appears) and calls
 * onReady(duration) once everything is set.
 */
export default function LoadingScreen({ audioRef, onReady }) {
  const [phase, setPhase] = useState("preparing"); // preparing -> ready

  useEffect(() => {
    let cancelled = false;

    const imagePromises = photoUrls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src;
        })
    );

    const audioPromise = new Promise((resolve) => {
      const audio = audioRef.current;
      if (!audio) return resolve(0);
      if (audio.readyState >= 1 && audio.duration) {
        resolve(audio.duration);
        return;
      }
      function onMeta() {
        resolve(audio.duration || 0);
      }
      audio.addEventListener("loadedmetadata", onMeta, { once: true });
      audio.addEventListener("error", () => resolve(0), { once: true });
      audio.src = songUrl;
      audio.load();
    });

    Promise.all([...imagePromises, audioPromise]).then((results) => {
      if (cancelled) return;
      const duration = results[results.length - 1] || 0;
      setPhase("ready");
      setTimeout(() => {
        if (!cancelled) onReady(duration);
      }, 900);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="loading-screen">
      <div className="grain-overlay" />
      <p className="loading-text script-line">
        {phase === "preparing" ? loadingText.preparing : loadingText.ready}
      </p>
    </div>
  );
}
