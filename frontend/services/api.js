const API_URL = "http://127.0.0.1:3001";

export async function createPost(data) {
  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function getPosts() {
  const res = await fetch(`${API_URL}/posts`);
  return res.json();
}