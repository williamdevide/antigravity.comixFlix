import { NextRequest } from "next/server";
import { runFullScraperPipeline, ScraperProgressEvent } from "@/lib/scrapers";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: any) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch (e) {
          console.warn("Erro ao emitir evento SSE:", e);
        }
      };

      try {
        sendEvent({
          type: "start",
          message: "Iniciando varredura automatizada nas 4 editoras (Panini, Mythos, Pipoca & Nanquim, Quadrinhos na Cia)...",
          timestamp: new Date().toISOString(),
        });

        const { comics, summary } = await runFullScraperPipeline((event: ScraperProgressEvent) => {
          sendEvent({
            type: "progress",
            ...event,
          });
        });

        sendEvent({
          type: "complete",
          message: `Scraping finalizado com sucesso! ${comics.length} quadrinhos autênticos catalogados.`,
          summary,
          timestamp: new Date().toISOString(),
        });
      } catch (err: any) {
        sendEvent({
          type: "error",
          message: `Erro durante a execução do scraper: ${err?.message || err}`,
          timestamp: new Date().toISOString(),
        });
      } finally {
        try {
          controller.close();
        } catch (e) {}
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
