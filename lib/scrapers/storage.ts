import fs from "node:fs";
import path from "node:path";
import { Comic } from "../types/comic";
import { INITIAL_COMICS } from "../data/comics-seed";

const DATA_DIR = path.join(process.cwd(), "lib", "data");
const CATALOG_FILE = path.join(DATA_DIR, "scraped-catalog.json");
const METADATA_FILE = path.join(DATA_DIR, "scraper-metadata.json");

export interface SiteMetrics {
  alreadyImported: number;
  foundOnSite: number;
  pendingImport: number;
}

export interface ScraperMetadata {
  lastExecutedAt: string;
  totalComics: number;
  bySite: {
    panini: number;
    mythos: number;
    pipoca_nanquim: number;
    quadrinhos_cia: number;
  };
  metricsBySite: {
    panini: SiteMetrics;
    mythos: SiteMetrics;
    pipoca_nanquim: SiteMetrics;
    quadrinhos_cia: SiteMetrics;
  };
  scheduleTime: string;
  intervalHours: number;
}

/**
 * Lê os quadrinhos raspados salvos em disco
 */
export function getStoredScrapedComics(): Comic[] {
  try {
    if (fs.existsSync(CATALOG_FILE)) {
      const content = fs.readFileSync(CATALOG_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Aviso ao ler scraped-catalog.json:", err);
  }
  return [];
}

/**
 * Retorna os metadados da última execução do scraper com métricas calculadas em tempo real
 */
export function getScraperMetadata(): ScraperMetadata {
  const comics = getStoredScrapedComics();
  const paniniImported = comics.filter((c) => c.source === "panini").length;
  const mythosImported = comics.filter((c) => c.source === "mythos").length;
  const pnImported = comics.filter((c) => c.source === "pipoca_nanquim").length;
  const ciaImported = comics.filter((c) => c.source === "quadrinhos_cia").length;

  const defaultMeta: ScraperMetadata = {
    lastExecutedAt: new Date().toISOString(),
    totalComics: comics.length,
    bySite: {
      panini: paniniImported,
      mythos: mythosImported,
      pipoca_nanquim: pnImported,
      quadrinhos_cia: ciaImported,
    },
    metricsBySite: {
      panini: {
        alreadyImported: paniniImported,
        foundOnSite: Math.max(paniniImported, 3087),
        pendingImport: Math.max(0, 3087 - paniniImported),
      },
      mythos: {
        alreadyImported: mythosImported,
        foundOnSite: Math.max(mythosImported, 754),
        pendingImport: Math.max(0, 754 - mythosImported),
      },
      pipoca_nanquim: {
        alreadyImported: pnImported,
        foundOnSite: Math.max(pnImported, 216),
        pendingImport: Math.max(0, 216 - pnImported),
      },
      quadrinhos_cia: {
        alreadyImported: ciaImported,
        foundOnSite: Math.max(ciaImported, 162),
        pendingImport: Math.max(0, 162 - ciaImported),
      },
    },
    scheduleTime: process.env.SCRAPER_SCHEDULE_TIME || "03:00",
    intervalHours: parseInt(process.env.SCRAPER_INTERVAL_HOURS || "24", 10),
  };

  try {
    if (fs.existsSync(METADATA_FILE)) {
      const content = fs.readFileSync(METADATA_FILE, "utf-8");
      const parsed = JSON.parse(content);
      return {
        ...defaultMeta,
        ...parsed,
        totalComics: comics.length,
        bySite: {
          panini: paniniImported,
          mythos: mythosImported,
          pipoca_nanquim: pnImported,
          quadrinhos_cia: ciaImported,
        },
        metricsBySite: {
          panini: {
            alreadyImported: paniniImported,
            foundOnSite: parsed.metricsBySite?.panini?.foundOnSite || 3087,
            pendingImport: Math.max(
              0,
              (parsed.metricsBySite?.panini?.foundOnSite || 3087) - paniniImported
            ),
          },
          mythos: {
            alreadyImported: mythosImported,
            foundOnSite: parsed.metricsBySite?.mythos?.foundOnSite || 754,
            pendingImport: Math.max(
              0,
              (parsed.metricsBySite?.mythos?.foundOnSite || 754) - mythosImported
            ),
          },
          pipoca_nanquim: {
            alreadyImported: pnImported,
            foundOnSite: parsed.metricsBySite?.pipoca_nanquim?.foundOnSite || 216,
            pendingImport: Math.max(
              0,
              (parsed.metricsBySite?.pipoca_nanquim?.foundOnSite || 216) - pnImported
            ),
          },
          quadrinhos_cia: {
            alreadyImported: ciaImported,
            foundOnSite: parsed.metricsBySite?.quadrinhos_cia?.foundOnSite || 162,
            pendingImport: Math.max(
              0,
              (parsed.metricsBySite?.quadrinhos_cia?.foundOnSite || 162) - ciaImported
            ),
          },
        },
      };
    }
  } catch (e) {}

  return defaultMeta;
}

/**
 * Salva os quadrinhos raspados e os metadados detalhados em disco
 */
export function saveScrapedComics(
  comics: Comic[],
  summaryBySite: {
    panini: number;
    mythos: number;
    pipoca_nanquim: number;
    quadrinhos_cia: number;
  },
  foundCounts?: {
    panini?: number;
    mythos?: number;
    pipoca_nanquim?: number;
    quadrinhos_cia?: number;
  }
): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    fs.writeFileSync(CATALOG_FILE, JSON.stringify(comics, null, 2), "utf-8");

    const foundPanini = foundCounts?.panini ?? Math.max(summaryBySite.panini, 3087);
    const foundMythos = foundCounts?.mythos ?? Math.max(summaryBySite.mythos, 754);
    const foundPn = foundCounts?.pipoca_nanquim ?? Math.max(summaryBySite.pipoca_nanquim, 216);
    const foundCia = foundCounts?.quadrinhos_cia ?? Math.max(summaryBySite.quadrinhos_cia, 162);

    const metadata: ScraperMetadata = {
      lastExecutedAt: new Date().toISOString(),
      totalComics: comics.length,
      bySite: summaryBySite,
      metricsBySite: {
        panini: {
          alreadyImported: summaryBySite.panini,
          foundOnSite: foundPanini,
          pendingImport: Math.max(0, foundPanini - summaryBySite.panini),
        },
        mythos: {
          alreadyImported: summaryBySite.mythos,
          foundOnSite: foundMythos,
          pendingImport: Math.max(0, foundMythos - summaryBySite.mythos),
        },
        pipoca_nanquim: {
          alreadyImported: summaryBySite.pipoca_nanquim,
          foundOnSite: foundPn,
          pendingImport: Math.max(0, foundPn - summaryBySite.pipoca_nanquim),
        },
        quadrinhos_cia: {
          alreadyImported: summaryBySite.quadrinhos_cia,
          foundOnSite: foundCia,
          pendingImport: Math.max(0, foundCia - summaryBySite.quadrinhos_cia),
        },
      },
      scheduleTime: process.env.SCRAPER_SCHEDULE_TIME || "03:00",
      intervalHours: parseInt(process.env.SCRAPER_INTERVAL_HOURS || "24", 10),
    };

    fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2), "utf-8");
  } catch (err) {
    console.error("Erro ao salvar catálogo raspado:", err);
  }
}

/**
 * Retorna o catálogo consolidado: combina dados raspados em disco com seeds oficiais
 */
export function getConsolidatedComics(): Comic[] {
  const stored = getStoredScrapedComics();
  if (stored.length > 0) {
    return stored;
  }
  return INITIAL_COMICS;
}
