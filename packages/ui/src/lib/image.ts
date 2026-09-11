/**
 * Turning an uploaded file into something a panel can carry.
 *
 * NO LIBRARY, and none is needed: a `<canvas>` and `drawImage`.
 *
 * A DATA URI, NOT AN OBJECT URL. `URL.createObjectURL` dies with the tab, so a
 * logo chosen today would be gone tomorrow. A data URI survives in storage and
 * goes straight into `<img src>`. When a server arrives this file becomes an
 * upload call and nothing else changes: screens already hold a STRING and do
 * not care whether it is a data URI or an `https://` address.
 *
 * WHY IT IS RESIZED. `localStorage` holds about 5 MB per browser and a phone
 * photo alone is 4 MB. Writing one unresized throws `QuotaExceeded`, and the
 * thing that gets lost may not be the logo but whatever else was being saved
 * at that moment.
 *
 * THE RATIO IS KEPT, NOTHING IS CROPPED. Cropping to fit a square is the most
 * common and most silent mistake: the logo looks fine and its edge is gone.
 * The long side is pulled to the limit, the short side follows.
 *
 * PNG, NOT JPEG. Logos are flat and transparent; JPEG turns transparency into
 * solid black and rings the edges.
 */

export type ImageError = "type" | "size" | "unreadable";

/** Raw file limit, before resizing. Over 8 MB is not a logo, it is an accident. */
const RAW_LIMIT = 8 * 1024 * 1024;

export const IMAGE_ACCEPT = "image/png,image/jpeg,image/svg+xml,image/webp";

/**
 * Resizes so the longest side is `maxEdge` pixels and returns a data URI.
 *
 * SVG PASSES THROUGH UNTOUCHED. Drawing a vector onto a canvas and writing PNG
 * stops it being scalable: a logo baked at 512px is blurry on a 4K screen. SVG
 * is already small and already sharp at every size.
 */
export async function prepareImage(file: File, maxEdge: number): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("type" satisfies ImageError);
  if (file.size > RAW_LIMIT) throw new Error("size" satisfies ImageError);

  const raw = await readFile(file);
  if (file.type === "image/svg+xml") return raw;

  const image = await loadImage(raw);
  const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
  if (scale >= 1) return raw;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return raw;
  /* The browser's own smoothing: better than a hand-written resampler, and free. */
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}

/**
 * Cuts a SQUARE piece out of an image: for a mark or a profile photo.
 *
 * `area` is given in RATIOS (0 to 1), not in the image's own pixels, because
 * the picker runs on a preview whose scale changes from screen to screen. A
 * ratio points at the same place at every scale.
 */
export async function cropSquare(
  source: string,
  area: { x: number; y: number; size: number },
  maxEdge: number,
): Promise<string> {
  const image = await loadImage(source);
  /* The square is measured against the SHORT side: a 350x65 logo can hold a
     square of at most 65px. Measured against the long side the frame would
     fall outside the image. */
  const edge = Math.min(image.width, image.height) * area.size;
  const canvas = document.createElement("canvas");
  canvas.width = maxEdge;
  canvas.height = maxEdge;
  const ctx = canvas.getContext("2d");
  if (!ctx) return source;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, area.x * image.width, area.y * image.height, edge, edge, 0, 0, maxEdge, maxEdge);
  return canvas.toDataURL("image/png");
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("unreadable" satisfies ImageError));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("unreadable" satisfies ImageError));
    img.src = src;
  });
}
