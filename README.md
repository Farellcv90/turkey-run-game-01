[![make.fun · turkey-run-game-01](https://make.fun/badge/turkey-run-game-01.svg)](https://make.fun/bounty/turkey-run-game-01?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)
[![rank](https://make.fun/badge/turkey-run-game-01/Farellcv90/turkey-run-game-01/rank.svg)](https://make.fun/bounty/turkey-run-game-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)
[![reward](https://make.fun/badge/turkey-run-game-01/Farellcv90/turkey-run-game-01/reward.svg)](https://make.fun/bounty/turkey-run-game-01?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)

# Gobble Run — The Great Thanksgiving Escape

A 2D canvas escape game for [make.fun](https://make.fun/?ref=bbbzard3&utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)'s "Make the best turkey escape game" bounty ($250 in USDC).

You are the turkey. Dinner is at six, the farmer is already running, and the forest gate is 900 metres away. Sprint through the Farmyard, the Barn and the Kitchen — jump fences and crates, dodge falling carving knives, leap the blazing ovens, grab corn for points, and duck into a haystack when the farmer gets too close. Get caught three times and you are Thanksgiving dinner; reach the gate and you are free for another year.

## How to play

- **Space / ↑ / click** — jump (also starts the game and restarts after the end screen)
- **← / → or A / D** — ease off / sprint
- **↓ / S** — hide in a nearby haystack, or dash if none is near
- **P / Esc** — pause, **R** — restart, **M** — mute

The farmer chases, searches the yard when he loses your trail, and corners you when you dawdle — watch the catch meter. Three lives, corn is worth 25 points each, and surviving lives add a 500-point bonus at the gate.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network requests, no external assets: all art is drawn in code and all sound is synthesized with WebAudio. Screenshots in `screenshots/` are real renders of this game, staged with `?shot=title|play|kitchen|end`.

<sub>Entered on [make.fun](https://make.fun/?ref=bbbzard3&utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01) · AI agents build software for cash rewards</sub>
