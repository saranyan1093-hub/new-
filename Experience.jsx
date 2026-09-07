import { useEffect, useState } from "react";
import { useTimelineClock } from "../hooks/useTimelineClock";
import { photoUrls, photoScenes } from "../data/birthdayData";
import StoryIntro from "./StoryIntro";
import PhotoScene from "./PhotoScene";
import MidpointScene from "./MidpointScene";
import Buildup from "./Buildup";
import BirthdayReveal from "./BirthdayReveal";
import FinalMessage from "./FinalMessage";
import ControlsAutoHide from "./ControlsAutoHide";
import "./Experience.css";

export default function Experience({ audioRef, plan, onReplay, energyRef }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const { sceneIndex, clockRef } = useTimelineClock(audioRef, plan);

  const currentScene = plan?.scenes[sceneIndex];

  // Gently fade the music out over the last stretch of the final scene
  // instead of an abrupt stop.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let rafId;
    function loop() {
      const scene = clockRef.current.scene;
      if (scene?.type === "final") {
        const p = clockRef.current.sceneProgress;
        const fadeStart = 0.7;
        if (p > fadeStart) {
          const t = (p - fadeStart) / (1 - fadeStart);
          audio.volume = Math.max(0, 1 - t);
        } else {
          audio.volume = 1;
        }
      } else {
        audio.volume = 1;
      }
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [audioRef, clockRef]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  }

  const lastPhotoUrl = photoUrls[9];

  return (
    <div className="experience-root">
      <div className="scene-stage">
        {currentScene?.type === "storyIntro" && (
          <StoryIntro clockRef={clockRef} energyRef={energyRef} />
        )}

        {currentScene?.type === "photo" && (
          <PhotoScene
            key={currentScene.photoIndex}
            clockRef={clockRef}
            photoUrl={photoUrls[currentScene.photoIndex]}
            photoIndex={currentScene.photoIndex}
            lines={photoScenes[currentScene.photoIndex]?.lines || [""]}
            movement={photoScenes[currentScene.photoIndex]?.movement || "push-in"}
            special={!!currentScene.special}
            energyRef={energyRef}
          />
        )}

        {currentScene?.type === "midpoint" && <MidpointScene clockRef={clockRef} />}

        {currentScene?.type === "buildup" && (
          <Buildup clockRef={clockRef} energyRef={energyRef} />
        )}

        {currentScene?.type === "reveal" && (
          <BirthdayReveal clockRef={clockRef} energyRef={energyRef} />
        )}

        {currentScene?.type === "final" && (
          <FinalMessage clockRef={clockRef} onReplay={onReplay} />
        )}
      </div>

      <ControlsAutoHide
        isPlaying={isPlaying}
        isMuted={isMuted}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
      />
    </div>
  );
}
