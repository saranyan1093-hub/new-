import { useEffect, useRef, useState } from "react";
import "./ControlsAutoHide.css";

/**
 * Minimal, unobtrusive playback controls: a music icon bottom-left and
 * a pause/resume control bottom-right. Both fade away automatically
 * after a few seconds of inactivity and reappear on mouse move / touch.
 */
export default function ControlsAutoHide({ isPlaying, isMuted, onTogglePlay, onToggleMute }) {
  const [visible, setVisible] = useState(true);
  const hideTimer = useRef(null);

  function showControls() {
    setVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), 3200);
  }

  useEffect(() => {
    showControls();
    window.addEventListener("mousemove", showControls);
    window.addEventListener("touchstart", showControls);
    return () => {
      window.removeEventListener("mousemove", showControls);
      window.removeEventListener("touchstart", showControls);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`controls-auto-hide ${visible ? "visible" : ""}`}>
      <button className="ctrl-icon-btn ctrl-left" onClick={onToggleMute} aria-label="toggle music">
        {isMuted ? "\u266A\u0338" : "\u266A"}
      </button>
      <button className="ctrl-icon-btn ctrl-right" onClick={onTogglePlay} aria-label="play or pause">
        {isPlaying ? "\u23F8" : "\u25B6"}
      </button>
    </div>
  );
}
