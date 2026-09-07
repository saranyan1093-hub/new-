import "./WordReveal.css";

/**
 * Renders one "line" (array of words) at a time from `wordLines`,
 * revealing its words in a staggered cinematic fashion (blur -> sharp,
 * opacity, slight vertical drift) as `progress` (0-1, audio-synced)
 * advances. Purely progress-driven - no independent timers.
 */
export default function WordReveal({ wordLines, progress }) {
  const count = wordLines.length;
  const slice = 1 / count;
  const activeIndex = Math.min(count - 1, Math.floor(progress / slice));
  const local = (progress - activeIndex * slice) / slice;
  const words = wordLines[activeIndex];

  // reveal window: first 45% of the line's slot staggers the words in,
  // hold until 80%, then fade the whole line out over the last 20%.
  const revealWindow = 0.45;
  const lineFadeOut =
    local > 0.8 ? Math.max(0, (1 - local) / 0.2) : 1;

  return (
    <div className="word-reveal">
      {words.map((word, i) => {
        const wordStart = (i / words.length) * revealWindow;
        const wordEnd = wordStart + revealWindow / words.length + 0.12;
        let wordProgress = 0;
        if (local >= wordEnd) wordProgress = 1;
        else if (local > wordStart) wordProgress = (local - wordStart) / (wordEnd - wordStart);

        const opacity = wordProgress * lineFadeOut;
        const blur = (1 - wordProgress) * 8;
        const translateY = (1 - wordProgress) * 14;

        return (
          <span
            key={i}
            className="word-reveal-word title-line"
            style={{
              opacity,
              filter: `blur(${blur}px)`,
              transform: `translateY(${translateY}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}
