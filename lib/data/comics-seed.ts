import { Comic } from "../types/comic";
import { getAuthenticPaniniFallback } from "../scrapers/panini";
import { getAuthenticMythosFallback } from "../scrapers/mythos";
import { getAuthenticPipocaNanquimFallback } from "../scrapers/pipoca-nanquim";

/**
 * Catálogo canônico inicial do ComixFlix
 * 100% composto por edições autênticas das 3 editoras prioritárias com capas e dados reais
 */
export const INITIAL_COMICS: Comic[] = [
  ...getAuthenticPaniniFallback(),
  ...getAuthenticMythosFallback(),
  ...getAuthenticPipocaNanquimFallback(),
];
