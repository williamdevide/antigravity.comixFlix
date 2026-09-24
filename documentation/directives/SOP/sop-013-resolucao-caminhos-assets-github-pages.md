# SOP-013: Resolução Universal de Caminhos de Assets Estáticos (GitHub Pages, Vercel e Local)

## 1. Contexto e Problema
Ao hospedar uma aplicação web Next.js no **GitHub Pages**, o site é servido sob um subdiretório baseado no nome do repositório (ex.: `https://williamdevide.github.io/antigravity.comixFlix/`).
Tags HTML convencionais (`<img>`, `<video>`, `<source>`) que apontam para caminhos absolutos na raiz (como `/branding/logo.jpg` ou `/cinematic_intro.mp4`) fazem com que o navegador tente carregar os arquivos a partir da raiz do domínio (`https://williamdevide.github.io/branding/logo.jpg`), gerando erros **404 (Not Found)** e impedindo a exibição de logotipos, imagens de fundo e vídeos na versão do GitHub Pages, mesmo funcionando perfeitamente em `localhost:3000` e na Vercel (onde a aplicação roda na raiz `/`).

---

## 2. Solução Arquitetural
Foi introduzido o utilitário universal `getAssetPath` em `lib/utils/asset.ts`:

```typescript
export function getAssetPath(path: string): string {
  if (!path) return "";
  
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${basePath}${cleanPath}`;
}
```

### 2.1. Comportamento por Ambiente
1. **GitHub Pages (Produção Estática):**
   - A variável `NEXT_PUBLIC_BASE_PATH="/antigravity.comixFlix"` é injetada durante o build no GitHub Actions (`.github/workflows/deploy-gh-pages.yml` e `scripts/build_gh_pages.js`).
   - `getAssetPath("/branding/logo.jpg")` resolve para `/antigravity.comixFlix/branding/logo.jpg`.
2. **Localhost & Vercel:**
   - `NEXT_PUBLIC_BASE_PATH` permanece vazio (`""`).
   - `getAssetPath("/branding/logo.jpg")` resolve diretamente para `/branding/logo.jpg`.

---

## 3. Componentes e Páginas Atualizados
- `components/ui/Logo.tsx`: Logo oficial ComixFlix.
- `components/layout/Footer.tsx`: Logo da desenvolvedora Milkfed Devs&&Reqs Lords.
- `components/auth/WelcomeScreen.tsx`: Fundo `splash.jpg`, vídeo `cinematic_intro.mp4`, poster e logos nas 5 etapas de onboarding/autenticação.
- `components/auth/AuthModal.tsx`: Logotipo do modal de autenticação.
- `components/auth/NetflixIntroOverlay.tsx`: Vídeo de transição `transition-netflix.mp4`.
- `app/sobre/page.tsx`: Logotipos ComixFlix e Milkfed na apresentação institucional.
- `app/termos/page.tsx` e `app/privacidade/page.tsx`: Logos de navegação e rodapé da desenvolvedora.
- `app/perfil/page.tsx`: Card de créditos da Milkfed no perfil do colecionador.
- `app/layout.tsx`: Links de metadados, manifest e favicons (`favicon.ico`, `icon-192.png`, `icon-512.png`).

---

## 4. Checklist de Validação
- [x] Tipagem estática validada via `npm run typecheck` (0 erros).
- [x] Build de produção validado via `npm run build` (código 0).
- [x] Sincronização via Git Commit e Push disparando workflow do GitHub Actions.
- [x] Acesso ao vivo via GitHub Pages sem erros 404 em assets de mídia.
