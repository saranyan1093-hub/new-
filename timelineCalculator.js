// ============================================================
// CINEMATIC TIMELINE CALCULATOR
// Maps the ACTUAL bundled song duration to every scene's
// duration: the word-by-word story intro, 10 photos (photo 10
// gets extra weight for its special slow treatment), a midpoint
// emotional interlude after photo 5, a birthday build-up, the
// final reveal, and the closing message.
//
// Strategy: every segment has a MIN and PREFERRED duration.
// If the song is long enough for everyone's PREFERRED time, any
// leftover time goes mostly into the photos (so a longer song
// means slower, longer memories). If the song is shorter than
// everyone's PREFERRED time, every segment shrinks together
// (interpolated between its MIN and PREFERRED), never below MIN.
// ============================================================

const SEGMENTS = {
  storyIntro: { min: 7, pref: 11 },
  midpoint: { min: 7, pref: 11 },
  buildup: { min: 5, pref: 7 },
  reveal: { min: 9, pref: 13 },
  final: { min: 10, pref: 15 },
};

// Photo 10 gets 1.6x the weight of a normal photo for its special,
// slower treatment (dark entrance, golden light, held longer).
const PHOTO_WEIGHTS = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1.6];
const PHOTO_MIN_UNIT = 1; // seconds per weight-unit, minimum
const PHOTO_PREF_UNIT = 7; // seconds per weight-unit, preferred

function sumMin() {
  const photoMin = PHOTO_WEIGHTS.reduce((a, w) => a + w * PHOTO_MIN_UNIT, 0);
  return (
    SEGMENTS.storyIntro.min +
    SEGMENTS.midpoint.min +
    SEGMENTS.buildup.min +
    SEGMENTS.reveal.min +
    SEGMENTS.final.min +
    photoMin
  );
}

function sumPref() {
  const photoPref = PHOTO_WEIGHTS.reduce((a, w) => a + w * PHOTO_PREF_UNIT, 0);
  return (
    SEGMENTS.storyIntro.pref +
    SEGMENTS.midpoint.pref +
    SEGMENTS.buildup.pref +
    SEGMENTS.reveal.pref +
    SEGMENTS.final.pref +
    photoPref
  );
}

function lerp(a, b, t) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

/**
 * Build the full scene list for a given total song duration (seconds).
 * Returns { totalDuration, scenes: [{ type, start, duration, photoIndex? }] }
 */
export function computeTimeline(totalDuration) {
  const T = Math.max(1, totalDuration || 0);
  const minTotal = sumMin();
  const prefTotal = sumPref();

  let storyIntro, midpoint, buildup, reveal, final;
  let photos = PHOTO_WEIGHTS.map(() => 0);

  if (T <= minTotal) {
    const scale = T / minTotal;
    storyIntro = SEGMENTS.storyIntro.min * scale;
    midpoint = SEGMENTS.midpoint.min * scale;
    buildup = SEGMENTS.buildup.min * scale;
    reveal = SEGMENTS.reveal.min * scale;
    final = SEGMENTS.final.min * scale;
    photos = PHOTO_WEIGHTS.map((w) => w * PHOTO_MIN_UNIT * scale);
  } else if (T <= prefTotal) {
    const t = (T - minTotal) / (prefTotal - minTotal);
    storyIntro = lerp(SEGMENTS.storyIntro.min, SEGMENTS.storyIntro.pref, t);
    midpoint = lerp(SEGMENTS.midpoint.min, SEGMENTS.midpoint.pref, t);
    buildup = lerp(SEGMENTS.buildup.min, SEGMENTS.buildup.pref, t);
    reveal = lerp(SEGMENTS.reveal.min, SEGMENTS.reveal.pref, t);
    final = lerp(SEGMENTS.final.min, SEGMENTS.final.pref, t);
    photos = PHOTO_WEIGHTS.map((w) => lerp(w * PHOTO_MIN_UNIT, w * PHOTO_PREF_UNIT, t));
  } else {
    const extra = T - prefTotal;
    storyIntro = SEGMENTS.storyIntro.pref;
    buildup = SEGMENTS.buildup.pref;
    midpoint = SEGMENTS.midpoint.pref + extra * 0.16;
    reveal = SEGMENTS.reveal.pref + extra * 0.1;
    final = SEGMENTS.final.pref + extra * 0.09;
    const totalWeight = PHOTO_WEIGHTS.reduce((a, w) => a + w, 0);
    const photoExtraPool = extra * 0.65;
    photos = PHOTO_WEIGHTS.map((w) => w * PHOTO_PREF_UNIT + (w / totalWeight) * photoExtraPool);
  }

  const scenes = [];
  let cursor = 0;

  scenes.push({ type: "storyIntro", start: cursor, duration: storyIntro });
  cursor += storyIntro;

  for (let i = 0; i < 5; i++) {
    scenes.push({ type: "photo", photoIndex: i, start: cursor, duration: photos[i] });
    cursor += photos[i];
  }

  scenes.push({ type: "midpoint", start: cursor, duration: midpoint });
  cursor += midpoint;

  for (let i = 5; i < 9; i++) {
    scenes.push({ type: "photo", photoIndex: i, start: cursor, duration: photos[i] });
    cursor += photos[i];
  }

  scenes.push({ type: "photo", photoIndex: 9, special: true, start: cursor, duration: photos[9] });
  cursor += photos[9];

  scenes.push({ type: "buildup", start: cursor, duration: buildup });
  cursor += buildup;

  scenes.push({ type: "reveal", start: cursor, duration: reveal });
  cursor += reveal;

  scenes.push({ type: "final", start: cursor, duration: final });
  cursor += final;

  return { totalDuration: cursor, scenes };
}

/** Find which scene a given time (seconds) falls into. */
export function findSceneAt(plan, t) {
  if (!plan) return null;
  const { scenes } = plan;
  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i];
    if (t >= s.start && t < s.start + s.duration) return { scene: s, index: i };
  }
  const last = scenes[scenes.length - 1];
  return { scene: last, index: scenes.length - 1 };
}
