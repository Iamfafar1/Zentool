# ⚡ Zentool Suite

**The Ultimate Digital Swiss Army Knife.**
A powerful, all-in-one browser-based utility suite that runs entirely on the client side. No server uploads, no data tracking, just pure functionality.

[ **🚀 Live Demo** ](https://your-domain.com) ![Project Preview](https://via.placeholder.com/1200x600?text=Zentool+Suite+Preview) ## ✨ Features

This suite includes **13+ powerful tools** categorized for different needs:

### 📄 Documents & PDF
* **CV Builder Pro:** Create professional resumes with 10+ templates and photo support. Exports to PDF.
* **PDF Architect:** Convert Word (.docx), Images, or Text files to PDF instantly.
* **DocuSmith:** A lightweight editor to draft and export content as PDF, Word, or TXT.

### 🎨 Media & Images
* **Image Compressor:** Convert (HEIC/WebP/PNG) and compress images with quality control.
* **QR Generator Suite:** Generate colorful QR codes (URL & WiFi) and scan QR codes from images.

### 🤖 Social & AI
* **AI Text Humanizer:** Rephrase robotic AI text to sound natural using in-browser AI (Transformers.js).
* **AI Prompt Helper:** Generate detailed prompts for Midjourney or ChatGPT from simple ideas.
* **Subtitle Converter:** Convert YouTube `.srt` files to `.vtt` or plain text transcripts.
* **Bio Styler:** Generate cool fonts (Bold, Script, Italic) for social media bios.
* **Link Shrinker:** Shorten long URLs instantly using the TinyURL API.

### 💼 Business & Developer
* **Freelancer Fee Calculator:** Calculate exact charges to cover fees for Upwork, Fiverr, and PayPal.
* **Reverse Income Calculator:** Determine your required hourly rate based on your monthly income goals.
* **JSON to CSV:** Flatten complex JSON arrays into readable CSV spreadsheets.
* **Text Utilities:** Convert text case (Camel, Slug, SpongeBob) for developers.

## 🛠️ Tech Stack

* **Core:** HTML5, Vanilla JavaScript (ES6+), CSS3.
* **Styling:** Tailwind CSS (via CDN) for responsive, dark-mode-ready UI.
* **Architecture:** Zero-Backend / No-Build (Runs directly in the browser).

**Libraries Used:**
* `jsPDF` & `html2canvas` (PDF Generation)
* `mammoth.js` (Word Document Processing)
* `heic2any` (HEIC Image Support)
* `transformers.js` (In-browser AI)
* `qrcodejs` & `jsQR` (QR Generation/Scanning)

## 🚀 How to Run Locally

Since this is a static site, you don't need `npm` or a server.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/zentool-suite.git](https://github.com/YOUR_USERNAME/zentool-suite.git)
    ```
2.  **Open the file:**
    Navigate to the folder and double-click `index.html` to open it in your browser.

## 🌐 Hosting on GitHub Pages

1.  Go to **Settings** > **Pages**.
2.  Select **Source** as `Deploy from a branch`.
3.  Select `main` (or `master`) branch and click **Save**.
4.  Your site will be live at `https://yourusername.github.io/zentool-suite`.

## 🔒 Privacy & Security

* **Client-Side Processing:** All file conversions (Images, PDFs) happen 100% inside your browser. No files are ever uploaded to a server.
* **Local AI:** The Text Humanizer downloads a small model to your browser cache and runs locally.

## 👤 Author

**Architected by Fardin Islam**
* Built with ☕ and Code.

---
*License: MIT*
