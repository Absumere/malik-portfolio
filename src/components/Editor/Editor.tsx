'use client';

import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Image from '@editorjs/image';
import Code from '@editorjs/code';
import Link from '@editorjs/link';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'portfolio');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();
  return {
    success: 1,
    file: {
      url: data.secure_url,
    },
  };
};

export default function Editor({ value, onChange, className = '' }: EditorProps) {
  const editorRef = useRef<EditorJS>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let editor: EditorJS;

    const initEditor = async () => {
      try {
        editor = new EditorJS({
          holder: containerRef.current,
          tools: {
            header: {
              class: Header,
              config: {
                levels: [1, 2, 3, 4, 5, 6],
                defaultLevel: 2,
              },
            },
            list: {
              class: List,
              inlineToolbar: true,
            },
            paragraph: {
              class: Paragraph,
              inlineToolbar: true,
            },
            image: {
              class: Image,
              config: {
                uploader: {
                  uploadByFile: uploadImage,
                },
              },
            },
            code: Code,
            link: {
              class: Link,
              config: {
                endpoint: 'http://localhost:3000/api/fetchUrl',
              },
            },
            quote: {
              class: Quote,
              inlineToolbar: true,
            },
            marker: Marker,
            inlineCode: InlineCode,
          },
          data: value ? JSON.parse(value) : undefined,
          onChange: async () => {
            const data = await editor.save();
            onChange(JSON.stringify(data));
          },
          placeholder: 'Start writing your content...',
        });

        await editor.isReady;
        editorRef.current = editor;
      } catch (error) {
        console.error('Editor.js initialization failed:', error);
      }
    };

    initEditor();

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        try {
          editorRef.current.destroy();
          editorRef.current = undefined;
        } catch (error) {
          console.error('Error destroying Editor.js instance:', error);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`editor-js ${className} prose prose-invert max-w-none`}
    />
  );
}
