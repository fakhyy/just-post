import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

import { ImageNodeView } from './image-node-view'

export type ImageAlign = 'left' | 'center' | 'right'

export interface CustomImageAttributes {
  src: string | null
  alt: string | null
  title: string | null
  width: number | null
  height: number | null
  caption: string | null
  align: ImageAlign
}

declare module '@tiptap/core' {
  interface Commands<TReturn> {
    customImage: {
      setCustomImage: (
        attributes: Partial<CustomImageAttributes> & {
          src: string
        },
      ) => TReturn

      setImageAlign: (align: ImageAlign) => TReturn

      setImageCaption: (caption: string | null) => TReturn
    }
  }
}

export const CustomImage = Node.create({
  name: 'customImage',

  group: 'block',

  atom: true,

  draggable: true,

  selectable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },

      alt: {
        default: null,
      },

      title: {
        default: null,
      },

      width: {
        default: null,

        parseHTML: (element) => {
          const value = element.querySelector('img')?.getAttribute('width')

          if (!value) return null

          const width = Number.parseInt(value, 10)

          return Number.isFinite(width) ? width : null
        },

        renderHTML: (attributes) => {
          if (!attributes.width) return {}

          return {
            width: attributes.width,
          }
        },
      },

      height: {
        default: null,

        parseHTML: (element) => {
          const value = element.querySelector('img')?.getAttribute('height')

          if (!value) return null

          const height = Number.parseInt(value, 10)

          return Number.isFinite(height) ? height : null
        },

        renderHTML: (attributes) => {
          if (!attributes.height) return {}

          return {
            height: attributes.height,
          }
        },
      },

      caption: {
        default: null,

        parseHTML: (element) => {
          const caption = element.querySelector('figcaption')

          return caption?.textContent || null
        },

        renderHTML: () => ({}),
      },

      align: {
        default: 'center',

        parseHTML: (element) => {
          const align = element.getAttribute('data-align')

          if (align === 'left' || align === 'center' || align === 'right') {
            return align
          }

          return 'center'
        },

        renderHTML: (attributes) => ({
          'data-align': attributes.align,
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-type="custom-image"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { src, alt, title, width, height, caption, align } = HTMLAttributes

    const imageAttributes = mergeAttributes({
      src,
      alt,
      title,
      ...(width ? { width } : {}),
      ...(height ? { height } : {}),
    })

    const image = ['img', imageAttributes]

    const figureAttributes = {
      'data-type': 'custom-image',
      'data-align': align ?? 'center',
    }

    if (caption) {
      return ['figure', figureAttributes, image, ['figcaption', {}, caption]]
    }

    return ['figure', figureAttributes, image]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView)
  },

  addCommands() {
    return {
      setCustomImage:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              src: attributes.src,
              alt: attributes.alt ?? null,
              title: attributes.title ?? null,
              width: attributes.width ?? null,
              height: attributes.height ?? null,
              caption: attributes.caption ?? null,
              align: attributes.align ?? 'center',
            },
          })
        },

      setImageAlign:
        (align) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { align })
        },

      setImageCaption:
        (caption) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { caption })
        },
    }
  },
})

export default CustomImage
