"use client";

import { useState, type ChangeEvent } from "react";
import { assetUrl, uploadFile } from "@/lib/api";

export default function ImageUpload({
  value,
  onChange,
}: {
  value?: string;
  onChange: (path: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const res = await uploadFile(file);
      onChange(res.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="uploader">
        <div className="preview">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={assetUrl(value)} alt="preview" />
          ) : (
            "🖼"
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label className="file-label btn-outline">
            {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
            <input type="file" accept="image/*" onChange={onFile} disabled={uploading} />
          </label>
          {value && (
            <button type="button" className="btn-outline" style={{ color: "var(--bad)" }} onClick={() => onChange("")}>
              Remove
            </button>
          )}
        </div>
      </div>
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}
