import { describe, it, expect, vi } from "vitest"
import { useState } from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { PromptBox, SubmitButton } from "./index"

/**
 * Mirrors the real consumer in DemoShowcase/PromptBoxContent.tsx: the parent
 * owns the controlled `value` state and composes the compound subcomponents.
 */
function Harness({
  onSubmit,
  initialValue = "",
  withStatus = false,
  withHeader = false,
}: {
  onSubmit?: (value: string) => void
  initialValue?: string
  withStatus?: boolean
  withHeader?: boolean
}) {
  const [value, setValue] = useState(initialValue)
  return (
    <PromptBox value={value} onValueChange={setValue} onSubmit={onSubmit}>
      {withStatus && (
        <PromptBox.Status>
          <p>Working on 3 items...</p>
        </PromptBox.Status>
      )}
      <PromptBox.Box>
        {withHeader && (
          <PromptBox.Header>
            <span>Model: GPT-4</span>
          </PromptBox.Header>
        )}
        <PromptBox.TextArea placeholder="Ask anything..." />
        <PromptBox.Footer>
          <SubmitButton />
        </PromptBox.Footer>
      </PromptBox.Box>
    </PromptBox>
  )
}

describe("PromptBox", () => {
  it("renders the editable textbox and a send button", () => {
    render(<Harness />)
    expect(screen.getByRole("textbox")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Send message" }),
    ).toBeInTheDocument()
  })

  it("disables the send button when there is no content", () => {
    render(<Harness />)
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled()
  })

  it("enables the send button when there is content", () => {
    render(<Harness initialValue="Hello there" />)
    expect(
      screen.getByRole("button", { name: "Send message" }),
    ).toBeEnabled()
  })

  it("renders composed Header and Status content", () => {
    render(<Harness withHeader withStatus />)
    expect(screen.getByText("Model: GPT-4")).toBeInTheDocument()
    expect(screen.getByText("Working on 3 items...")).toBeInTheDocument()
  })

  it("exposes the placeholder on the textbox", () => {
    render(<Harness />)
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-placeholder",
      "Ask anything...",
    )
  })

  it("updates content and enables the send button when typing", async () => {
    const user = userEvent.setup()
    render(<Harness />)

    const textbox = screen.getByRole("textbox")
    await user.click(textbox)
    await user.keyboard("Hi")

    expect(textbox).toHaveTextContent("Hi")
    expect(screen.getByRole("button", { name: "Send message" })).toBeEnabled()
  })

  it("calls onSubmit with the typed value when the send button is clicked", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Harness onSubmit={onSubmit} />)

    const textbox = screen.getByRole("textbox")
    await user.click(textbox)
    await user.keyboard("Ship it")

    await user.click(screen.getByRole("button", { name: "Send message" }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith("Ship it")
  })

  it("switches the button to a stop affordance after submitting", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Harness onSubmit={onSubmit} />)

    const textbox = screen.getByRole("textbox")
    await user.click(textbox)
    await user.keyboard("Generate")
    await user.click(screen.getByRole("button", { name: "Send message" }))

    expect(
      screen.getByRole("button", { name: "Stop generation" }),
    ).toBeInTheDocument()
  })

  it("submits when pressing Enter without Shift", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Harness onSubmit={onSubmit} />)

    const textbox = screen.getByRole("textbox")
    await user.click(textbox)
    await user.keyboard("Send via enter")
    await user.keyboard("{Enter}")

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith("Send via enter")
  })

  it("does not submit empty content when pressing Enter", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Harness onSubmit={onSubmit} />)

    const textbox = screen.getByRole("textbox")
    await user.click(textbox)
    await user.keyboard("{Enter}")

    expect(onSubmit).not.toHaveBeenCalled()
  })
})

describe("SubmitButton", () => {
  it("throws a helpful error when rendered outside a PromptBox provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<SubmitButton />)).toThrow(/inside <PromptBox>/)
    spy.mockRestore()
  })
})
