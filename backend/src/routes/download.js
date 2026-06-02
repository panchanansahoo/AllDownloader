const express = require("express");
const { z } = require("zod");
const { resolveDownload } = require("../services/downloadService");
const { getJob } = require("../services/jobStore");

const downloadRouter = express.Router();

const bodySchema = z.object({
  url: z.string().trim().min(1, "Please paste a video link."),
  format: z.enum(["mp4", "mp3"]).default("mp4"),
  quality: z.string().trim().min(1).default("auto"),
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

downloadRouter.post("/download", async (req, res, next) => {
  try {
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: "error",
        message: parsed.error.issues[0]?.message || "Invalid request.",
      });
    }

    const result = await resolveDownload(parsed.data.url, {
      format: parsed.data.format,
      quality: parsed.data.quality,
    });
    const code = result.status === "error" ? 400 : 200;
    return res.status(code).json(result);
  } catch (error) {
    next(error);
  }
});

downloadRouter.get("/download/media/:jobId", (req, res) => {
  const job = getJob(req.params.jobId);
  if (!job) {
    return res.status(404).send("Download session not found.");
  }

  res.type("html").send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(job.title)}</title>
        <style>
          body{font-family:Arial,Helvetica,sans-serif;background:#0f172a;color:#e2e8f0;margin:0;padding:32px}
          .card{max-width:760px;margin:0 auto;background:#111827;border:1px solid #334155;border-radius:24px;padding:24px}
          img{width:100%;border-radius:20px;display:block;margin-bottom:20px}
          h1{margin:0 0 8px;font-size:28px}
          p{line-height:1.6;color:#cbd5e1}
          .meta{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0}
          .pill{background:#1e293b;border:1px solid #334155;border-radius:999px;padding:8px 12px;font-size:14px}
          a{display:inline-block;margin-top:16px;background:#f8fafc;color:#0f172a;text-decoration:none;padding:12px 18px;border-radius:14px;font-weight:700}
        </style>
      </head>
      <body>
        <div class="card">
          <img src="${escapeHtml(job.thumbnail)}" alt="${escapeHtml(job.title)}" />
          <h1>${escapeHtml(job.title)}</h1>
          <p>${escapeHtml(job.message)}</p>
          <div class="meta">
            <span class="pill">Platform: ${escapeHtml(job.platform)}</span>
            <span class="pill">Format: ${escapeHtml(job.selectedFormat)}</span>
            <span class="pill">Quality: ${escapeHtml(job.selectedQuality)}</span>
          </div>
          <p>This page is a compliant media summary. Wire a licensed media service here if you need actual file delivery.</p>
          <a href="${escapeHtml(job.sourceUrl)}" target="_blank" rel="noreferrer">Open source link</a>
        </div>
      </body>
    </html>
  `);
});

module.exports = { downloadRouter };
