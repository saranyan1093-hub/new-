// ============================================================
// EASY CONFIGURATION FILE
// Every editable string, name, date, and photo/song asset for
// the cinematic experience lives here.
// ============================================================

import defaultPhoto01 from "../assets/photos/photo01.jpg";
import defaultPhoto02 from "../assets/photos/photo02.jpg";
import defaultPhoto03 from "../assets/photos/photo03.jpg";
import defaultPhoto04 from "../assets/photos/photo04.jpg";
import defaultPhoto05 from "../assets/photos/photo05.jpg";
import defaultPhoto06 from "../assets/photos/photo06.jpg";
import defaultPhoto07 from "../assets/photos/photo07.jpg";
import defaultPhoto08 from "../assets/photos/photo08.jpg";
import defaultPhoto09 from "../assets/photos/photo09.jpg";
import defaultPhoto10 from "../assets/photos/photo10.jpg";
import songAsset from "../assets/audio/song.m4a";

export const photoUrls = [
  defaultPhoto01,
  defaultPhoto02,
  defaultPhoto03,
  defaultPhoto04,
  defaultPhoto05,
  defaultPhoto06,
  defaultPhoto07,
  defaultPhoto08,
  defaultPhoto09,
  defaultPhoto10,
];

export const songUrl = songAsset;

export const birthdayData = {
  name: "Gayathri",
  birthday: "09 / 09 / 2026",
};

// ---------- Loading screen ----------
export const loadingText = {
  preparing: "preparing your memories...",
  ready: "ready.",
};

// ---------- "love" gate ----------
export const loveGateText = {
  before: "before this story begins...",
  oneWord: "there's one little word...",
  placeholder: "type the word that starts our story...",
  wrongWord: "that's not the word I'm looking for...",
  correctWord: "you found it.",
  targetWord: "love",
};

// ---------- Cinematic story intro (word-by-word) ----------
export const storyIntroWords = [
  ["some", "stories", "are", "written..."],
  ["some", "are", "found..."],
  ["and", "some..."],
  ["just", "happen."],
  ["ours", "happened."],
];

// ---------- Per-photo scenes ----------
// movement matches the spec's fixed per-photo camera treatment
export const photoScenes = [
  {
    lines: ["it started with a moment.", "just a moment...", "that somehow became everything."],
    movement: "push-in",
  },
  {
    lines: ["your smile", "your chaos", "your little ways", "somehow...", "became my favorite things."],
    movement: "pan-lr",
  },
  {
    lines: ["we didn't know...", "these ordinary days", "would become", "our favorite memories."],
    movement: "pan-rl",
  },
  {
    lines: ["some people make time pass.", "you make time feel worth remembering."],
    movement: "zoom-out",
  },
  {
    lines: ["if memories had a favorite face...", "it would look like you."],
    movement: "diagonal",
  },
  {
    lines: ["thank you for being part of my story."],
    movement: "slow-push-in",
  },
  {
    lines: ["for every laugh...", "every little moment...", "every memory."],
    movement: "vertical",
  },
  {
    lines: ["here's to everything we've already shared."],
    movement: "parallax",
  },
  {
    lines: ["and everything we haven't experienced yet.", "there's still so much ahead of us."],
    movement: "zoom-light-leak",
  },
  {
    lines: ["and if I could keep one chapter...", "for a little longer...", "it would be this one.", "you."],
    movement: "dramatic-push-in",
  },
];

// ---------- Midpoint emotional interlude ----------
export const midpointLines = [
  "there are moments...",
  "you wish you could pause forever.",
  "this is one of them.",
  "thank you...",
  "for being part of my story.",
];

// ---------- Birthday build-up (replaces a normal countdown) ----------
export const buildupLines = [
  "one more thing...",
  "before this story ends...",
  "today isn't just another day.",
  "it's yours.",
];

// ---------- Final reveal ----------
export const revealSequence = {
  date: birthdayData.birthday,
  happyBirthday: "happy birthday",
  name: birthdayData.name,
  heart: "\u2764\ufe0f",
};

// ---------- Final message ----------
export const finalMessageLines = [
  "you deserve every beautiful thing life has to offer.",
  "more smiles.",
  "more adventures.",
  "more memories.",
  "and a thousand reasons to be happy.",
  "happy birthday, " + birthdayData.name + ".",
  "keep smiling.",
  "this is only the beginning. \u2764\ufe0f",
];
