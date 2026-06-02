# VidDrop Manager (AllDownloader)

A premium, modern web application for downloading videos and audio from various social media platforms (YouTube, Instagram, Facebook, TikTok, and more). VidDrop combines a sleek glassmorphic UI with a powerful backend powered by `yt-dlp`.

## ✨ Features

- **Multi-Platform Support**: Download from YouTube, Instagram (Posts, Reels, Stories), Facebook, and thousands of other sites.
- **Premium UI/UX**: Built with React, Tailwind CSS, and Framer Motion for smooth animations, glassmorphism design, and a highly responsive layout. Includes seamless dark/light mode and micro-interactions like success confetti.
- **Advanced Creator Tools**:
  - **Audio Extraction**: Download just the audio (MP3, M4A) from videos.
  - **Trim Tool**: Cut and download specific sections of a video without downloading the whole file.
  - **Bulk Downloader**: Queue up multiple URLs and download them simultaneously.
  - **Story Downloader**: Save 24-hour stories (includes browser cookie support to bypass auth gates).
  - **Stats & Thumbnails**: View deep video analytics and fetch high-res thumbnails.
- **Progressive Web App (PWA)**: Installable as a native-feeling app on mobile and desktop directly from the browser.
- **Resilient & Reliable**: Robust error recovery, auto-retry functionality, and backend session handling.
- **Pro Shortcuts**: Use `Ctrl+K` (or `Cmd+K`) to quickly focus the URL input anywhere in the app.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, `yt-dlp-exec`
- **Key Libraries**: `lucide-react` (icons), `canvas-confetti` (animations), `vite-plugin-pwa` (PWA support)

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [Python](https://www.python.org/) (required by `yt-dlp`)
- [FFmpeg](https://ffmpeg.org/) (required for trimming, audio extraction, and format conversions)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/panchanansahoo/AllDownloader.git
   cd AllDownloader
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the App

You will need to run the frontend and backend simultaneously in two separate terminal windows.

**Terminal 1: Start the Backend (API)**
```bash
cd backend
npm run dev
# The backend will run on http://localhost:4000
```

**Terminal 2: Start the Frontend (UI)**
```bash
cd frontend
npm run dev
# The frontend will run on http://localhost:5173
```

Navigate to `http://localhost:5173` in your browser to start using VidDrop Manager!

## 🔐 Notes on Authentication (Cookies)
For downloading restricted content (e.g., age-restricted YouTube videos or private Instagram stories), the backend is configured to use your local browser's cookies (`cookiesFromBrowser: "chrome"`). Ensure you are logged into the respective platforms on Chrome if you wish to download authenticated content.

## 📄 License
This project is for educational and personal use. Please respect the copyright and terms of service of the platforms you download from.
