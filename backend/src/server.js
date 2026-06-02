const express = require('express');
const cors = require('cors');
const youtubedl = require('yt-dlp-exec');

const app = express();
const PORT = process.env.PORT || 4001; // Changed to 4001 to avoid EADDRINUSE

app.use(cors());
app.use(express.json());

// format size helper
function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// format duration
function formatDuration(seconds) {
    if (!seconds) return "Unknown";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

// 1. Analyze endpoint
app.post('/api/analyze', async (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ status: "error", message: "URL is required" });
    }

    try {
        console.log(`Analyzing: ${url}`);
        const metadata = await youtubedl(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            cookiesFromBrowser: "chrome", // Peeks at local Chrome cookies to bypass login walls
        });

        // Try to estimate filesize (filesize_approx or filesize from best format)
        let estimatedSize = 0;
        if (metadata.filesize) estimatedSize = metadata.filesize;
        else if (metadata.filesize_approx) estimatedSize = metadata.filesize_approx;
        else if (metadata.formats && metadata.formats.length > 0) {
            const bestFormat = metadata.formats.filter(f => f.filesize).sort((a,b) => b.filesize - a.filesize)[0];
            if (bestFormat) estimatedSize = bestFormat.filesize;
        }

        const data = {
            status: "success",
            message: "Media analyzed successfully.",
            title: metadata.title,
            thumbnail: metadata.thumbnail,
            duration: formatDuration(metadata.duration),
            size: estimatedSize > 0 ? formatBytes(estimatedSize) : "Unknown",
            rawSize: estimatedSize,
            url: url
        };

        res.json(data);
    } catch (err) {
        console.error("Analyze error:", err);
        res.status(500).json({ status: "error", message: "Failed to analyze video." });
    }
});

// 2. Stream download endpoint
app.get('/api/download/stream', (req, res) => {
    const { url, format, startTime, endTime } = req.query;

    if (!url) {
        return res.status(400).send("URL required");
    }

    console.log(`Streaming: ${url} as ${format || 'best'} (Trim: ${startTime || 'start'} to ${endTime || 'end'})`);
    
    // Set headers for file download streaming
    res.setHeader('Content-Type', 'application/octet-stream');

    const options = {
        o: '-', // stdout
        q: true,
        cookiesFromBrowser: "chrome",
    };

    const isAudio = ['mp3', 'm4a', 'wav', 'flac'].includes(format);

    if (isAudio) {
        options.f = 'bestaudio';
        options.extractAudio = true;
        options.audioFormat = format;
    } else {
        options.f = 'b[ext=mp4][vcodec^=avc]/b[ext=mp4]/b';
    }

    // Video Trimming Support
    if (startTime || endTime) {
        const start = startTime || "00:00:00";
        const end = endTime || "inf";
        options.downloadSections = `*${start}-${end}`;
        // Note: For section downloading to work perfectly and output to stdout, ffmpeg must be available.
    }

    const subprocess = youtubedl.exec(url, options);

    subprocess.stdout.pipe(res);

    subprocess.stderr.on('data', (data) => {
        // yt-dlp stderr might contain progress info if not quiet, but we set q: true
        console.error(`yt-dlp error/warn: ${data}`);
    });

    subprocess.on('close', (code) => {
        console.log(`Stream finished with code ${code}`);
    });
});

app.listen(PORT, () => {
    console.log(`VidDrop Backend running on port ${PORT}`);
});
