'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {Markdown} from 'tiptap-markdown'
import Typography from '@tiptap/extension-typography'
import Link from '@tiptap/extension-link'

import '@/components/tiptap/styles.css'

interface TiptapProps {
  content: string,
  editable: boolean
}

const TiptapContent = ({ content, editable }: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      Markdown.configure({
        tightLists: false,
      }),
      Typography,
      Link,
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: content,
    editable: editable,

    onUpdate: ({ editor }) => {
      console.log(editor.getJSON())
    }
  })

  return <EditorContent editor={editor} />
}

export default TiptapContent
