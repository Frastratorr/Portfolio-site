
"use client";

import { useState } from "react";

export const PROJECT_CATEGORIES = [
  "Hard Surface",
  "Props",
  "Environment",
  "Sci-Fi",
  "Weapons",
  "Architecture",
];

const suggestedTags = [
  "Low Poly",
  "High Poly",
  "Game Ready",
  "PBR",
  "Realistic",
  "Stylized",
  "Modular",
  "Procedural",
  "UV Unwrapped",
  "Detailed",
  "AAA Quality",
  "Portfolio",
];

type Props = {
  category: string;
  tags: string[];
  onCategoryChange: (value: string) => void;
  onTagsChange: (value: string[]) => void;
};

export default function ProjectMetadataFields({
  category,
  tags,
  onCategoryChange,
  onTagsChange,
}: Props) {
  const [newTag, setNewTag] = useState("");

  const addTag = (value: string) => {
    const tag = value.trim();

    if (!tag) return;

    const alreadyExists = tags.some(
      (item) => item.toLowerCase() === tag.toLowerCase()
    );

    if (alreadyExists) {
      setNewTag("");
      return;
    }

    onTagsChange([...tags, tag]);
    setNewTag("");
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <section className="space-y-6 border-t border-neutral-200 dark:border-neutral-800 pt-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Project Category
        </label>

        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-blue-500"
        >
          {PROJECT_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Project Tags
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag(newTag);
              }
            }}
            placeholder="Enter a tag..."
            className="flex-1 min-w-0 p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="button"
            onClick={() => addTag(newTag)}
            className="px-5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
          >
            Add
          </button>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-sm"
              >
                {tag}

                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove ${tag}`}
                  className="font-bold hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="mt-5">
          <p className="text-xs text-neutral-500 mb-3">
            Suggested tags — click to add:
          </p>

          <div className="flex flex-wrap gap-2">
            {suggestedTags.map((tag) => {
              const selected = tags.some(
                (item) => item.toLowerCase() === tag.toLowerCase()
              );

              return (
                <button
                  key={tag}
                  type="button"
                  disabled={selected}
                  onClick={() => addTag(tag)}
                  className="px-3 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-xs hover:border-blue-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  + {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
