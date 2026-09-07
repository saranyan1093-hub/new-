import { useEffect, useRef } from "react";

/**
 * Attaches a Web Audio AnalyserNode to the given <audio> element and
 * exposes a live, smoothed 0..1 "energy" value via a mutable ref that
 * visual components can read per animation frame (no re-renders).
 *
 * Deliberately subtle: this is used to nudge particle speed / glow
 * intensity a little, never to make the whole screen pulse.
 *
 * Web Audio requires a user gesture before the AudioContext can run,
 * and createMediaElementSource can only ever be called ONCE per
 * <audio> element for its whole lifetime - so we guard against
 * double-setup (e.g. React StrictMode double-invoking effects).
 */
export function useAudioEnergy(audioRef) {
  const energyRef = useRef({ level: 0 });
  const setupDone = useRef(false);
  const rafId = useRef(null);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl || setupDone.current) return;

    function setup() {
      if (setupDone.current) return;
      const audio = audioRef.current;
      if (!audio) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const source = ctx.createMediaElementSource(audio);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.82;
        source.connect(analyser);
        analyser.connect(ctx.destination); // must reconnect or audio goes silent
        setupDone.current = true;

        const data = new Uint8Array(analyser.frequencyBinCount);
        function loop() {
          analyser.getByteFrequencyData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) sum += data[i];
          const avg = sum / data.length / 255; // 0..1
          // smooth toward the new value so it never feels jittery
          energyRef.current.level += (avg - energyRef.current.level) * 0.15;
          rafId.current = requestAnimationFrame(loop);
        }
        rafId.current = requestAnimationFrame(loop);
      } catch (e) {
        // Web Audio unavailable / blocked - visuals simply stay non-reactive.
        setupDone.current = true;
      }
    }

    // Must run after (or during) the user's play gesture.
    if (!audioEl.paused) {
      setup();
    } else {
      audioEl.addEventListener("play", setup, { once: true });
    }

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      audioEl.removeEventListener("play", setup);
    };
  }, [audioRef]);

  return energyRef;
}
