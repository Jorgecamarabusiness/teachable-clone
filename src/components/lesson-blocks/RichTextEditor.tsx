"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle, Color, FontFamily, FontSize } from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";

const FONT_FAMILIES = [
  { label: "Predeterminada", value: "" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
  { label: "Verdana", value: "Verdana, sans-serif" },
];

const FONT_SIZES = [
  { label: "Predeterminado", value: "" },
  { label: "12", value: "12px" },
  { label: "14", value: "14px" },
  { label: "16", value: "16px" },
  { label: "18", value: "18px" },
  { label: "20", value: "20px" },
  { label: "24", value: "24px" },
  { label: "28", value: "28px" },
  { label: "32", value: "32px" },
];

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-8 min-w-8 items-center justify-center rounded px-2 text-sm font-semibold transition-colors ${
        active
          ? "bg-foreground text-background"
          : "text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  onUploadImage,
}: {
  value: string;
  onChange: (html: string) => void;
  onUploadImage?: (file: File) => Promise<string | null>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextStyle,
      FontSize,
      Color,
      FontFamily,
      Image.configure({ inline: false }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[140px] overflow-hidden rounded-b-md break-words px-3 py-2 text-sm text-foreground outline-none [&_p]:my-1 [&_img]:my-2 [&_img]:max-w-full [&_img]:rounded-md [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const [, forceRerender] = useState(0);

  useEffect(() => {
    if (!editor) return;
    const rerender = () => forceRerender((n) => n + 1);
    editor.on("transaction", rerender);
    editor.on("selectionUpdate", rerender);
    return () => {
      editor.off("transaction", rerender);
      editor.off("selectionUpdate", rerender);
    };
  }, [editor]);

  if (!editor) return null;

  async function handleImageButtonClick() {
    fileInputRef.current?.click();
  }

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !onUploadImage) return;

    setIsUploadingImage(true);
    setUploadError(null);

    const url = await onUploadImage(file);

    setIsUploadingImage(false);

    if (!url) {
      setUploadError("No se pudo subir la imagen.");
      return;
    }

    editor?.chain().focus().setImage({ src: url }).run();
  }

  return (
    <div className="rounded-md border border-border">
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-1">
        <ToolbarButton
          label="Negrita"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          label="Cursiva"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <span className="italic">I</span>
        </ToolbarButton>
        <ToolbarButton
          label="Subrayado"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <span className="underline">U</span>
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" />

        <select
          aria-label="Fuente"
          className="h-8 rounded border border-border bg-background px-1 text-xs"
          value={editor.getAttributes("textStyle").fontFamily ?? ""}
          onChange={(event) => {
            const family = event.target.value;
            if (family) {
              editor.chain().focus().setFontFamily(family).run();
            } else {
              editor.chain().focus().unsetFontFamily().run();
            }
          }}
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>

        <select
          aria-label="Tamaño de fuente"
          className="h-8 rounded border border-border bg-background px-1 text-xs"
          value={editor.getAttributes("textStyle").fontSize ?? ""}
          onChange={(event) => {
            const size = event.target.value;
            if (size) {
              editor.chain().focus().setFontSize(size).run();
            } else {
              editor.chain().focus().unsetFontSize().run();
            }
          }}
        >
          {FONT_SIZES.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>

        <input
          type="color"
          aria-label="Color de texto"
          title="Color de texto"
          className="h-8 w-8 cursor-pointer rounded border border-border bg-background p-1"
          value={editor.getAttributes("textStyle").color ?? "#000000"}
          onChange={(event) =>
            editor.chain().focus().setColor(event.target.value).run()
          }
        />

        {onUploadImage ? (
          <>
            <span className="mx-1 h-5 w-px bg-border" />
            <ToolbarButton
              label="Insertar imagen"
              onClick={handleImageButtonClick}
            >
              {isUploadingImage ? "..." : "🖼"}
            </ToolbarButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelected}
            />
          </>
        ) : null}
      </div>

      <EditorContent editor={editor} />

      {uploadError ? (
        <p className="border-t border-border px-3 py-2 text-xs font-medium text-muted-foreground">
          {uploadError}
        </p>
      ) : null}
    </div>
  );
}
