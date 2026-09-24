/**
 * Utilitário para resolver o caminho de assets estáticos (imagens, vídeos, favicons)
 * com suporte transparente a GitHub Pages (basePath /antigravity.comixFlix),
 * Vercel e ambiente local de desenvolvimento.
 */
export function getAssetPath(path: string): string {
  if (!path) return "";
  
  // Se for URL externa completa (http/https), base64 ou blob, retorna diretamente
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }

  // basePath injetado em build time ou runtime para GitHub Pages
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${basePath}${cleanPath}`;
}
