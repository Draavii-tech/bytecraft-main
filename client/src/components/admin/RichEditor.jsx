import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  FileCode,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Undo,
  Redo,
  Upload,
  Code2,
} from 'lucide-react';
import { uploadApi } from '../../api/client';

export const RichEditor = ({ value, onChange, placeholder = 'Write your technical article here...' }) => {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-rose-600 underline font-medium hover:text-rose-700',
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full my-6 mx-auto shadow-md',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'article-content min-h-[350px] focus:outline-none p-5 sm:p-6 bg-white rounded-b-xl max-w-none prose prose-slate',
      },
    },
  });

  // Sync external value changes when not in edit focus
  React.useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value && !editor.isFocused) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="min-h-[350px] bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
        Loading editor engine...
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL (e.g. https://example.com):', previousUrl || '');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImageUrl = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await uploadApi.uploadImage(file);
      if (res.success && res.url) {
        editor.chain().focus().setImage({ src: res.url, alt: file.name }).run();
      }
    } catch (err) {
      alert(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const insertTableSnippet = () => {
    const tableHtml = `
<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>Approach A</th>
      <th>Approach B</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Latency</strong></td>
      <td>Sub-millisecond</td>
      <td>5–10 ms</td>
    </tr>
    <tr>
      <td><strong>Throughput</strong></td>
      <td>High</td>
      <td>Standard</td>
    </tr>
  </tbody>
</table>
`;
    editor.chain().focus().insertContent(tableHtml).run();
  };

  return (
    <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-500 transition-all">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 text-slate-700">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-md hover:bg-slate-200 transition-colors ${
            editor.isActive('bold') ? 'bg-slate-200 text-rose-600 font-bold' : ''
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-md hover:bg-slate-200 transition-colors ${
            editor.isActive('italic') ? 'bg-slate-200 text-rose-600' : ''
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1.5 rounded-md hover:bg-slate-200 transition-colors ${
            editor.isActive('code') ? 'bg-slate-200 text-rose-600' : ''
          }`}
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded-md hover:bg-slate-200 transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-slate-200 text-rose-600 font-bold' : ''
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-md hover:bg-slate-200 transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 text-rose-600 font-bold' : ''
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-md hover:bg-slate-200 transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-slate-200 text-rose-600 font-bold' : ''
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-md hover:bg-slate-200 transition-colors ${
            editor.isActive('bulletList') ? 'bg-slate-200 text-rose-600' : ''
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-md hover:bg-slate-200 transition-colors ${
            editor.isActive('orderedList') ? 'bg-slate-200 text-rose-600' : ''
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-md hover:bg-slate-200 transition-colors ${
            editor.isActive('blockquote') ? 'bg-slate-200 text-rose-600' : ''
          }`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded-md hover:bg-slate-200 transition-colors ${
            editor.isActive('codeBlock') ? 'bg-slate-200 text-rose-600' : ''
          }`}
          title="Code Block"
        >
          <FileCode className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        {/* Links, Media & Tables */}
        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded-md hover:bg-slate-200 transition-colors ${
            editor.isActive('link') ? 'bg-slate-200 text-rose-600' : ''
          }`}
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={addImageUrl}
          className="p-1.5 rounded-md hover:bg-slate-200 transition-colors"
          title="Add Image via URL"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <label
          className={`p-1.5 rounded-md hover:bg-slate-200 transition-colors cursor-pointer flex items-center ${
            uploadingImage ? 'opacity-50 pointer-events-none' : ''
          }`}
          title="Upload Image (Auto-WebP Compression)"
        >
          <Upload className="w-4 h-4 text-rose-600" />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploadingImage}
          />
        </label>

        <button
          type="button"
          onClick={insertTableSnippet}
          className="p-1.5 rounded-md hover:bg-slate-200 transition-colors"
          title="Insert Comparison Table"
        >
          <TableIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-md hover:bg-slate-200 transition-colors disabled:opacity-40"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-md hover:bg-slate-200 transition-colors disabled:opacity-40"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>

        {/* Toggle HTML view */}
        <div className="ml-auto flex items-center">
          <button
            type="button"
            onClick={() => setIsHtmlMode((prev) => !prev)}
            className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors ${
              isHtmlMode ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{isHtmlMode ? 'Visual Mode' : 'HTML Source'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {isHtmlMode ? (
        <textarea
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            editor.commands.setContent(e.target.value);
          }}
          className="w-full min-h-[350px] p-4 font-mono text-xs text-slate-800 bg-slate-900 text-slate-100 focus:outline-none"
          placeholder="Enter raw HTML here..."
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
};

