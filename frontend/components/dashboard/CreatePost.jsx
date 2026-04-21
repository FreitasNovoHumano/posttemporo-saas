"use client";

import { useState } from "react";

export default function CreatePost() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);

    /**
     * 🔥 PREVIEW LOCAL
     */
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  return (
    <div className="space-y-4">
      <input type="file" onChange={handleImageChange} />

      {preview && (
        <img
          src={preview}
          className="w-full max-w-xs rounded-lg shadow"
        />
      )}
    </div>
  );
}