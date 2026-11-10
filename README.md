# ほしことば Hoshikotoba · 星语图鉴

Japanese language learning app — Japanese/Chinese-first, built for learning toward JLPT N3.

ほし (star) + ことば (words) — one word, one star.

## What's inside

- **授業 · 课程 — Lessons 1–6 in order** (あ行 → か行 → さ行 → た行 → な行 → は行)
  - Each lesson: kana with readings, 12 vocabulary words, grammar points, kanji (from Lesson 4), and homework
  - Every vocabulary word has a pronunciation button (Web Speech API, ja-JP) and a Japanese example sentence with Chinese translation
  - A short reading article per lesson, shown sentence-by-sentence in Japanese with Chinese translation, with playable reading audio recorded sentence-by-sentence at near-natural pace with real pauses (`assets/audio/lesson-1.mp3` … `lesson-6.mp3`)
  - Lessons 5–6 also include 「标日例文练习」 at 《新版中日交流标准日本语》 Lesson 20 standard
- **JLPT level map** — N5 → N4 → N3 plan (with N5–N1 framework), vocabulary / kanji / grammar scope per level
- **Daily plan & FSRS review logic** — See / Hear / Recall / Speak / Review loop
- **15-question level test** — N5 / N4 / N3 placement demo with per-skill results

## Run it locally

It's a single static page — no build step, no server required.

```bash
# Option 1: just open it
open index.html

# Option 2: serve it (recommended, so audio paths resolve cleanly)
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
.
├── index.html              # The whole app (self-contained page)
├── assets/
│   ├── hero-atlas.webp     # Hero / atlas artwork
│   └── audio/
│       ├── lesson-1.mp3
│       ├── lesson-2.mp3
│       ├── lesson-3.mp3
│       ├── lesson-4.mp3
│       ├── lesson-5.mp3
│       └── lesson-6.mp3
└── README.md
```

## Notes

- Lessons 1–6 are the real course as delivered in the Muse app 「ほしことば Hoshikotoba · 星语图鉴」 (artifact: `japanese-learning-app`, v4).
- Lessons 7–8 have been taught in chat but are not yet added to the app.
- Language: UI and explanations are Japanese / Chinese first; English appears only as short glosses.
