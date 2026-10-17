let cached: string | null = null;

export function makeGrainTile(size = 128, alpha = 200): string {
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(size, size);
  const buffer = new Uint32Array(imageData.data.buffer);

  for (let i = 0; i < buffer.length; i++) {
    const v = (Math.random() * 255) | 0;
    buffer[i] = (alpha << 24) | (v << 16) | (v << 8) | v;
  }

  ctx.putImageData(imageData, 0, 0);
  cached = canvas.toDataURL();
  return cached;
}