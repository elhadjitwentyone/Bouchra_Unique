// Écrit les modifications de l'admin directement dans le dépôt GitHub (data/content.json,
// public/uploads/*). Chaque sauvegarde crée un commit ; Vercel redéploie automatiquement.
// Nécessite les variables d'environnement : GITHUB_TOKEN (PAT avec accès "Contents: write"
// sur le dépôt) et GITHUB_REPO ("owner/repo"). GITHUB_BRANCH est optionnel (défaut "main").

const API = "https://api.github.com";

function repoInfo() {
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!repo || !token) throw new Error("GITHUB_TOKEN / GITHUB_REPO non configurés sur Vercel.");
  return { repo, token, branch };
}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
}

export async function readRepoFile(path: string): Promise<{ content: string; sha: string | null }> {
  const { repo, token, branch } = repoInfo();
  const res = await fetch(`${API}/repos/${repo}/contents/${path}?ref=${branch}`, {
    headers: headers(token), cache: "no-store",
  });
  if (res.status === 404) return { content: "", sha: null };
  if (!res.ok) throw new Error(`Lecture GitHub échouée (${res.status})`);
  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content, sha: data.sha };
}

export async function writeRepoFile(path: string, content: string, message: string, sha?: string | null) {
  const { repo, token, branch } = repoInfo();
  const res = await fetch(`${API}/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify({
      message, branch, content: Buffer.from(content, "utf-8").toString("base64"),
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) throw new Error(`Écriture GitHub échouée (${res.status}) : ${await res.text()}`);
  return res.json();
}

export async function readContentJson(): Promise<any> {
  const { content } = await readRepoFile("data/content.json");
  if (!content) throw new Error("data/content.json introuvable dans le dépôt.");
  return JSON.parse(content);
}

export async function writeContentJson(next: any, message: string) {
  const { sha } = await readRepoFile("data/content.json");
  return writeRepoFile("data/content.json", JSON.stringify(next, null, 2) + "\n", message, sha);
}

export async function uploadImage(filename: string, base64Data: string, message: string) {
  const path = `public/uploads/${filename}`;
  const { repo, token, branch } = repoInfo();
  const res = await fetch(`${API}/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify({ message, branch, content: base64Data }),
  });
  if (!res.ok) throw new Error(`Envoi de l'image échoué (${res.status}) : ${await res.text()}`);
  return `/uploads/${filename}`;
}

export function isConfigured() {
  return !!(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO);
}
