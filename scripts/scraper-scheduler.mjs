/**
 * Daemon de Agendamento do Scraper ComixFlix
 * Lê configurações de horário e intervalo do .env e executa rotinas de coleta periódicas
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const ENV_FILE = path.join(ROOT_DIR, ".env");

// Carrega variáveis do .env manualmente se não estiver em ambiente gerenciado
function loadEnv() {
  if (fs.existsSync(ENV_FILE)) {
    const lines = fs.readFileSync(ENV_FILE, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...vals] = trimmed.split("=");
      if (key && vals.length > 0) {
        const val = vals.join("=").replace(/^["']|["']$/g, "").trim();
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = val;
        }
      }
    }
  }
}

loadEnv();

const SCHEDULE_TIME = process.env.SCRAPER_SCHEDULE_TIME || "03:00";
const INTERVAL_HOURS = parseInt(process.env.SCRAPER_INTERVAL_HOURS || "24", 10);
const RUN_NOW = process.argv.includes("--run-now") || process.env.SCRAPER_AUTO_RUN_ON_BOOT === "true";

console.log("====================================================");
console.log("🤖 COMIXFLIX — MOTOR DE AGENDAMENTO DE SCRAPING");
console.log("====================================================");
console.log(`⏰ Horário diário programado: ${SCHEDULE_TIME} (formato 24h)`);
console.log(`⏱️ Intervalo entre execuções: ${INTERVAL_HOURS} horas`);
console.log("====================================================\n");

async function executeScraping() {
  console.log(`[${new Date().toISOString()}] 🚀 Iniciando pipeline de scraping nas 3 editoras...`);
  try {
    // Import dinâmico da função orquestradora
    const res = await fetch("http://localhost:3000/api/scraper/stream", {
      method: "POST",
    });

    if (!res.ok) {
      console.error(`Falha ao disparar scraper via API HTTP: ${res.status} ${res.statusText}`);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value);
      const lines = text.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const event = JSON.parse(line.substring(6));
            if (event.type === "progress") {
              console.log(
                `  [${event.siteName}] [${event.progress}%] ${event.message} (Itens: ${event.itemsFound})`
              );
            } else if (event.type === "complete") {
              console.log(`\n✅ ${event.message}`);
              console.log(`  Resumo:`, JSON.stringify(event.summary.bySite));
            }
          } catch (e) {}
        }
      }
    }
  } catch (err) {
    console.error("Erro na execução do scraper agendado:", err.message);
  }
}

function calculateMsUntilNextRun(targetTimeStr) {
  const [hours, minutes] = targetTimeStr.split(":").map(Number);
  const now = new Date();
  const nextRun = new Date();

  nextRun.setHours(hours, minutes, 0, 0);

  // Se o horário de hoje já passou, agenda para amanhã
  if (nextRun.getTime() <= now.getTime()) {
    nextRun.setDate(nextRun.getDate() + 1);
  }

  return nextRun.getTime() - now.getTime();
}

async function startScheduler() {
  if (RUN_NOW) {
    console.log("⚡ Flag --run-now detectada. Executando imediatamente...");
    await executeScraping();
  }

  const scheduleNext = () => {
    const msUntilRun = calculateMsUntilNextRun(SCHEDULE_TIME);
    const hoursUntil = (msUntilRun / (1000 * 60 * 60)).toFixed(2);
    console.log(`💤 Próxima execução programada para às ${SCHEDULE_TIME} (em aprox. ${hoursUntil} horas).`);

    setTimeout(async () => {
      await executeScraping();
      // Após a execução, agenda a próxima respeitando o intervalo
      scheduleNext();
    }, msUntilRun);
  };

  scheduleNext();
}

startScheduler();
