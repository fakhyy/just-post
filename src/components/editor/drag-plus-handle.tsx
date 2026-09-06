import { DragHandle } from '@tiptap/extension-drag-handle-react'
import type { Editor } from '@tiptap/react'
import { useState } from 'react'
import { GripVertical, Plus } from 'lucide-react'
import { Button } from '../ui/button'

/**
 * Notion-style "+ / ⠿" control that sits just left of whichever block
 * the cursor is currently hovering over.
 *
 * Install:
 *   npm install @tiptap/extension-drag-handle-react @tiptap/extension-drag-handle @tiptap/extension-node-range
 *
 * Usage:
 *   <EditorContent editor={editor} />
 *   <NotionDragHandle editor={editor} />
 *
 * (DragHandle renders into a tippy popup that's teleported to the right
 * spot automatically — it doesn't need to live inside the editor's DOM tree.)
 */
export function NotionDragHandle({ editor }: { editor: Editor }) {
  const [nodePos, setNodePos] = useState<number>(-1)

  const insertBelow = () => {
    if (nodePos === -1) return

    const node = editor.state.doc.nodeAt(nodePos)
    if (!node) return

    const insertPos = nodePos + node.nodeSize

    editor
      .chain()
      .insertContentAt(insertPos, { type: 'paragraph' })
      .focus(insertPos + 1)
      .run()
  }

  const selectNode = () => {
    if (nodePos === -1) return
    editor.chain().setNodeSelection(nodePos).run()
  }

  return (
    <DragHandle
      editor={editor}
      onNodeChange={({ pos }) => setNodePos(pos)}
      computePositionConfig={{ placement: 'left-start' }}
    >
      <div
        className="node-controls flex items-center mr-2"
        contentEditable={false}
      >
        <Button
          size="icon-xs"
          variant="ghost"
          className="node-control-btn"
          aria-label="Add block below"
          onClick={insertBelow}
        >
          <Plus size={16} strokeWidth={2} />
        </Button>
        <Button
          size="icon-xs"
          variant="ghost"
          className="node-control-btn node-control-drag cursor-grab"
          aria-label="Drag to reorder"
          onMouseDown={selectNode}
        >
          <GripVertical size={16} strokeWidth={2} />
        </Button>
      </div>
    </DragHandle>
  )
}
