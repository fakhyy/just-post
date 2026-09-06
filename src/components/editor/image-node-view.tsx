import { NodeViewWrapper } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import { useCallback, useEffect, useRef, useState } from 'react'

const MIN_WIDTH = 80
const MAX_WIDTH = 2000

export function ImageNodeView({
  node,
  updateAttributes,
  selected,
}: NodeViewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLElement>(null)

  const [isResizing, setIsResizing] = useState(false)

  const { src, alt, title, width, height, caption, align } = node.attrs

  const hasCaption = caption !== null

  /*
   * Sync caption from Tiptap only when the
   * element is not currently being edited.
   *
   * This prevents React/Tiptap from resetting
   * the caret after every keystroke.
   */
  useEffect(() => {
    const element = captionRef.current

    if (!element) return

    if (document.activeElement === element) {
      return
    }

    const value = caption ?? ''

    if (element.textContent !== value) {
      element.textContent = value
    }
  }, [caption])

  const getMaxWidth = useCallback(() => {
    const wrapper = wrapperRef.current

    if (!wrapper?.parentElement) {
      return MAX_WIDTH
    }

    return Math.min(wrapper.parentElement.clientWidth, MAX_WIDTH)
  }, [])

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()

      const wrapper = wrapperRef.current

      if (!wrapper) return

      const image = wrapper.querySelector('img')

      if (!image) return

      if (!image.naturalWidth || !image.naturalHeight) {
        return
      }

      const startX = event.clientX

      const startWidth = image.getBoundingClientRect().width

      const aspectRatio = image.naturalWidth / image.naturalHeight

      const maxWidth = getMaxWidth()

      setIsResizing(true)

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const delta = moveEvent.clientX - startX

        const newWidth = Math.min(
          maxWidth,
          Math.max(MIN_WIDTH, Math.round(startWidth + delta)),
        )

        const newHeight = Math.round(newWidth / aspectRatio)

        updateAttributes({
          width: newWidth,
          height: newHeight,
        })
      }

      const handlePointerUp = () => {
        setIsResizing(false)

        window.removeEventListener('pointermove', handlePointerMove)

        window.removeEventListener('pointerup', handlePointerUp)
      }

      window.addEventListener('pointermove', handlePointerMove)

      window.addEventListener('pointerup', handlePointerUp)
    },
    [getMaxWidth, updateAttributes],
  )

  const handleCaptionBlur = useCallback(
    (event: React.FocusEvent<HTMLElement>) => {
      const value = event.currentTarget.textContent.trim()

      updateAttributes({
        caption: value || null,
      })
    },
    [updateAttributes],
  )

  const handleAddCaption = useCallback(() => {
    updateAttributes({
      caption: '',
    })

    /*
     * Wait for the NodeView to render the
     * figcaption, then focus it.
     */
    requestAnimationFrame(() => {
      captionRef.current?.focus()
    })
  }, [updateAttributes])

  const handleRemoveCaption = useCallback(() => {
    updateAttributes({
      caption: null,
    })
  }, [updateAttributes])

  const handleAlign = useCallback(
    (nextAlign: 'left' | 'center' | 'right') => {
      updateAttributes({
        align: nextAlign,
      })
    },
    [updateAttributes],
  )

  useEffect(() => {
    if (!isResizing) {
      return
    }

    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'se-resize'

    return () => {
      document.body.style.removeProperty('user-select')

      document.body.style.removeProperty('cursor')
    }
  }, [isResizing])

  const alignmentClass =
    align === 'left'
      ? 'justify-start'
      : align === 'right'
        ? 'justify-end'
        : 'justify-center'

  return (
    <NodeViewWrapper
      ref={wrapperRef}
      className={`flex w-full ${alignmentClass}`}
      data-align={align}
    >
      <figure
        className="relative m-0"
        style={{
          width: width ? `${width}px` : undefined,

          maxWidth: '100%',
        }}
      >
        <div className="relative">
          <img
            src={src}
            alt={alt ?? ''}
            title={title ?? undefined}
            width={width ?? undefined}
            height={height ?? undefined}
            draggable={false}
            className={[
              'block h-auto max-w-full rounded-md',
              selected && 'ring-2 ring-primary',
              isResizing && 'select-none',
            ]
              .filter(Boolean)
              .join(' ')}
          />

          {selected && (
            <div
              contentEditable={false}
              onPointerDown={handlePointerDown}
              className="
                absolute
                bottom-0
                right-0
                h-3
                w-3
                translate-x-1/2
                translate-y-1/2
                cursor-se-resize
                rounded-full
                border
                border-background
                bg-primary
              "
            />
          )}
        </div>

        {hasCaption && (
          <figcaption
            ref={captionRef}
            contentEditable
            suppressContentEditableWarning
            spellCheck
            dir="auto"
            data-placeholder="Add a caption…"
            onMouseDown={(event) => {
              event.stopPropagation()
            }}
            onClick={(event) => {
              event.stopPropagation()
            }}
            onKeyDown={(event) => {
              event.stopPropagation()

              if (event.key === 'Enter') {
                event.preventDefault()
                event.currentTarget.blur()
              }
            }}
            onBlur={handleCaptionBlur}
            className="
              mt-1.5
              min-h-5
              text-center
              text-sm
              text-muted-foreground
              outline-none
              empty:before:text-muted-foreground/50
              empty:before:content-[attr(data-placeholder)]
            "
          />
        )}

        {selected && !hasCaption && (
          <button
            type="button"
            contentEditable={false}
            onMouseDown={(event) => {
              event.preventDefault()
            }}
            onClick={handleAddCaption}
            className="
              mt-1.5
              block
              w-full
              text-center
              text-xs
              text-muted-foreground
              underline
              underline-offset-2
              hover:text-foreground
            "
          >
            Add caption
          </button>
        )}

        {selected && hasCaption && (
          <button
            type="button"
            contentEditable={false}
            onMouseDown={(event) => {
              event.preventDefault()
            }}
            onClick={handleRemoveCaption}
            className="
              mt-1
              block
              w-full
              text-center
              text-xs
              text-muted-foreground
              hover:text-foreground
            "
          >
            Remove caption
          </button>
        )}

        {selected && (
          <div
            contentEditable={false}
            className="
              mt-2
              flex
              items-center
              justify-center
              gap-1
              rounded-md
              border
              bg-background
              p-1
              shadow-sm
            "
          >
            <button
              type="button"
              onMouseDown={(event) => {
                event.preventDefault()
              }}
              onClick={() => handleAlign('left')}
              className={[
                'rounded px-2 py-1 text-xs',
                align === 'left' && 'bg-muted',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              Left
            </button>

            <button
              type="button"
              onMouseDown={(event) => {
                event.preventDefault()
              }}
              onClick={() => handleAlign('center')}
              className={[
                'rounded px-2 py-1 text-xs',
                align === 'center' && 'bg-muted',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              Center
            </button>

            <button
              type="button"
              onMouseDown={(event) => {
                event.preventDefault()
              }}
              onClick={() => handleAlign('right')}
              className={[
                'rounded px-2 py-1 text-xs',
                align === 'right' && 'bg-muted',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              Right
            </button>
          </div>
        )}
      </figure>
    </NodeViewWrapper>
  )
}
