/**
 * Sintetizador Nativo Web Audio API para o efeito sonoro cinematográfico
 * do ComixFlix (estilo "Tudum" com virada de páginas de gibi).
 * Não depende de arquivos externos, funcionando offline e sem falhas de rede.
 */

export function playNetflixComicIntroSound() {
  if (typeof window === "undefined") return;

  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // 1. Grave Profundo Cinematográfico (Sub-bass Whoosh / Boom)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();

    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(115, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 1.2);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.65, now + 0.08);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);

    subOsc.start(now);
    subOsc.stop(now + 1.85);

    // 2. Ruído Acústico de Virada Rápida de Páginas de gibi (Comic Book Page Flutter)
    const bufferSize = ctx.sampleRate * 0.45;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Gera textura de atrito de papel
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.2));
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2200, now);
    filter.Q.setValueAtTime(3.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.25, now + 0.05);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    whiteNoise.start(now + 0.05);
    whiteNoise.stop(now + 0.5);

    // 3. Brilho Harmônico Neon no ápice
    const chimeOsc = ctx.createOscillator();
    const chimeGain = ctx.createGain();

    chimeOsc.type = "triangle";
    chimeOsc.frequency.setValueAtTime(440, now + 0.1);
    chimeOsc.frequency.exponentialRampToValueAtTime(880, now + 0.35);

    chimeGain.gain.setValueAtTime(0.001, now);
    chimeGain.gain.linearRampToValueAtTime(0.15, now + 0.2);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

    chimeOsc.connect(chimeGain);
    chimeGain.connect(ctx.destination);

    chimeOsc.start(now + 0.1);
    chimeOsc.stop(now + 1.15);
  } catch (e) {
    console.warn("[ComixFlix] Áudio da intro bloqueado pelo navegador ou indisponível:", e);
  }
}
