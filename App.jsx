import { useRef, useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import LoveGate from "./components/LoveGate";
import Experience from "./components/Experience";
import { computeTimeline } from "./utils/timelineCalculator";
import { useAudioEnergy } from "./hooks/useAudioEnergy";

const PHASE_LOADING = "loading";
const PHASE_GATE = "gate";
const PHASE_EXPERIENCE = "experience";

export default function App() {
  const audioRef = useRef(null);
  const [phase, setPhase] = useState(PHASE_LOADING);
  const [plan, setPlan] = useState(null);
  const [gateKey, setGateKey] = useState(0);

  // Lives at the App level (never unmounts) because a MediaElementSourceNode
  // can only ever be created ONCE for a given <audio> element's whole
  // lifetime - if this lived inside Experience, replaying (which unmounts
  // and remounts Experience) would throw on the second attempt.
  const energyRef = useAudioEnergy(audioRef);

  function handleAssetsReady(duration) {
    setPlan(computeTimeline(duration || 150));
    setPhase(PHASE_GATE);
  }

  function handleGateComplete() {
    setPhase(PHASE_EXPERIENCE);
  }

  function handleReplay() {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 1;
    }
    setGateKey((k) => k + 1);
    setPhase(PHASE_GATE);
  }

  return (
    <div className="app-root">
      <audio ref={audioRef} preload="auto" />

      {phase === PHASE_LOADING && (
        <LoadingScreen audioRef={audioRef} onReady={handleAssetsReady} />
      )}

      {phase === PHASE_GATE && (
        <LoveGate key={gateKey} audioRef={audioRef} onComplete={handleGateComplete} />
      )}

      {phase === PHASE_EXPERIENCE && (
        <Experience audioRef={audioRef} plan={plan} onReplay={handleReplay} energyRef={energyRef} />
      )}
    </div>
  );
}
