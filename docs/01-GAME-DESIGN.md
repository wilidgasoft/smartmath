# 01 - Game Design Document

## 1. Game Concept

**SmartMath: Space Voyage** is a sequential math mastery game. The player is an astronaut-in-training who must demonstrate math fluency to earn fuel for their spaceship. Each correct answer adds fuel, propelling the ship toward the next cosmic destination. Wrong answers don't add fuel, but the player can retry.

The game is **not punitive** — it encourages persistence and celebrates progress.

## 2. The Four Operations

### 2.1 Addition (Galaxy 1: "The Solar System")

**Pattern:** For Level N, solve `N + M` where M goes from 1 to 20.

| Level | Problems | Example Sequence |
|-------|----------|------------------|
| 1 | 1+1, 1+2, 1+3 ... 1+20 | 1+1=2, 1+2=3 ... 1+20=21 |
| 2 | 2+1, 2+2, 2+3 ... 2+20 | 2+1=3, 2+2=4 ... 2+20=22 |
| 5 | 5+1, 5+2, 5+3 ... 5+20 | 5+1=6, 5+2=7 ... 5+20=25 |
| 10 | 10+1, 10+2 ... 10+20 | 10+1=11 ... 10+20=30 |
| 20 | 20+1, 20+2 ... 20+20 | 20+1=21 ... 20+20=40 |

**Total:** 20 levels × 20 problems = 400 addition problems.

### 2.2 Subtraction (Galaxy 2: "The Outer Reaches")

**Design Challenge:** We must avoid negative numbers for young children while maintaining a consistent 20-problem-per-level structure that teaches "subtracting N" fluency.

**Solution — "Subtracting N" Pattern:**

For Level N, the problems are `X - N` where X starts at N (so the smallest result is 0) and goes up, giving 20 problems.

| Level | Problems | Range | Results |
|-------|----------|-------|---------|
| 1 | 1-1, 2-1, 3-1 ... 20-1 | X: 1→20 | 0, 1, 2 ... 19 |
| 2 | 2-2, 3-2, 4-2 ... 21-2 | X: 2→21 | 0, 1, 2 ... 19 |
| 3 | 3-3, 4-3, 5-3 ... 22-3 | X: 3→22 | 0, 1, 2 ... 19 |
| 5 | 5-5, 6-5, 7-5 ... 24-5 | X: 5→24 | 0, 1, 2 ... 19 |
| 10 | 10-10, 11-10, 12-10 ... 29-10 | X: 10→29 | 0, 1, 2 ... 19 |
| 20 | 20-20, 21-20, 22-20 ... 39-20 | X: 20→39 | 0, 1, 2 ... 19 |

**Formula:** Level N → Problems: `(N+i) - N = i` where i goes from 0 to 19.

**Why this works for kids:**
- Results are always 0-19 (never negative)
- Every level starts easy (X - N = 0) and gets progressively larger
- Children learn to recognize patterns: "subtracting 5 from any number"
- The structure mirrors addition but in reverse
- Naturally reinforces the relationship: if 5+7=12, then 12-5=7

**Total:** 20 levels × 20 problems = 400 subtraction problems.

### 2.3 Multiplication (Galaxy 3: "The Stars")

**Pattern:** For Level N, solve `N × M` where M goes from 1 to 20.

| Level | Problems | Example Sequence |
|-------|----------|------------------|
| 1 | 1×1, 1×2, 1×3 ... 1×20 | 1,2,3...20 |
| 2 | 2×1, 2×2, 2×3 ... 2×20 | 2,4,6...40 |
| 5 | 5×1, 5×2, 5×3 ... 5×20 | 5,10,15...100 |
| 10 | 10×1, 10×2 ... 10×20 | 10,20,30...200 |
| 12 | 12×1, 12×2 ... 12×20 | 12,24,36...240 |
| 20 | 20×1, 20×2 ... 20×20 | 20,40,60...400 |

**Total:** 20 levels × 20 problems = 400 multiplication problems.

### 2.4 Division (Galaxy 4: "The Galaxies")

**Design Challenge:** Division must always produce whole numbers (no decimals for children).

**Solution — Inverse Multiplication Pattern:**

For Level N, the problems are `(N × M) ÷ N = M` where M goes from 1 to 20.

| Level | Problems | Example Sequence |
|-------|----------|------------------|
| 1 | 1÷1, 2÷1, 3÷1 ... 20÷1 | 1,2,3...20 |
| 2 | 2÷2, 4÷2, 6÷2 ... 40÷2 | 1,2,3...20 |
| 3 | 3÷3, 6÷3, 9÷3 ... 60÷3 | 1,2,3...20 |
| 5 | 5÷5, 10÷5, 15÷5 ... 100÷5 | 1,2,3...20 |
| 10 | 10÷10, 20÷10, 30÷10 ... 200÷10 | 1,2,3...20 |
| 20 | 20÷20, 40÷20, 60÷20 ... 400÷20 | 1,2,3...20 |

**Formula:** Level N → Problems: `(N × M) ÷ N = M` where M goes from 1 to 20.

**Why this works for kids:**
- Every answer is a whole number (1 through 20)
- Directly reinforces multiplication knowledge from Galaxy 3
- Children see the inverse relationship: if 5×4=20, then 20÷5=4
- Progressive: small divisors are simpler, large divisors require more recall

**Total:** 20 levels × 20 problems = 400 division problems.

## 3. Level Progression & Unlocking

```
┌─────────────────────────────────────────────────────┐
│                  GAME PROGRESSION                    │
│                                                      │
│  ADDITION        SUBTRACTION     MULTIPLICATION      │
│  Galaxy 1    →   Galaxy 2    →   Galaxy 3        →   │
│  Lv 1→20         Lv 1→20         Lv 1→20            │
│                                                      │
│                                      DIVISION        │
│                                  →   Galaxy 4        │
│                                      Lv 1→20         │
└─────────────────────────────────────────────────────┘
```

### Unlocking Rules

1. **Within a Galaxy:** Complete Level N to unlock Level N+1
2. **Between Galaxies:** Complete Level 10 of current galaxy to unlock the next galaxy
   - This means kids don't have to finish ALL 20 levels of addition before starting subtraction
   - But they must master at least the first 10 levels (tables 1-10)
   - Levels 11-20 of the previous galaxy remain available to complete
3. **Free Play Mode:** After completing Level 10, children can replay any completed level for practice

### Level Completion Requirements

- **Pass Threshold:** Answer at least **16 out of 20** problems correctly (80%)
- **Star Rating:**
  - ⭐ (1 star): 16-17 correct (80-85%)
  - ⭐⭐ (2 stars): 18-19 correct (90-95%)
  - ⭐⭐⭐ (3 stars): 20/20 correct (100%)
- **Time Bonus Star:** Complete the level under a time threshold for a bonus 4th star
  - Younger kids (5-7): 3 seconds per problem
  - Older kids (8-10): 2 seconds per problem
  - Advanced (11-12): 1.5 seconds per problem
- Failed levels can be immediately retried (no penalty)

## 4. Game Mechanics

### 4.1 The Spaceship

- The player's spaceship is visible at all times during a level
- A progress bar shows the journey from current location to destination planet
- Each correct answer moves the ship forward by 5% (20 problems × 5% = 100%)
- Wrong answers: ship stalls momentarily with a gentle shake animation (not punitive)
- The background scrolls with parallax stars, nebulae, and asteroids

### 4.2 Answer Input Modes

**Mode A: Multiple Choice (default for ages 5-7)**
- 4 answer options displayed as large, colorful buttons
- One correct answer, three plausible distractors
- Distractors are generated intelligently (close to correct answer, common mistakes)

**Mode B: Numeric Keypad (default for ages 8-12)**
- Large on-screen number pad
- Type the answer and press Enter/Submit
- Supports physical keyboard input on desktop

**Mode C: Hybrid (optional)**
- Start with multiple choice, auto-switch to keypad after achieving 3 stars on a level
- This mode can be enabled in settings

### 4.3 Streak System

- **Streak Counter:** Visible counter of consecutive correct answers
- **3 Correct Streak:** Ship gets a small speed boost animation
- **5 Correct Streak:** Ship enters "Turbo Mode" with enhanced visual effects
- **10 Correct Streak:** "SUPER NOVA!" celebration with special effects
- **20 Correct Streak (perfect level):** "LEGENDARY!" celebration + bonus reward

### 4.4 Hint System

- Each level starts with 3 hint tokens (shown as small rocket icons)
- Using a hint shows the problem broken down visually:
  - Addition: shows counting blocks
  - Subtraction: shows objects being removed
  - Multiplication: shows groups of items
  - Division: shows items being split into groups
- Using a hint means that problem doesn't count toward the perfect streak
- Hints refresh each level

### 4.5 Lives / Retry System

- **No lives system** — children should never feel punished
- Wrong answers simply don't advance the ship
- The correct answer is briefly shown after a wrong answer (learning moment)
- The same problem returns later in the level (spaced repetition within the level)
- Level can be retried unlimited times

## 5. Rewards & Motivation

### 5.1 Planet Collection

Each destination is a collectible. When a player reaches a planet:
- Animated landing sequence
- Fun fact about the celestial body (educational bonus, in selected language)
- Planet added to the player's "Space Album"
- Example: "You reached Mars! Did you know Mars has the tallest volcano in the solar system?"

### 5.2 Astronaut Rank

| Stars Earned | Rank |
|-------------|------|
| 0-20 | Cadet |
| 21-50 | Junior Astronaut |
| 51-100 | Astronaut |
| 101-160 | Senior Astronaut |
| 161-240 | Commander |
| 241-320 | Captain |

### 5.3 Ship Customization

Earned through star collection:
- **Ship Colors:** Unlock new color schemes (every 10 stars)
- **Ship Shapes:** Unlock new ship designs (every 20 stars)
- **Trail Effects:** Unlock different engine trail effects (every 30 stars)
- **Companion:** Unlock a space pet companion (robot, alien friend, space cat)

### 5.4 Achievement Badges

| Badge | Requirement |
|-------|-------------|
| First Flight | Complete first level |
| Speed Demon | Complete a level with time bonus |
| Perfect Launch | Get 20/20 on any level |
| Addition Master | Complete all 20 addition levels |
| Subtraction Hero | Complete all 20 subtraction levels |
| Multiplication Wizard | Complete all 20 multiplication levels |
| Division Champion | Complete all 20 division levels |
| Space Explorer | Collect all planets in a galaxy |
| Math Legend | Complete all 80 levels with 3 stars |
| Streak Star | Achieve a 50-problem streak |
| Persistent Pilot | Retry and pass a level after failing |
| Daily Explorer | Play 7 days in a row |

## 6. Session Flow

```
┌──────────┐    ┌──────────────┐    ┌──────────────┐
│  LOGIN   │───→│  GALAXY MAP  │───→│ LEVEL SELECT │
│  SCREEN  │    │  (overview)  │    │  (planets)   │
└──────────┘    └──────────────┘    └──────────────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │   LAUNCH!    │
                                    │  (countdown) │
                                    └──────────────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │  GAME PLAY   │←──┐
                                    │  (20 problems)│   │
                                    └──────────────┘   │
                                           │           │
                                           ▼           │
                                    ┌──────────────┐   │
                                    │   RESULTS    │   │
                                    │  (stars,xp)  │───┘ (retry)
                                    └──────────────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │  PLANET      │
                                    │  LANDING!    │
                                    │  (if passed) │
                                    └──────────────┘
```

## 7. Difficulty Adaptation

While the core game is sequential, subtle adaptations make it appropriate for different ages:

### For Younger Children (5-7):
- Larger UI elements and touch targets
- Multiple choice only
- Encouraging sound effects and voice prompts
- More time allowed per problem
- Visual counting aids available
- Simpler language in instructions

### For Older Children (8-12):
- Numeric keypad input
- Time challenges available
- Streak tracking and competitive elements
- More detailed statistics
- Challenge mode: random problems from completed levels

## 8. Practice / Review Mode

After completing at least one galaxy, children unlock **Mission Control** — a review mode that:
- Generates random problems from completed levels
- Focuses on problems the child got wrong most often (weak spots)
- Tracks improvement over time
- Does not affect main progression but awards bonus XP
