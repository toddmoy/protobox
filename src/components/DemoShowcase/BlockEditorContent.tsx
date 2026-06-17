import { BlockEditor } from '@/components/BlockEditor'
import { createBlock } from '@/components/BlockEditor/types'

const initialBlocks = [
  createBlock('heading', 'Lightweight Block Editor', { level: 1 }),
  createBlock(
    'paragraph',
    "A minimal, Notion-style editor. Try the interactions below — type '/' anywhere to insert a block.",
  ),
  createBlock('heading', 'Try these', { level: 2 }),
  createBlock('list', 'Type / to open the block menu, then filter (try "h1" or "todo")'),
  createBlock('todo', 'Press Enter to add another item', { checked: false }),
  createBlock('todo', 'Backspace on an empty block merges into the one above', {
    checked: true,
  }),
  createBlock('quote', 'Enter in the middle of a line splits the block.'),
  createBlock('callout', 'Callouts are enclosed — icon & color styling come later.'),
  createBlock('paragraph', ''),
]

export default function BlockEditorContent() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1 text-lg font-semibold text-gray-900">Block Editor</h2>
        <p className="text-sm text-gray-500">
          A lightweight, minimally-styled block editor. One contentEditable per
          block, plain-text content, slash command to add blocks, backspace to
          merge/remove, Enter to split/append. In-memory only.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <BlockEditor initialBlocks={initialBlocks} className="mx-auto max-w-2xl" />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900">Behaviors</h3>
        <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
          <li>
            <code className="rounded bg-gray-100 px-1">/</code> — open the block
            menu anywhere; arrow keys + Enter to select, Esc to dismiss.
          </li>
          <li>
            <code className="rounded bg-gray-100 px-1">Enter</code> — splits at
            the caret; continues lists/to-dos; empty list item exits to a
            paragraph.
          </li>
          <li>
            <code className="rounded bg-gray-100 px-1">Backspace</code> at the
            start — merges into the previous block; deletes empty blocks; never
            removes the last block.
          </li>
        </ul>
      </div>
    </div>
  )
}
