import sharp from "sharp";

// Gallery photos are stored at most 1600px on the long edge. sharp drops EXIF
// by default, which also strips GPS location from phone uploads.
export async function toWebJpeg(input: Buffer | string) {
  const { data, info } = await sharp(input)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}
