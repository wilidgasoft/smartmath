# 10 - Accessibility & Child-Friendly Design

## 1. Accessibility Standards

SmartMath targets **WCAG 2.1 Level AA** compliance, with additional child-specific considerations.

## 2. Visual Accessibility

### 2.1 Color Contrast

All text-on-background combinations must meet minimum contrast ratios:

| Element | Ratio Required | Our Implementation |
|---------|---------------|-------------------|
| Normal text (body) | 4.5:1 | White (#F8FAFC) on dark (#0F172A) = 15.7:1 ✓ |
| Large text (headings) | 3:1 | Gold (#FBBF24) on dark (#0F172A) = 9.2:1 ✓ |
| Interactive elements | 3:1 | Blue (#3B82F6) on dark (#1E293B) = 4.8:1 ✓ |
| Correct feedback | 3:1 | Green (#10B981) on dark = 6.1:1 ✓ |
| Wrong feedback | 3:1 | Amber (#F59E0B) on dark = 8.7:1 ✓ |

### 2.2 Color-Independent Information

Never rely on color alone to convey information:
- Correct answers: Green color + checkmark icon + "Correct!" text
- Wrong answers: Amber color + X icon + shows correct answer
- Locked levels: Gray color + lock icon + "Locked" tooltip
- Stars: Filled vs outlined shape (not just color difference)

### 2.3 Motion & Animation

```css
/* Respect user's reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

For users with `prefers-reduced-motion`:
- Disable parallax star scrolling (show static stars)
- Disable spaceship wobble
- Use instant transitions instead of animated
- Keep essential feedback (correct/wrong) as brief color flash only
- Disable confetti/particles

## 3. Motor Accessibility

### 3.1 Touch Targets

Following Apple HIG and Material Design guidelines for children:

| Element | Minimum Size | Recommended Size |
|---------|-------------|-----------------|
| Primary buttons | 56×56px | 64×64px |
| Answer choices | 72×72px | 80×80px |
| Number pad keys | 56×56px | 64×64px |
| Navigation icons | 44×44px | 48×48px |
| Planet nodes | 48×48px | 56×56px |

### 3.2 Spacing Between Targets

Minimum 8px gap between interactive elements to prevent accidental taps.

### 3.3 No Time Pressure (Default)

- Timer is informational only — never forces a timeout
- Time bonus is optional (earned, not required)
- No "game over" from slow answers
- Children can take as long as they need per problem

## 4. Cognitive Accessibility

### 4.1 Simple Language

All UI text uses simple, clear language appropriate for a 5-year-old:
- Short sentences (max 10 words where possible)
- Common words (no jargon)
- Active voice
- Positive framing ("Try again!" not "Wrong answer")

### 4.2 Consistent Layout

- Game elements always appear in the same position
- Navigation is always at the top
- Actions are always at the bottom
- Problem display is always centered
- No surprise layout shifts

### 4.3 Clear Feedback

Every interaction provides immediate feedback:
- Button press → visual response (scale animation) + sound
- Correct answer → green flash + chime + ship advance + encouraging text
- Wrong answer → amber highlight + gentle sound + correct answer shown + encouraging text
- No ambiguous states

### 4.4 Forgiving Design

- Wrong answers don't remove progress
- Problems can be retried
- Levels can be replayed unlimited times
- Hints are available (visual learning aids)
- No permanent negative consequences

## 5. Screen Reader Support

### 5.1 ARIA Labels

```tsx
// Problem display
<div role="heading" aria-level={2} aria-label={`Problem: ${problem.displayText}`}>
  {problem.displayText} = ?
</div>

// Multiple choice buttons
<button
  role="option"
  aria-label={`Answer: ${choice}`}
  aria-selected={false}
>
  {choice}
</button>

// Progress bar
<div
  role="progressbar"
  aria-valuenow={currentProblem}
  aria-valuemin={0}
  aria-valuemax={totalProblems}
  aria-label={`Problem ${currentProblem} of ${totalProblems}`}
>
  ...
</div>

// Star rating
<div
  role="img"
  aria-label={`${stars} out of 4 stars`}
>
  ...
</div>

// Galaxy card (locked)
<div
  role="button"
  aria-disabled={true}
  aria-label={`${galaxyName} - Locked. Complete level 10 of ${previousGalaxy} to unlock.`}
>
  ...
</div>
```

### 5.2 Live Regions

```tsx
// Announce correct/wrong answers
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {feedback}  {/* "Correct! 5 + 3 = 8" or "The answer was 8" */}
</div>

// Announce streak milestones
<div aria-live="assertive" aria-atomic="true" className="sr-only">
  {streakAnnouncement}  {/* "Streak of 5! Turbo boost!" */}
</div>
```

### 5.3 Skip Links

```tsx
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

## 6. Keyboard Navigation

### 6.1 Game Play Shortcuts

| Key | Action |
|-----|--------|
| 1, 2, 3, 4 | Select answer choice (multiple choice mode) |
| 0-9 | Enter digits (numeric mode) |
| Enter | Submit answer (numeric mode) |
| Backspace | Delete last digit (numeric mode) |
| H | Use hint |
| Escape | Pause / open menu |
| Tab | Navigate between interactive elements |
| Space / Enter | Activate focused element |

### 6.2 Focus Management

- On level start: focus moves to problem display
- On answer feedback: focus stays on answer area
- On new problem: focus returns to first answer choice
- On level complete: focus moves to results
- On modal open: focus trapped within modal
- On modal close: focus returns to triggering element

## 7. Age-Appropriate Design by Group

### 7.1 Young (Ages 5-7)

- **Input:** Multiple choice only (4 large buttons)
- **Visuals:** Bright colors, large illustrations, animated characters
- **Text:** Minimal — use icons and visuals to guide
- **Sound:** Encouraging voice prompts (optional), happy sound effects
- **Speed:** No time pressure at all
- **Hints:** Always visible, visual counting aids
- **Rewards:** Frequent small rewards, lots of positive reinforcement
- **Numbers:** Results stay small (single/double digits)
- **Font size:** 20% larger than default

### 7.2 Medium (Ages 8-10)

- **Input:** Auto mode — starts with multiple choice, suggests numeric after 3 stars
- **Visuals:** Still colorful but slightly more refined
- **Text:** Short instructional text where helpful
- **Sound:** Effect sounds, optional voice
- **Speed:** Timer visible but no pressure, time bonus available
- **Hints:** Available but encourage trying first
- **Rewards:** Stars, badges, ship customization
- **Numbers:** Comfortable with double digits, some triple

### 7.3 Advanced (Ages 11-12)

- **Input:** Numeric keypad by default, can switch to MC
- **Visuals:** Sleeker design, more space-realistic
- **Text:** Stats and detailed feedback available
- **Sound:** Subtle effects, music
- **Speed:** Time challenges available, competitive elements
- **Hints:** Available but fewer per level (2 instead of 3)
- **Rewards:** Detailed stats, rank progression, challenge modes
- **Numbers:** Comfortable with triple-digit products and dividends

## 8. Error Prevention

- Confirm before quitting mid-level ("Are you sure?")
- No accidental account deletion (requires parent email confirmation)
- Auto-save progress locally (never lose data)
- Graceful handling of browser back button mid-game
- Prevent double-submission of answers (disable buttons during feedback)

## 9. Performance for Low-End Devices

Many children use older devices. Ensure performance on:
- 2GB RAM devices
- Older iPads (iPad 5th gen+)
- Budget Android tablets
- Slow networks (3G)

Strategies:
- Lazy-load Canvas/animation components
- Use WebP images with fallbacks
- Keep JavaScript bundle under 200KB gzipped
- Service worker caching for repeat visits
- Reduce particle counts on low-power devices (detect via `navigator.hardwareConcurrency`)

## 10. Content Safety

- No user-generated content (no text input beyond name)
- No social features or communication between users
- No external links accessible to children
- No advertising or in-app purchases
- Fun facts are pre-curated and educational
- Parent email required for account (COPPA alignment)
- All content is age-appropriate and educational
