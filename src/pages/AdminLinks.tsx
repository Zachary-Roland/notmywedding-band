import { useState, useEffect, useRef, type FormEvent } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { db } from "../lib/firebase";
import { useLinks, type Link } from "../hooks/useLinks";
import { useSettings } from "../hooks/useSettings";

function SortableLink({
  link,
  onEdit,
  onDelete,
}: {
  link: Link;
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 border border-ink-faint rounded px-3 py-2"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-ink-muted hover:text-ink"
        aria-label="Drag to reorder"
      >
        ⠿
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-ink truncate">
          {link.label}
        </p>
        <p className="text-xs text-ink-muted truncate">{link.url}</p>
      </div>
      <button
        onClick={() => onEdit(link)}
        className="text-xs text-ink-muted hover:text-ink"
      >
        edit
      </button>
      <button
        onClick={() => onDelete(link.id)}
        className="text-xs text-red-600 hover:text-red-500"
      >
        delete
      </button>
    </div>
  );
}

export default function AdminLinks() {
  const { links } = useLinks();
  const { settings } = useSettings();
  const [editing, setEditing] = useState<Link | null>(null);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeEnabled, setYoutubeEnabled] = useState(false);
  const [visibleNavLinks, setVisibleNavLinks] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [settingsSaved, setSettingsSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setYoutubeUrl(settings.youtubeUrl);
    setYoutubeEnabled(settings.youtubeEnabled);
    setVisibleNavLinks(settings.visibleNavLinks);
  }, [settings.youtubeUrl, settings.youtubeEnabled, settings.visibleNavLinks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function startEdit(link: Link) {
    setEditing(link);
    setLabel(link.label);
    setUrl(link.url);
  }

  function resetForm() {
    setEditing(null);
    setLabel("");
    setUrl("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await updateDoc(doc(db, "links", editing.id), { label, url });
      } else {
        await addDoc(collection(db, "links"), {
          label,
          url,
          order: links.length,
          createdAt: serverTimestamp(),
        });
      }
      resetForm();
    } catch (err) {
      setError(`Failed to save link: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this link?")) return;
    setError("");
    try {
      await deleteDoc(doc(db, "links", id));
    } catch (err) {
      setError(`Failed to delete link: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);
    const reordered = arrayMove(links, oldIndex, newIndex);

    setError("");
    try {
      const batch = writeBatch(db);
      reordered.forEach((link, index) => {
        batch.update(doc(db, "links", link.id), { order: index });
      });
      await batch.commit();
    } catch (err) {
      setError(`Failed to reorder: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  }

  function toggleNavLink(key: string) {
    setVisibleNavLinks((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  async function handleSettingsSave() {
    setError("");
    try {
      await setDoc(doc(db, "settings", "home"), {
        youtubeUrl,
        youtubeEnabled,
        visibleNavLinks,
      });
      setSettingsSaved(true);
      clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setSettingsSaved(false), 2000);
    } catch (err) {
      setError(`Failed to save settings: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  }

  return (
    <div className="space-y-8">
      {error && (
        <div role="alert" className="border border-red-600 rounded px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}
      {/* Link Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <h2 className="text-sm font-bold text-ink-muted">
          {editing ? "edit link" : "add link"}
        </h2>
        <input
          type="text"
          placeholder="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
          className="w-full bg-transparent border border-ink-faint rounded px-3 py-2 text-sm text-ink focus:outline-none focus:border-ink"
        />
        <input
          type="url"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="w-full bg-transparent border border-ink-faint rounded px-3 py-2 text-sm text-ink focus:outline-none focus:border-ink"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="border border-ink text-ink px-4 py-1.5 rounded text-sm hover:bg-ink hover:text-cream transition-colors"
          >
            {editing ? "save" : "add"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="border border-ink-faint text-ink-muted px-4 py-1.5 rounded text-sm hover:text-ink transition-colors"
            >
              cancel
            </button>
          )}
        </div>
      </form>

      {/* Links List */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-ink-muted">
          links ({links.length})
        </h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={links.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            {links.map((link) => (
              <SortableLink
                key={link.id}
                link={link}
                onEdit={startEdit}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Homepage Settings */}
      <div className="space-y-4 border-t border-ink-faint pt-6">
        <h2 className="text-sm font-bold text-ink-muted">
          homepage settings
        </h2>

        {/* Nav links on homepage */}
        <div className="space-y-2">
          <p className="text-xs text-ink-muted">show on homepage (mobile):</p>
          {[
            { key: "/about", label: "about" },
            { key: "/shows", label: "shows" },
            { key: "/media", label: "media" },
            { key: "substack", label: "substack" },
            { key: "bandcamp", label: "bandcamp" },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer">
              <input
                type="checkbox"
                checked={visibleNavLinks.includes(item.key)}
                onChange={() => toggleNavLink(item.key)}
                className="accent-ink"
              />
              {item.label}
            </label>
          ))}
        </div>

        {/* YouTube embed */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer">
            <input
              type="checkbox"
              checked={youtubeEnabled}
              onChange={(e) => setYoutubeEnabled(e.target.checked)}
              className="accent-ink"
            />
            show youtube embed on home page
          </label>
          <input
            type="url"
            placeholder="YouTube URL"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="w-full bg-transparent border border-ink-faint rounded px-3 py-2 text-sm text-ink focus:outline-none focus:border-ink"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSettingsSave}
            className="border border-ink text-ink px-4 py-1.5 rounded text-sm hover:bg-ink hover:text-cream transition-colors"
          >
            save settings
          </button>
          {settingsSaved && (
            <span className="text-xs text-accent-sage">saved!</span>
          )}
        </div>
      </div>
    </div>
  );
}
