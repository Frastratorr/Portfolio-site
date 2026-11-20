
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SEOSettings = {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string[];
  siteUrl: string;
  defaultOgImage: string;
};

const initialSettings: SEOSettings = {
  siteTitle: "3D Artist Portfolio",
  siteDescription: "3D Artist Portfolio",
  siteKeywords: [],
  siteUrl: "",
  defaultOgImage: "",
};

export default function SEOSettingsPage() {
  const [settings, setSettings] = useState<SEOSettings>(initialSettings);
  const [keywordsInput, setKeywordsInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/settings", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load SEO settings");
        }

        const data = await response.json();

        if (data) {
          const loadedSettings: SEOSettings = {
            siteTitle: data.siteTitle ?? initialSettings.siteTitle,
            siteDescription:
              data.siteDescription ?? initialSettings.siteDescription,
            siteKeywords: Array.isArray(data.siteKeywords)
              ? data.siteKeywords
              : [],
            siteUrl: data.siteUrl ?? "",
            defaultOgImage: data.defaultOgImage ?? "",
          };

          setSettings(loadedSettings);
          setKeywordsInput(loadedSettings.siteKeywords.join(", "));
        }
      } catch (err) {
        console.error("SEO settings loading error:", err);
        setError("Failed to load settings. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const updateField = (
    field: keyof SEOSettings,
    value: string
  ) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    const keywords = keywordsInput
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...settings,
          siteKeywords: keywords,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setSettings({
        ...settings,
        siteKeywords: keywords,
      });

      setMessage("SEO settings saved successfully.");
    } catch (err) {
      console.error("SEO settings saving error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save SEO settings."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white p-8">
        Loading SEO settings...
      </main>
    );
  }

  const inputClass =
    "w-full mt-2 px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 outline-none focus:border-blue-500 transition-colors";

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">SEO Settings</h1>
            <p className="text-neutral-500 mt-2">
              Manage search engine and social sharing metadata
            </p>
          </div>

          <Link
            href="/admin"
            className="px-5 py-2 rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          <section className="p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h2 className="text-xl font-bold mb-6">
              General SEO
            </h2>

            <div className="space-y-5">
              <div>
                <label className="font-medium">Site Title</label>
                <input
                  type="text"
                  value={settings.siteTitle}
                  onChange={(event) =>
                    updateField("siteTitle", event.target.value)
                  }
                  className={inputClass}
                  maxLength={70}
                  required
                />
                <p className="text-xs text-neutral-500 mt-2">
                  Recommended: around 50–60 characters.
                </p>
              </div>

              <div>
                <label className="font-medium">Site Description</label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(event) =>
                    updateField("siteDescription", event.target.value)
                  }
                  className={inputClass}
                  rows={4}
                  maxLength={320}
                  required
                />
                <p className="text-xs text-neutral-500 mt-2">
                  Recommended: around 150–160 characters.
                </p>
              </div>

              <div>
                <label className="font-medium">Keywords</label>
                <input
                  type="text"
                  value={keywordsInput}
                  onChange={(event) =>
                    setKeywordsInput(event.target.value)
                  }
                  className={inputClass}
                  placeholder="3D Artist, Blender, 3D Modeling, Portfolio"
                />
                <p className="text-xs text-neutral-500 mt-2">
                  Separate keywords with commas.
                </p>
              </div>

              <div>
                <label className="font-medium">Site URL</label>
                <input
                  type="url"
                  value={settings.siteUrl}
                  onChange={(event) =>
                    updateField("siteUrl", event.target.value)
                  }
                  className={inputClass}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </section>

          <section className="p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h2 className="text-xl font-bold mb-6">
              Social Sharing
            </h2>

            <div>
              <label className="font-medium">
                Default Open Graph Image URL
              </label>
              <input
                type="url"
                value={settings.defaultOgImage}
                onChange={(event) =>
                  updateField("defaultOgImage", event.target.value)
                }
                className={inputClass}
                placeholder="https://example.com/og-image.jpg"
              />
              <p className="text-xs text-neutral-500 mt-2">
                Used when a page does not have its own social sharing image.
              </p>
            </div>
          </section>

          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save SEO Settings"}
            </button>

            <Link
              href="/admin"
              className="px-8 py-3 rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
