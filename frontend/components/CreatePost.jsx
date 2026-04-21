"use client";

import { useState } from "react";

export default function CreatePost() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);

    // 🔥 preview instantâneo
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  }

  return (
    <div>
      <h2>Criar Post</h2>

      <input type="file" onChange={handleImageChange} />

      {/* 👇 PREVIEW */}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ width: 200, marginTop: 10 }}
        />
      )}

      <button>Publicar</button>
    </div>
  );
}