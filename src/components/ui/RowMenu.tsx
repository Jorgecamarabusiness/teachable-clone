"use client";

import Link from "next/link";
import { useState } from "react";

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h12M8 6V4.5A1.5 1.5 0 0 1 9.5 3h1A1.5 1.5 0 0 1 12 4.5V6m-6 0v10a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6M8.5 9.5v5m3-5v5"
      />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 3.5l3 3L7 16H4v-3L13.5 3.5z"
      />
    </svg>
  );
}

export function RowMenu({
  editHref,
  onEdit,
  editLabel = "Editar",
  onDelete,
  deleteLabel = "Eliminar",
  isDeleting,
}: {
  editHref?: string;
  onEdit?: () => void;
  editLabel?: string;
  onDelete: () => void;
  deleteLabel?: string;
  isDeleting: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-label="Más opciones"
        className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
      >
        ⋮
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-1 flex items-center gap-1 rounded-md border border-border bg-background p-1 shadow-sm">
            {editHref ? (
              <Link
                href={editHref}
                onClick={() => setIsOpen(false)}
                aria-label={editLabel}
                title={editLabel}
                className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <PencilIcon />
              </Link>
            ) : onEdit ? (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onEdit();
                }}
                aria-label={editLabel}
                title={editLabel}
                className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <PencilIcon />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onDelete();
              }}
              disabled={isDeleting}
              aria-label={deleteLabel}
              title={deleteLabel}
              className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-foreground hover:text-background disabled:opacity-50"
            >
              <TrashIcon />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
