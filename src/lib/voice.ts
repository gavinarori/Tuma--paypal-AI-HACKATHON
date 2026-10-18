// Browser-side voice capture. Records the mic, converts to 16 kHz mono WAV (works on every browser),
// and hands it to /api/transcribe.

export async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
  const rec = new MediaRecorder(stream);
  const chunks: Blob[] = [];
  rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };

  const result = new Promise<Blob>((resolve, reject) => {
    rec.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      try { resolve(await toWav(new Blob(chunks, { type: rec.mimeType }))); } catch (e) { reject(e); }
    };
    rec.onerror = () => reject(new Error("Recording failed"));
  });

  rec.start();
  const timer = setTimeout(() => { if (rec.state === "recording") rec.stop(); }, 20000); // 20 s cap
  return {
    result,
    stop: () => { clearTimeout(timer); if (rec.state === "recording") rec.stop(); },
  };
}

async function toWav(blob: Blob): Promise<Blob> {
  const ctx = new AudioContext();
  const decoded = await ctx.decodeAudioData(await blob.arrayBuffer());
  await ctx.close();
  if (decoded.duration < 0.4) throw new Error("That was too short. Tap the mic, speak, then tap it again.");

  const rate = 16000;
  const off = new OfflineAudioContext(1, Math.ceil(decoded.duration * rate), rate);
  const src = off.createBufferSource();
  src.buffer = decoded; src.connect(off.destination); src.start();
  const pcm = (await off.startRendering()).getChannelData(0);

  const out = new DataView(new ArrayBuffer(44 + pcm.length * 2));
  const tag = (o: number, s: string) => [...s].forEach((c, i) => out.setUint8(o + i, c.charCodeAt(0)));
  tag(0, "RIFF"); out.setUint32(4, 36 + pcm.length * 2, true); tag(8, "WAVE"); tag(12, "fmt ");
  out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, 1, true);
  out.setUint32(24, rate, true); out.setUint32(28, rate * 2, true); out.setUint16(32, 2, true); out.setUint16(34, 16, true);
  tag(36, "data"); out.setUint32(40, pcm.length * 2, true);
  pcm.forEach((s, i) => { const v = Math.max(-1, Math.min(1, s)); out.setInt16(44 + i * 2, v < 0 ? v * 0x8000 : v * 0x7fff, true); });
  return new Blob([out], { type: "audio/wav" });
}
