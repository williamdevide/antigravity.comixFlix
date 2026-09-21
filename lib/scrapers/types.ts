import { Comic } from "../types/comic";

export type ScraperSite = "panini" | "mythos" | "pipoca_nanquim" | "quadrinhos_cia";

export interface ScraperProgressEvent {
  site: ScraperSite;
  siteName: string;
  status: "idle" | "running" | "extracting" | "completed" | "error";
  progress: number; // 0 a 100
  message: string;
  itemsFound: number;
  totalComicsExtracted: number;
  error?: string;
  timestamp: string;
}

export type ScraperProgressCallback = (event: ScraperProgressEvent) => void;

export interface ScraperExecutionSummary {
  startedAt: string;
  finishedAt: string;
  totalExtracted: number;
  bySite: {
    panini: number;
    mythos: number;
    pipoca_nanquim: number;
    quadrinhos_cia: number;
  };
  success: boolean;
  errors: string[];
}
