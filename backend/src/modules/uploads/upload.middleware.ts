import path from "node:path";
import fs from "node:fs";
import multer from "multer";
import { env } from "../../config/env";
import { AppError } from "../../utils/AppError";

const uploadRoot = path.resolve(process.cwd(), env.uploadDir);
if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

/**
 * Allow-list of accepted MIME types → the ONLY extension we will write.
 * SVG is intentionally excluded: it is script-capable and would run inline
 * when served from our origin (stored XSS). The extension is derived from
 * this map, never from the user-supplied filename — otherwise an attacker
 * could upload "x.html" with a spoofed image MIME type and have it served as
 * text/html (stored XSS).
 */
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "application/pdf": ".pdf",
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const ext = MIME_TO_EXT[file.mimetype] ?? ".bin";
    const base = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-z0-9-_]/gi, "-")
      .slice(0, 40) || "file";
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${base}-${unique}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (MIME_TO_EXT[file.mimetype]) cb(null, true);
    else cb(AppError.badRequest(`Unsupported file type: ${file.mimetype}`));
  },
});
