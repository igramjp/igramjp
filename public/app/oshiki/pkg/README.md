# oshiki

**oshiki** (黄鐘) prints note-to-frequency tables — or live frequencies from a MIDI keyboard — in traditional Japanese and classical tunings.

It is named after *Ōshiki* (黄鐘), the reference pitch of gagaku (Japanese court music): **A = 430 Hz**. By default, oshiki anchors A to 430 Hz and derives the other eleven notes with the **Sanbun-Soneki method** (三分損益法), the traditional chain-of-fifths derivation of the Japanese twelve ritsu.

## Features

- Three temperaments:
  - **Sanbun-Soneki** (三分損益法) — Pythagorean-style chain of fifths, faithful to the traditional derivation (default)
  - **Just Intonation** — 5-limit (`--just`)
  - **Equal Temperament** — 12-TET (`--equal`)
- Any root key (default: D = Ichikotsu 壱越, the traditional fundamental) and any A4 reference frequency (default: 430 Hz)
- A4 is anchored *exactly* to the reference in every key — or pass `--root-anchor` to match synth microtuning presets instead (root note at 0 cents)
- Live frequency display from a MIDI input device

## Installation

```bash
cargo install --git https://github.com/igramjp/oshiki
```

Requires Rust and Cargo ([rustup.rs](https://rustup.rs/)).

## Usage

```bash
oshiki [root_key] [reference_frequency] [options]              # print a full table
oshiki <device_id> [root_key] [reference_frequency] [options]  # live MIDI mode
oshiki list                                                    # help + MIDI devices
```

### Examples

```bash
oshiki                        # the traditional twelve ritsu: sanbun-soneki from Ichikotsu (D), A = 430 Hz
oshiki --just                 # 5-limit just intonation instead
oshiki --equal                # equal temperament at A = 430 Hz
oshiki C 440 --just           # concert-pitch just intonation (C4 = 264 Hz)
oshiki D 430 --just --root-anchor   # match a synth JI preset with master tune at 430
oshiki 0 D                    # live frequencies from MIDI device 0
```

### Temperament options (at most one)

| Flag | Temperament |
|---|---|
| `--sanbun` | Sanbun-Soneki (三分損益法) — default |
| `--just` | 5-limit Just Intonation |
| `--equal` | 12-tone Equal Temperament (root key is ignored) |

### Anchoring

By default, **A4 is anchored exactly to the reference frequency** in every key, and the root is derived from A. This matches acoustic practice — in a gagaku ensemble, Ōshiki (A) stays at 430 Hz no matter which chōshi you play in.

With `--root-anchor`, the **root note keeps its Equal Temperament pitch** instead, and A drifts by a few cents depending on the key. This matches how most synth microtuning presets are built (root = 0 cents deviation), so use it when cross-checking against a hardware or software synth.

### A note on gagaku modes

The six gagaku chōshi (壱越調, 平調, 双調, 黄鐘調, 盤渉調, 太食調) all draw their notes from **one fixed gamut**: the twelve ritsu generated from Ichikotsu. Changing mode changes which scale degrees you use, not the tuning of the gamut. So for gagaku, use the default table for every mode and read off the notes you need. Passing a different `root_key` regenerates the sanbun-soneki chain from that note, which shifts some pitches by a Pythagorean comma (≈23.5 cents) away from the traditional ritsu — useful for synth work or non-gagaku material, but it is not how the chōshi are derived.

### Playing a just-intonation synth with gagaku

The safe default is to give the synth the **sanbun-soneki gamut itself** (the default table) as a microtuning: every note of every chōshi then matches the ensemble exactly, at the cost of Pythagorean thirds. Just intonation is the **conditional alternative** — use it when you want pure thirds on the synth and are willing to manage the conditions below.

It works without a custom microtuning, because JI's unison, major second, fourth, and fifth are the *same* 3-limit ratios as sanbun-soneki. Pick the JI root per chōshi as below and the kyū–shō–chi backbone (and every fourth/fifth between synth and gagaku) lines up exactly with the ritsu:

> 🎐 **[調子の輪 — an interactive map of these deviations](https://claude.ai/code/artifact/b0e2bc05-4a64-48fc-9e61-896cf38d7ac5)** — every chōshi as a tone wheel (matched notes, comma gaps, beat rates), plus the chain-of-fifths staircase that shows why Sōjō breaks. In Japanese.

| Chōshi | Synth JI root | Matches the ritsu (≤2¢) | ~21.5¢ apart (the synth's pure 3rds/6ths) |
|---|---|---|---|
| 壱越調 Ichikotsu-chō (D) | **D** | D, E, A | F#, B |
| 平調 Hyōjō (E) | **E** | E, F#, A, B | C# |
| 双調 Sōjō (G) | **A** — not G! | G, A, B, D, E (all five) | — |
| 黄鐘調 Ōshiki-chō (A) | **A** | A, B, D, E | F# |
| 盤渉調 Banshiki-chō (B) | **B** (see below) | B, C#, E, F# | G# |
| 太食調 Taishiki-chō (E) | **E** | E, F#, B | G#, C# |

The notes in the last column are not errors to fix: they are the synth's pure thirds and sixths, a syntonic comma (21.5¢) away from the corresponding ritsu. Against the gagaku kyū or chi they sound *cleaner* than the ritsu themselves; they only beat (≈4–6 Hz) when the shō sustains the same degree and the synth doubles it at length — avoid that doubling in the arrangement and nothing clashes.

Two special cases:

- **Sōjō**: in the fixed gamut, G sits at the far end of the chain of fifths, so gagaku's own kyū–chi (G–D) is a comma-narrow fifth. Rooting JI at G puts three of the five tones ~20¢ off. Rooting at **A** instead matches all five tones within a schisma (2¢) *and* still gives a pure 5/4 G–B third — the best-behaved chōshi of all.
- **Banshiki-chō**: oshiki's default A4-anchor derives root B through the JI minor seventh (9/5), which lands the whole scale a syntonic comma low. Tune the synth's B to the ensemble's actual Banshiki (483.75 Hz at A = 430) instead.

In practice, measure the shō's Ōshiki (A) on the day — it drifts from 430 with age and temperature — and pass it as the reference frequency: `oshiki <root> <measured A> --just`.

## License

TBD
