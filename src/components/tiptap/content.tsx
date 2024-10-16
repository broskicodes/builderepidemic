"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import Typography from "@tiptap/extension-typography";
import  Link  from "./custom-link";
import { all, createLowlight } from "lowlight";

import "@/components/tiptap/styles.css";
import { forwardRef, useImperativeHandle } from "react";

interface TiptapProps {
  content: string;
  editable: boolean;
}

export interface TiptapContentRef {
  getEditor: () => ReturnType<typeof useEditor> | null;
}

const lowlight = createLowlight(all);


const TiptapContent = forwardRef<TiptapContentRef, TiptapProps>(({ content, editable }, ref) => {
  const editor = useEditor({
    extensions: [
      Image,
      Typography,
      Link.configure({
        autolink: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'code-block',
        },
      }),
      Markdown.configure({
        tightLists: false,
      }),
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false,
      }),
    ],
    content: content,
    editable: editable,
  });

  useImperativeHandle(ref, () => ({
    getEditor: () => editor,
  }));

  return <EditorContent editor={editor} />;
});

TiptapContent.displayName = "TiptapContent";

export default TiptapContent;
