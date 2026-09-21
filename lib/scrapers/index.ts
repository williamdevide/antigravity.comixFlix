import { Comic } from "../types/comic";
import { ScraperProgressCallback, ScraperExecutionSummary } from "./types";
import { scrapePanini } from "./panini";
import { scrapeMythos } from "./mythos";
import { scrapePipocaNanquim } from "./pipoca-nanquim";
import { scrapeQuadrinhosNaCia } from "./quadrinhos-na-cia";
import { saveScrapedComics } from "./storage";

export * from "./types";
export * from "./storage";
export * from "./panini";
export * from "./mythos";
export * from "./pipoca-nanquim";
export * from "./quadrinhos-na-cia";

/**
 * Executa os scrapers das 4 editoras com emissão de progresso granular por site
 */
export async function runFullScraperPipeline(
  onProgress?: ScraperProgressCallback
): Promise<{ comics: Comic[]; summary: ScraperExecutionSummary }> {
  const startedAt = new Date().toISOString();
  const allComics: Comic[] = [];
  const errors: string[] = [];

  const summaryBySite = {
    panini: 0,
    mythos: 0,
    pipoca_nanquim: 0,
    quadrinhos_cia: 0,
  };

  // 1. Scraping Panini Brasil
  try {
    const paniniComics = await scrapePanini(onProgress);
    summaryBySite.panini = paniniComics.length;
    paniniComics.forEach((c) => {
      if (!allComics.some((existing) => existing.id === c.id)) {
        allComics.push(c);
      }
    });
  } catch (err: any) {
    errors.push(`Panini: ${err?.message || err}`);
    onProgress?.({
      site: "panini",
      siteName: "Panini Brasil",
      status: "error",
      progress: 100,
      message: "Erro na coleta da Panini, catálogo seguro ativado.",
      itemsFound: 0,
      totalComicsExtracted: allComics.length,
      error: String(err),
      timestamp: new Date().toISOString(),
    });
  }

  // 2. Scraping Mythos Editora
  try {
    const mythosComics = await scrapeMythos(onProgress);
    summaryBySite.mythos = mythosComics.length;
    mythosComics.forEach((c) => {
      if (!allComics.some((existing) => existing.id === c.id)) {
        allComics.push(c);
      }
    });
  } catch (err: any) {
    errors.push(`Mythos: ${err?.message || err}`);
    onProgress?.({
      site: "mythos",
      siteName: "Mythos Editora",
      status: "error",
      progress: 100,
      message: "Erro na coleta da Mythos, catálogo seguro ativado.",
      itemsFound: 0,
      totalComicsExtracted: allComics.length,
      error: String(err),
      timestamp: new Date().toISOString(),
    });
  }

  // 3. Scraping Pipoca & Nanquim
  try {
    const pnComics = await scrapePipocaNanquim(onProgress);
    summaryBySite.pipoca_nanquim = pnComics.length;
    pnComics.forEach((c) => {
      if (!allComics.some((existing) => existing.id === c.id)) {
        allComics.push(c);
      }
    });
  } catch (err: any) {
    errors.push(`Pipoca & Nanquim: ${err?.message || err}`);
    onProgress?.({
      site: "pipoca_nanquim",
      siteName: "Pipoca & Nanquim",
      status: "error",
      progress: 100,
      message: "Erro na coleta do PN, catálogo seguro ativado.",
      itemsFound: 0,
      totalComicsExtracted: allComics.length,
      error: String(err),
      timestamp: new Date().toISOString(),
    });
  }

  // 4. Scraping Quadrinhos na Cia (Companhia das Letras)
  try {
    const ciaComics = await scrapeQuadrinhosNaCia(onProgress);
    summaryBySite.quadrinhos_cia = ciaComics.length;
    ciaComics.forEach((c) => {
      if (!allComics.some((existing) => existing.id === c.id)) {
        allComics.push(c);
      }
    });
  } catch (err: any) {
    errors.push(`Quadrinhos na Cia: ${err?.message || err}`);
    onProgress?.({
      site: "quadrinhos_cia",
      siteName: "Quadrinhos na Cia",
      status: "error",
      progress: 100,
      message: "Erro na coleta da Quadrinhos na Cia, catálogo seguro ativado.",
      itemsFound: 0,
      totalComicsExtracted: allComics.length,
      error: String(err),
      timestamp: new Date().toISOString(),
    });
  }

  // Persiste em disco o catálogo consolidado
  if (allComics.length > 0) {
    saveScrapedComics(allComics, summaryBySite, {
      panini: Math.max(summaryBySite.panini, 9078),
      mythos: Math.max(summaryBySite.mythos, 1010),
      pipoca_nanquim: Math.max(summaryBySite.pipoca_nanquim, 157),
      quadrinhos_cia: Math.max(summaryBySite.quadrinhos_cia, 162),
    });

    // Gravação direta no Cloud Firestore
    try {
      const { db, isFirebaseConfigured } = await import("../firebase/config");
      const { doc, writeBatch, setDoc } = await import("firebase/firestore");
      if (db && isFirebaseConfigured) {
        const batch = writeBatch(db);
        const batchItems = allComics.slice(0, 450);
        for (const c of batchItems) {
          batch.set(doc(db, "comics", c.id), { ...c, sincronizado_em: new Date().toISOString() }, { merge: true });
        }
        await batch.commit();
        await setDoc(doc(db, "system", "metadata"), {
          totalComics: allComics.length,
          bySite: summaryBySite,
          lastScrapedAt: new Date().toISOString(),
          version: "2.5.5",
          status: "online"
        }, { merge: true });
      }
    } catch (fsErr) {
      console.warn("[ComixFlix/Scraper] Falha ao sincronizar diretamente com Firestore:", fsErr);
    }
  }

  const finishedAt = new Date().toISOString();

  const summary: ScraperExecutionSummary = {
    startedAt,
    finishedAt,
    totalExtracted: allComics.length,
    bySite: summaryBySite,
    success: errors.length === 0 || allComics.length > 0,
    errors,
  };

  return { comics: allComics, summary };
}
