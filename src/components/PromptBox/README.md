# PromptBox

LLM chat input component with a state machine, compound composition, and inline pill support.

## File Structure

```
index.ts          — public API, re-exports everything
context.ts        — state machine, context, usePromptBox hook, types
PromptBox.tsx     — root component + compound Object.assign
Box.tsx           — bordered container
Status.tsx        — optional slot above box
Header.tsx        — header slot
TextArea.tsx      — contentEditable input
Footer.tsx        — footer slot
SubmitButton.tsx  — submit button with derived states
```

## Composition Structure

```tsx
<PromptBox>                    // context provider + flex-col justify-end
  <PromptBox.Status />         // optional, above the box
  <PromptBox.Box>              // bordered container with focus ring
    <PromptBox.Header />       // optional, arbitrary content
    <PromptBox.TextArea>       // contentEditable + inline pills
      <Pill />                 // contentEditable={false} inline islands
    </PromptBox.TextArea>
    <PromptBox.Footer>         // flex, right-aligned
      <SubmitButton />         // auto-derives state from context
    </PromptBox.Footer>
  </PromptBox.Box>
</PromptBox>
```

## Usage Example

```tsx
import { useState } from "react"
import { PromptBox, SubmitButton } from "@/components/PromptBox"

function ChatInput() {
  const [value, setValue] = useState("")

  return (
    <PromptBox
      value={value}
      onValueChange={setValue}
      onSubmit={(text) => {
        console.log("Submitted:", text)
        setValue("")
      }}
    >
      {/* Status sits above the box, expands upward */}
      <PromptBox.Status>
        <p className="text-xs text-gray-500">Working on 3 items...</p>
      </PromptBox.Status>

      <PromptBox.Box>
        {/* Header is optional — add anything */}
        <PromptBox.Header>
          <span className="text-xs text-gray-400">Model: GPT-4</span>
        </PromptBox.Header>

        {/* Pills render inline with text as non-editable islands */}
        <PromptBox.TextArea placeholder="Ask anything...">
          <span contentEditable={false}
            className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs">
            report.csv
          </span>
        </PromptBox.TextArea>

        {/* Footer — SubmitButton auto-derives its state */}
        <PromptBox.Footer>
          <SubmitButton />
        </PromptBox.Footer>
      </PromptBox.Box>
    </PromptBox>
  )
}
```

## API Reference

### PromptBox (Root)

Outer wrapper. Provides context to all compound children. Uses `flex flex-col justify-end` so the component grows upward when fixed to the bottom of the viewport.

```tsx
<PromptBox
  value: string                          // controlled text value
  onValueChange: (value: string) => void // called on every keystroke
  onSubmit?: (value: string) => void     // called on Enter or button click
  className?: string
/>
```

### PromptBox.Status

Optional slot rendered above the bordered box. Accepts arbitrary `ReactNode`. Use for progress messages, system notifications, etc. Expands upward without shifting content below.

### PromptBox.Box

The bordered, rounded container for the input area. Wraps Header, TextArea, and Footer. Provides the visual card with focus ring.

### PromptBox.Header

Optional slot inside Box for arbitrary header content (model selector, labels, etc.). Accepts `ReactNode`.

### PromptBox.TextArea

ContentEditable div. Auto-expands up to ~6 lines (150px). Supports inline pills as children — wrap them with `contentEditable={false}` so they act as non-editable islands within the text flow.

```tsx
<PromptBox.TextArea
  placeholder?: string     // default: "Type a message…"
  className?: string
>
  {/* Inline pills (optional) */}
  <span contentEditable={false} className="...">pill</span>
</PromptBox.TextArea>
```

### PromptBox.Footer

Footer slot inside Box. Flex container aligned right. Typically holds SubmitButton, but accepts any `ReactNode`.

### SubmitButton

Standalone component that reads PromptBox context to derive its visual state automatically. No props required for basic use.

```tsx
<SubmitButton
  onStop?: () => void   // called when user clicks stop during submitting
  className?: string
/>

// Derived states:
//   disabled    — no text content
//   ready       — has content, shows arrow icon
//   submitting  — loading spinner (brief)
//   stop        — square icon, cancels submission
```

### usePromptBox()

Hook to access PromptBox context from custom compound children. Returns `state`, `send`, `value`, `onValueChange`, and `submit`.

## State Machine

The PromptBox uses a minimal state machine to enforce valid transitions. Starts in `idle` and auto-transitions to `composing` when text is entered.

```
idle ──CHANGE──▶ composing ──SUBMIT──▶ submitting
  ▲                  │                     │
  └───CLEAR──────────┘       SUCCESS / ERROR / CANCEL
                                    │
                                    ▼
                                  idle
```

### Events

| Event | Description |
|-------|-------------|
| `CHANGE` | Text entered (auto-sent by TextArea) |
| `CLEAR` | Text emptied (auto-sent by TextArea) |
| `SUBMIT` | User submits (Enter key or SubmitButton) |
| `SUCCESS` | Submission completed |
| `ERROR` | Submission failed (returns to composing) |
| `CANCEL` | User stopped generation |

Send events manually via `usePromptBox().send("SUCCESS")` to drive transitions from parent code (e.g., after an API call resolves).
