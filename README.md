# Happy Birthday, Gayathri ❤️ — Private Cinematic Story

A React + Vite cinematic birthday film. Everything — all 10 photos and the
song — is already bundled inside the project. There is no upload UI: the
visitor only ever experiences the finished story.

## Run it

```
npm install
npm run dev
```

Open the local URL Vite prints (usually http://localhost:5173).

## The experience

1. **Loading** — the app preloads all 10 photos and the song's metadata
   ("preparing your memories..." → "ready.") before anything is shown.
2. **The "love" gate** — a cinematic, almost-black screen with a glass
   input box. Typing the word **"love"** triggers the music to start
   (as a direct result of that keystroke, to satisfy browser autoplay
   rules) and the story begins automatically — no button press needed.
3. **The story** — a word-by-word cinematic intro, then all 10 photos
   presented full-viewport with individual camera movements, a midpoint
   emotional pause, a special slow treatment for photo 10, a birthday
   build-up, the main reveal (date → "happy birthday" → "Gayathri" → ❤️),
   and a closing message that fades gently instead of stopping abruptly.
4. **Replay** — a minimal "replay our story" button at the very end
   restarts the whole experience from the "love" screen.

Everything is paced against the **actual duration of the bundled song**
(`audio.currentTime` / `audio.duration`, updated every animation frame —
no independent timers), so photos are always held long enough to be seen
and the film never desyncs from the music, even if it's paused or the
tab lags.

## Editing the text / name / date / photos / song

- All on-screen text, the name, and the birthday date live in
  `src/data/birthdayData.js`.
- To swap a photo, replace the matching file in `src/assets/photos/`
  (same filename) or update the import path in `birthdayData.js`.
- To swap the song, replace `src/assets/audio/song.m4a` (or update the
  import path — any format the browser's `<audio>` element supports
  works, e.g. mp3/wav/m4a/aac).

## Project structure

```
src/
  components/
    LoadingScreen.jsx      <- preloads photos + song metadata
    LoveGate.jsx            <- the "type the word love" intro
    Experience.jsx           <- orchestrates playback + active scene
    StoryIntro.jsx            <- word-by-word cinematic opening
    PhotoScene.jsx             <- reusable cinematic photo scene (10x),
                                  layered blurred-background + natural
                                  foreground framing
    MidpointScene.jsx          <- emotional pause after photo 5
    Buildup.jsx                 <- cinematic anticipation before the reveal
    BirthdayReveal.jsx           <- date / "happy birthday" / name / heart
    FinalMessage.jsx              <- closing message + gentle fade + replay
    ControlsAutoHide.jsx           <- minimal auto-hiding music/pause icons
    WordReveal.jsx / SceneLines.jsx <- shared text-reveal helpers
  data/
    birthdayData.js         <- all editable text/config + asset imports
  hooks/
    useTimelineClock.js     <- audio.currentTime -> scene state
    useAudioEnergy.js       <- subtle Web Audio API reactive visuals
  utils/
    timelineCalculator.js   <- adaptive duration math
```

No song lyrics from copyrighted songs are used anywhere — all on-screen
text is original.
