// Tailwind Configuration
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#6366f1',
                secondary: '#0f172a',
                accent: '#ec4899',
            },
            animation: {
                'gradient': 'gradient 15s ease infinite',
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                gradient: {
                    '0%, 100%': { 'background-position': '0% 50%' },
                    '50%': { 'background-position': '100% 50%' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        }
    }
}

// --- Dynamic Script Loader ---
function loadScript(src) {
    return new Promise((resolve, reject) => {
        // Check if the script is already loaded
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        
        // Check if the script is currently loading
        if (document.querySelector(`script[data-loading="${src}"]`)) {
            const script = document.querySelector(`script[data-loading="${src}"]`);
            script.addEventListener('load', resolve);
            script.addEventListener('error', reject);
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.setAttribute('data-loading', src); 
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// --- Navigation Logic ---
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const mobileBtn = document.getElementById('mobile-menu-btn');
const body = document.body;

function toggleSidebar() {
    const isClosed = sidebar.classList.contains('-translate-x-full');
    if (isClosed) {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
        body.classList.add('overflow-hidden'); 
    } else {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
        body.classList.remove('overflow-hidden');
    }
}

if(mobileBtn) mobileBtn.addEventListener('click', toggleSidebar);
if(overlay) overlay.addEventListener('click', toggleSidebar);

// --- Theme Logic ---
const html = document.documentElement;
const themeIcon = document.getElementById('theme-icon');
const mobileThemeIcon = document.getElementById('mobile-theme-icon');

// Initial Theme Set
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
    updateThemeIcons(true);
} else {
    html.classList.remove('dark');
    updateThemeIcons(false);
}

function toggleTheme() {
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        updateThemeIcons(false);
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        updateThemeIcons(true);
    }
}

function updateThemeIcons(isDark) {
    const iconClass = isDark ? 'fa-sun' : 'fa-moon';
    if(themeIcon) themeIcon.className = `fa-solid ${iconClass}`;
    if(mobileThemeIcon) mobileThemeIcon.className = `fa-solid ${iconClass}`;
}

// --- Loading Bar Logic ---
const loader = document.getElementById('global-loader');
let progressInterval;

function startProgress() {
    clearInterval(progressInterval);
    if(loader) {
        loader.style.width = '0%';
        loader.style.opacity = '1';
        let width = 0;
        progressInterval = setInterval(() => {
            if (width >= 90) {
                clearInterval(progressInterval);
            } else {
                width += Math.random() * 10;
                if(width > 90) width = 90;
                loader.style.width = width + '%';
            }
        }, 200);
    }
}

function endProgress() {
    clearInterval(progressInterval);
    if(loader) {
        loader.style.width = '100%';
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.width = '0%';
            }, 300);
        }, 300);
    }
}

// --- Tool Definitions (Keep all 16 tools as they are) ---
const tools = {
    textHumanizer: {
        title: "AI Text Humanizer",
        desc: "Rewrite robotic AI text to sound more natural using on-device AI.",
        category: "Social",
        icon: "fa-wand-magic-sparkles",
        colorClass: "text-purple-500",
        bgClass: "bg-purple-100 dark:bg-purple-900/30",
        html: `<div class="max-w-5xl mx-auto fade-in h-[calc(100vh-140px)] flex flex-col"><div class="glass p-6 rounded-2xl shadow-lg border border-white/20 flex-1 flex flex-col"><div id="aiModelStatus" class="mb-4 hidden"><div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1"><span>Downloading AI Brain...</span><span id="aiProgressText">0%</span></div><div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"><div id="aiProgressBar" class="bg-purple-500 h-2 rounded-full transition-all duration-300" style="width: 0%"></div></div></div><div class="grid md:grid-cols-2 gap-6 flex-1 h-full"><div class="flex flex-col"><label class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Robotic / AI Text</label><textarea id="humanizerInput" class="flex-1 w-full p-4 border-0 rounded-xl bg-white/50 dark:bg-slate-900/50 dark:text-white resize-none focus:ring-2 focus:ring-purple-500 outline-none shadow-inner text-sm leading-relaxed" placeholder="Paste generated text here..."></textarea></div><div class="flex flex-col"><label class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex justify-between"><span>Humanized Result</span><button onclick="copyToClipboard('humanizerOutput')" class="text-xs text-purple-500 hover:text-purple-600"><i class="fa-solid fa-copy"></i> Copy</button></label><textarea id="humanizerOutput" class="flex-1 w-full p-4 border-0 rounded-xl bg-purple-50/50 dark:bg-purple-900/20 dark:text-white resize-none outline-none shadow-inner text-sm leading-relaxed border border-purple-100 dark:border-purple-800" readonly placeholder="Result will appear here..."></textarea></div></div><div class="mt-6 flex justify-end"><button onclick="runHumanizer()" id="btnHumanize" class="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition transform hover:-translate-y-1 flex items-center"><i class="fa-solid fa-stars mr-2"></i> Humanize Text</button></div></div></div>`
    },
    cvBuilder: {
        title: "CV Builder Pro",
        desc: "Professional resumes with photo support and 10 templates.",
        category: "Documents",
        icon: "fa-id-card",
        colorClass: "text-teal-500",
        bgClass: "bg-teal-100 dark:bg-teal-900/30",
        html: `<div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 fade-in h-auto lg:h-[calc(100vh-140px)]"><div class="w-full lg:w-1/3 glass p-6 rounded-xl shadow-lg border border-white/20 overflow-y-auto custom-scrollbar"><div class="mb-6 text-center"><label class="cursor-pointer block relative group w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-dashed border-slate-300 hover:border-teal-500 transition"><img id="cvPhotoPreview" class="w-full h-full object-cover hidden"><div id="cvPhotoPlaceholder" class="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-teal-500 bg-slate-50 dark:bg-slate-800"><i class="fa-solid fa-camera text-xl mb-1"></i><span class="text-[10px] uppercase font-bold">Add Photo</span></div><input type="file" class="hidden" accept="image/*" onchange="handleCVPhoto(this)"></label></div><div class="space-y-4"><div class="space-y-2"><label class="text-xs font-bold uppercase text-slate-500">Personal Info</label><input type="text" id="cvName" placeholder="Full Name" class="w-full p-2.5 rounded-lg border dark:border-slate-600 bg-white/50 dark:bg-slate-800 text-sm" oninput="updateCVPreview()"><input type="text" id="cvJob" placeholder="Job Title" class="w-full p-2.5 rounded-lg border dark:border-slate-600 bg-white/50 dark:bg-slate-800 text-sm" oninput="updateCVPreview()"></div><div class="grid grid-cols-2 gap-2"><input type="text" id="cvEmail" placeholder="Email" class="w-full p-2.5 rounded-lg border dark:border-slate-600 bg-white/50 dark:bg-slate-800 text-sm" oninput="updateCVPreview()"><input type="text" id="cvPhone" placeholder="Phone" class="w-full p-2.5 rounded-lg border dark:border-slate-600 bg-white/50 dark:bg-slate-800 text-sm" oninput="updateCVPreview()"></div><div class="grid grid-cols-2 gap-2"><input type="text" id="cvAddress" placeholder="City, Country" class="w-full p-2.5 rounded-lg border dark:border-slate-600 bg-white/50 dark:bg-slate-800 text-sm" oninput="updateCVPreview()"><input type="text" id="cvWeb" placeholder="Website / LinkedIn" class="w-full p-2.5 rounded-lg border dark:border-slate-600 bg-white/50 dark:bg-slate-800 text-sm" oninput="updateCVPreview()"></div><div><label class="text-xs font-bold uppercase text-slate-500 mb-1 block">Profile</label><textarea id="cvSummary" placeholder="Professional Summary..." rows="3" class="w-full p-2.5 rounded-lg border dark:border-slate-600 bg-white/50 dark:bg-slate-800 text-sm" oninput="updateCVPreview()"></textarea></div><div><label class="text-xs font-bold uppercase text-slate-500 mb-1 block">Experience</label><textarea id="cvExp" placeholder="Company | Date&#10;• Achievements..." rows="4" class="w-full p-2.5 rounded-lg border dark:border-slate-600 bg-white/50 dark:bg-slate-800 text-sm font-mono" oninput="updateCVPreview()"></textarea></div><div><label class="text-xs font-bold uppercase text-slate-500 mb-1 block">Education</label><textarea id="cvEdu" placeholder="Degree | University | Date" rows="3" class="w-full p-2.5 rounded-lg border dark:border-slate-600 bg-white/50 dark:bg-slate-800 text-sm font-mono" oninput="updateCVPreview()"></textarea></div><div><label class="text-xs font-bold uppercase text-slate-500 mb-1 block">Skills</label><textarea id="cvSkills" placeholder="Skill 1, Skill 2, Skill 3" rows="2" class="w-full p-2.5 rounded-lg border dark:border-slate-600 bg-white/50 dark:bg-slate-800 text-sm" oninput="updateCVPreview()"></textarea></div></div><div class="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700"><label class="text-xs font-bold uppercase text-slate-500 mb-2 block">Choose Template</label><select id="cvTemplateSelector" onchange="updateCVPreview()" class="w-full p-3 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:ring-2 focus:ring-teal-500 outline-none"><option value="1">1. Minimalist Clean</option><option value="2">2. Modern Blue Sidebar</option><option value="3">3. Creative Pink</option><option value="4">4. Corporate Grey</option><option value="10">10. Tech Stack</option></select><button onclick="downloadCV()" class="w-full mt-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg transform active:scale-95 transition-all"><i class="fa-solid fa-download mr-2"></i> Download PDF</button></div></div><div class="w-full lg:w-2/3 bg-slate-100 dark:bg-slate-900/50 rounded-xl p-4 lg:p-8 overflow-y-auto flex justify-center items-start shadow-inner"><div id="cvPreviewArea" class="cv-preview origin-top transition-all shadow-2xl bg-white text-black min-h-[297mm] w-[210mm] relative"></div></div></div>`
    },
    pdfArchitect: {
        title: "PDF & Office Architect",
        desc: "Convert Word/Images to PDF or convert Documents to MS Office.",
        category: "Documents",
        icon: "fa-file-pdf",
        colorClass: "text-red-500",
        bgClass: "bg-red-100 dark:bg-red-900/30",
        html: `<div class="max-w-4xl mx-auto glass p-8 rounded-2xl shadow-lg border border-white/20 fade-in"><div class="flex justify-center mb-8"><div class="bg-white/50 dark:bg-slate-800/50 p-1 rounded-xl flex shadow-sm"><button onclick="setPdfMode('pdf')" id="btn-mode-pdf" class="px-6 py-2 rounded-lg text-sm font-bold bg-white dark:bg-slate-700 shadow-sm text-red-600 dark:text-red-400 transition-all">To PDF</button><button onclick="setPdfMode('office')" id="btn-mode-office" class="px-6 py-2 rounded-lg text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-600/50 transition-all">To MS Office</button></div></div><div id="mode-pdf-content"><div class="text-center mb-6"><h3 class="text-lg font-bold text-slate-700 dark:text-slate-200">Convert to PDF</h3><p class="text-sm text-slate-500">Word (.docx), Images, or Text.</p></div><div id="pdfUploadBox" class="border-2 border-dashed border-red-300 dark:border-red-900/50 rounded-xl p-12 text-center hover:bg-white/30 dark:hover:bg-slate-700/30 transition cursor-pointer group mb-6" onclick="document.getElementById('pdfInput').click()"><div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"><i class="fa-solid fa-cloud-arrow-up text-2xl"></i></div><p class="font-bold text-lg text-slate-700 dark:text-slate-200">Click to Upload</p><input type="file" id="pdfInput" class="hidden" accept=".docx,.txt,image/*" onchange="handlePdfUpload(this)"></div><div id="pdfActionArea" class="hidden text-center bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-white/10"><div class="flex items-center justify-center gap-3 mb-4"><i class="fa-solid fa-file-circle-check text-green-500 text-xl"></i><span id="pdfFileName" class="font-mono text-sm dark:text-white">file.name</span></div><button onclick="generatePDF()" class="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg">Download PDF</button></div></div><div id="mode-office-content" class="hidden"><div class="text-center mb-6"><h3 class="text-lg font-bold text-slate-700 dark:text-slate-200">Convert to MS Word/Excel</h3><p class="text-sm text-slate-500">Create Office docs from text or data.</p></div><div class="grid md:grid-cols-2 gap-6"><div class="bg-white/50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700"><h4 class="font-bold text-blue-600 mb-2"><i class="fa-solid fa-file-word mr-2"></i>Text to Word</h4><textarea id="wordContent" class="w-full h-32 p-3 text-sm rounded-lg bg-white dark:bg-slate-900 border dark:border-slate-600 mb-4" placeholder="Type document content..."></textarea><button onclick="exportToOffice('word')" class="w-full bg-blue-600 text-white py-2 rounded-lg font-bold text-sm">Download .doc</button></div><div class="bg-white/50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700"><h4 class="font-bold text-green-600 mb-2"><i class="fa-solid fa-file-excel mr-2"></i>JSON to Excel</h4><textarea id="excelContent" class="w-full h-32 p-3 text-sm rounded-lg bg-white dark:bg-slate-900 border dark:border-slate-600 mb-4 font-mono" placeholder='[{"Name":"John", "Age":30}]'></textarea><button onclick="exportToOffice('excel')" class="w-full bg-green-600 text-white py-2 rounded-lg font-bold text-sm">Download .xls</button></div></div></div></div>`
    },
    docTools: {
        title: "DocuSmith",
        desc: "Write or paste content and save as PDF, Word, or Text.",
        category: "Documents",
        icon: "fa-pen-nib",
        colorClass: "text-blue-500",
        bgClass: "bg-blue-100 dark:bg-blue-900/30",
        html: `<div class="max-w-4xl mx-auto glass p-6 rounded-2xl shadow-lg border border-white/20 fade-in h-[calc(100vh-200px)] flex flex-col"><div class="mb-4 flex flex-wrap gap-2 justify-between items-center"><label class="text-sm font-bold text-slate-700 dark:text-slate-200">Editor</label><div class="flex gap-2"><button onclick="exportDoc('pdf')" class="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 px-3 rounded shadow-lg transition transform hover:scale-105"><i class="fa-solid fa-file-pdf mr-1"></i> PDF</button><button onclick="exportDoc('word')" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded shadow-lg transition transform hover:scale-105"><i class="fa-solid fa-file-word mr-1"></i> Word</button><button onclick="exportDoc('txt')" class="bg-slate-600 hover:bg-slate-700 text-white text-xs font-bold py-2 px-3 rounded shadow-lg transition transform hover:scale-105"><i class="fa-solid fa-file-lines mr-1"></i> TXT</button></div></div><textarea id="docInput" class="flex-1 w-full p-6 border-0 rounded-xl bg-white/50 dark:bg-slate-900/50 dark:text-white resize-none focus:ring-2 focus:ring-primary outline-none shadow-inner font-serif text-lg leading-relaxed" placeholder="Type here..."></textarea></div>`
    },
    imageConverter: {
        title: "Niche File Converter",
        desc: "Convert HEIC/WebP to PNG/JPG securely in your browser.",
        category: "Media",
        icon: "fa-image",
        colorClass: "text-indigo-500",
        bgClass: "bg-indigo-100 dark:bg-indigo-900/30",
        html: `<div class="glass p-8 rounded-2xl shadow-lg border border-white/20 max-w-2xl mx-auto fade-in"><div id="uploadBox" class="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-10 text-center hover:bg-white/30 dark:hover:bg-slate-700/30 transition cursor-pointer group" onclick="document.getElementById('imgInput').click()"><div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"><i class="fa-solid fa-cloud-arrow-up text-2xl"></i></div><p class="font-bold text-lg text-slate-700 dark:text-slate-200">Click to Upload Image</p><p class="text-xs text-slate-500 dark:text-slate-400 mt-2">Supports HEIC (iPhone), WebP, JPG, PNG, GIF</p><div id="loadingIndicator" class="hidden mt-4 flex justify-center items-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 py-2 px-4 rounded-full inline-block"><div class="loader !w-4 !h-4 !border-2"></div> Processing HEIC...</div><input type="file" id="imgInput" class="hidden" accept="image/*, .heic" onchange="handleImageUpload(this)"></div><div id="imgPreviewArea" class="hidden mt-8 p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl"><div class="flex flex-col md:flex-row gap-6 items-center"><img id="previewImg" class="max-w-[200px] w-full rounded-lg border dark:border-slate-600 shadow-md" alt="Preview"><div class="flex-1 w-full space-y-4"><div><label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Convert To:</label><div class="relative"><select id="convertFormat" class="w-full p-3 pl-4 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 dark:text-white appearance-none focus:ring-2 focus:ring-primary outline-none"><option value="image/png">PNG (Lossless)</option><option value="image/jpeg">JPG (Standard)</option><option value="image/webp">WebP (Modern)</option></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500"><i class="fa-solid fa-chevron-down text-xs"></i></div></div></div><button onclick="convertImage()" class="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">Download Converted File</button></div></div></div></div>`
    },
    imageCompressor: {
        title: "Image Compressor",
        desc: "Reduce image file size significantly while maintaining quality.",
        category: "Media",
        icon: "fa-minimize",
        colorClass: "text-rose-500",
        bgClass: "bg-rose-100 dark:bg-rose-900/30",
        html: `<div class="max-w-4xl mx-auto glass p-8 rounded-2xl shadow-lg border border-white/20 fade-in"><div id="compUploadBox" class="border-2 border-dashed border-rose-300 dark:border-rose-900/50 rounded-xl p-10 text-center hover:bg-white/30 dark:hover:bg-slate-700/30 transition cursor-pointer group" onclick="document.getElementById('compInput').click()"><div class="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"><i class="fa-solid fa-compress text-2xl"></i></div><p class="font-bold text-lg text-slate-700 dark:text-slate-200">Upload Image to Compress</p><p class="text-xs text-slate-500 dark:text-slate-400 mt-2">Supports JPG, PNG, WEBP</p><input type="file" id="compInput" class="hidden" accept="image/*" onchange="handleCompUpload(this)"></div><div id="compInterface" class="hidden mt-8 grid md:grid-cols-2 gap-8"><div class="space-y-6"><div class="bg-white/50 dark:bg-slate-800/50 p-6 rounded-xl border dark:border-slate-700"><label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Compression Level</label><input type="range" id="compRange" min="0.1" max="0.9" step="0.1" value="0.7" class="w-full accent-rose-500 cursor-pointer" oninput="updateCompression()"><div class="flex justify-between text-xs text-slate-500 mt-2 font-bold uppercase"><span>Max Compression</span><span id="compQualityDisplay">Quality: 70%</span><span>Best Quality</span></div></div><div class="flex justify-between items-center p-4 bg-slate-100 dark:bg-slate-900 rounded-lg"><div><p class="text-[10px] uppercase font-bold text-slate-500">Original Size</p><p id="compOrigSize" class="font-mono text-rose-600 font-bold">0 KB</p></div><div class="text-right"><p class="text-[10px] uppercase font-bold text-slate-500">New Size (Est)</p><p id="compNewSize" class="font-mono text-green-500 font-bold">0 KB</p></div></div><button onclick="downloadCompressed()" class="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">Download Compressed Image</button></div><div class="flex items-center justify-center bg-black/5 dark:bg-black/40 rounded-xl p-4 border border-white/10"><img id="compPreview" class="max-h-[300px] object-contain rounded shadow-lg" /></div></div></div>`
    },
    bioStyler: {
        title: "Social Bio Styler",
        desc: "Make your Instagram/TikTok bio stand out with custom fonts.",
        category: "Social",
        icon: "fa-pen-fancy",
        colorClass: "text-pink-500",
        bgClass: "bg-pink-100 dark:bg-pink-900/30",
        html: `<div class="max-w-2xl mx-auto space-y-6 fade-in"><div class="glass p-6 rounded-2xl shadow-lg border border-white/20"><label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Your Text</label><input type="text" id="bioInput" placeholder="Type something cool..." class="w-full p-4 border-0 rounded-xl bg-white/50 dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none shadow-inner text-lg" oninput="generateBioStyles()"></div><div id="bioOutputs" class="grid gap-4"></div></div>`
    },
    aiPrompt: {
        title: "AI Prompt Helper",
        desc: "Turn basic ideas into complex prompts for Midjourney or ChatGPT.",
        category: "Social",
        icon: "fa-robot",
        colorClass: "text-violet-500",
        bgClass: "bg-violet-100 dark:bg-violet-900/30",
        html: `<div class="max-w-3xl mx-auto glass p-8 rounded-2xl shadow-lg border border-white/20 fade-in"><div class="grid md:grid-cols-2 gap-8"><div class="space-y-5"><div><label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Basic Idea</label><input type="text" id="aiBase" placeholder="e.g., Cat in space" class="w-full p-3 border-0 rounded-lg bg-white/50 dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"></div><div><label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Art Style / Vibe</label><select id="aiStyle" class="w-full p-3 border-0 rounded-lg bg-white/50 dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"><option value="photo">Photorealistic / Cinematic</option><option value="cyberpunk">Cyberpunk / Neon</option><option value="painting">Oil Painting / Classic</option><option value="3d">3D Render / Pixar Style</option><option value="sketch">Pencil Sketch / Minimalist</option></select></div><div><label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Aspect Ratio</label><select id="aiRatio" class="w-full p-3 border-0 rounded-lg bg-white/50 dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"><option value=" --ar 16:9">Widescreen (16:9)</option><option value=" --ar 1:1">Square (1:1)</option><option value=" --ar 9:16">Portrait (9:16)</option></select></div><button onclick="generatePrompt()" class="w-full bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-600 hover:to-fuchsia-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"><i class="fa-solid fa-wand-magic-sparkles mr-2"></i>Generate Magic</button></div><div class="bg-slate-900 dark:bg-black text-slate-200 p-6 rounded-xl relative shadow-inner border border-white/10 flex flex-col"><label class="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Generated Prompt</label><textarea id="aiResult" class="flex-1 w-full bg-transparent border-none resize-none focus:ring-0 text-sm leading-relaxed font-mono" readonly placeholder="Your generated prompt will appear here..."></textarea><button onclick="copyToClipboard('aiResult')" class="self-end mt-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 px-4 rounded-lg transition">Copy to Clipboard</button></div></div></div>`
    },
    subtitleConverter: {
        title: "Subtitle Converter",
        desc: "Convert YouTube .SRT files to WebVTT or plain text transcripts.",
        category: "Social",
        icon: "fa-closed-captioning",
        colorClass: "text-orange-500",
        bgClass: "bg-orange-100 dark:bg-orange-900/30",
        html: `<div class="max-w-3xl mx-auto glass p-8 rounded-2xl shadow-lg border border-white/20 fade-in"><div class="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-white/30 dark:hover:bg-slate-700/30 transition cursor-pointer mb-6 group" onclick="document.getElementById('subInput').click()"><div class="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"><i class="fa-solid fa-file-lines text-2xl"></i></div><p class="font-bold text-slate-700 dark:text-slate-200">Upload .SRT File</p><input type="file" id="subInput" class="hidden" accept=".srt" onchange="handleSubUpload(this)"></div><div class="grid grid-cols-2 gap-4 mb-6"><button onclick="convertSub('vtt')" class="bg-white/50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 px-4 rounded-xl shadow-sm transition">To .VTT (Web)</button><button onclick="convertSub('txt')" class="bg-white/50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 px-4 rounded-xl shadow-sm transition">To .TXT (Transcript)</button></div><textarea id="subOutput" class="w-full h-48 p-4 text-xs font-mono bg-slate-900 text-slate-300 rounded-xl resize-none shadow-inner outline-none mb-4" readonly placeholder="Output will appear here..."></textarea><button onclick="downloadSub()" class="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl shadow-lg transition transform hover:-translate-y-1">Download Result</button></div>`
    },
    urlShrinker: {
        title: "URL Shrinker",
        desc: "Shorten long URLs instantly using the TinyURL API.",
        category: "Social",
        icon: "fa-link",
        colorClass: "text-sky-500",
        bgClass: "bg-sky-100 dark:bg-sky-900/30",
        html: `<div class="max-w-3xl mx-auto glass p-8 rounded-2xl shadow-lg border border-white/20 fade-in h-[calc(100vh-200px)] flex flex-col justify-center"><div class="text-center mb-8"><div class="inline-block p-4 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-500 mb-4 text-3xl shadow-sm"><i class="fa-solid fa-link"></i></div><h3 class="text-2xl font-bold text-slate-800 dark:text-white">Paste a Long URL</h3></div><div class="flex flex-col md:flex-row gap-4 mb-8"><input type="text" id="urlInput" placeholder="https://very-long-website-url.com/xyz..." class="flex-1 p-4 rounded-xl border-0 bg-white/50 dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none text-lg shadow-inner"><button onclick="shrinkUrl()" class="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition transform hover:scale-105 whitespace-nowrap">Shrink It <i class="fa-solid fa-wand-magic-sparkles ml-2"></i></button></div><div id="urlResult" class="hidden opacity-0 transition-opacity duration-500"><label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Shortened URL</label><div class="flex items-center bg-white dark:bg-slate-800 p-2 rounded-xl border border-sky-200 dark:border-sky-800 shadow-sm"><input type="text" id="shortUrlOutput" class="flex-1 p-2 bg-transparent border-none text-sky-600 dark:text-sky-400 font-bold outline-none" readonly><button onclick="copyToClipboard('shortUrlOutput')" class="bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 hover:bg-sky-200 px-4 py-2 rounded-lg font-bold text-sm transition">Copy</button></div><div class="mt-4 text-center"><img id="urlQr" class="mx-auto w-32 h-32 rounded-lg border-4 border-white shadow-sm" alt="QR Code"><p class="text-[10px] text-slate-400 mt-2">Auto-generated QR for your link</p></div></div></div>`
    },
    feeCalculator: {
        title: "Freelancer Fee Calculator",
        desc: "Calculate exactly how much to charge to cover platform fees.",
        category: "Business",
        icon: "fa-money-bill-wave",
        colorClass: "text-green-500",
        bgClass: "bg-green-100 dark:bg-green-900/30",
        html: `<div class="max-w-xl mx-auto glass p-8 rounded-2xl shadow-lg border border-white/20 fade-in"><div class="flex flex-wrap gap-2 justify-center mb-8 bg-white/30 dark:bg-slate-900/30 p-1.5 rounded-full backdrop-blur-sm inline-flex mx-auto w-full"><button onclick="setFeeMode('paypal')" id="btn-paypal" class="fee-tab flex-1 active bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full font-bold text-sm transition shadow-sm">PayPal</button><button onclick="setFeeMode('upwork')" id="btn-upwork" class="fee-tab flex-1 text-slate-600 dark:text-slate-400 px-4 py-2 rounded-full font-bold text-sm hover:bg-white/50 dark:hover:bg-slate-800/50 transition">Upwork</button><button onclick="setFeeMode('fiverr')" id="btn-fiverr" class="fee-tab flex-1 text-slate-600 dark:text-slate-400 px-4 py-2 rounded-full font-bold text-sm hover:bg-white/50 dark:hover:bg-slate-800/50 transition">Fiverr</button></div><div class="space-y-6"><div><label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">I want to earn ($)</label><div class="relative"><span class="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">$</span><input type="number" id="feeInput" class="w-full text-4xl font-bold p-4 pl-10 border-0 rounded-xl bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:ring-0 outline-none" placeholder="0.00" oninput="calculateFee()"></div></div><div class="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-6 rounded-xl space-y-4 border border-white/10"><div class="flex justify-between text-sm items-center"><span class="text-slate-500 dark:text-slate-400 font-medium">Platform Fees</span><span class="font-bold text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded" id="feeCost">$0.00</span></div><div class="border-t border-slate-300 dark:border-slate-700 pt-4"><p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Ask Client For</p><div class="flex justify-between items-end"><span class="text-3xl font-extrabold text-green-600 dark:text-green-400" id="feeTotal">$0.00</span></div></div></div></div></div>`
    },
    rateCalculator: {
        title: "Reverse Income Calculator",
        desc: "Want to earn $5k/month? Find out your required hourly rate.",
        category: "Business",
        icon: "fa-chart-line",
        colorClass: "text-cyan-500",
        bgClass: "bg-cyan-100 dark:bg-cyan-900/30",
        html: `<div class="max-w-xl mx-auto glass p-8 rounded-2xl shadow-lg border border-white/20 fade-in space-y-6"><div><label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Monthly Income Goal ($)</label><input type="number" id="incGoal" class="w-full p-3 border-0 rounded-xl bg-white/50 dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="5000" oninput="calcRate()"></div><div><label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Monthly Expenses / Overhead ($)</label><input type="number" id="incExp" class="w-full p-3 border-0 rounded-xl bg-white/50 dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="500" oninput="calcRate()"></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Billable Hours / Week</label><input type="number" id="incHours" class="w-full p-3 border-0 rounded-xl bg-white/50 dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="20" oninput="calcRate()"></div><div><label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Weeks Off / Year</label><input type="number" id="incVacation" class="w-full p-3 border-0 rounded-xl bg-white/50 dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="4" oninput="calcRate()"></div></div><div class="mt-6 bg-cyan-500/10 dark:bg-cyan-900/30 p-6 rounded-xl text-center border border-cyan-500/20"><p class="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mb-2">Hourly Rate Required</p><h3 class="text-4xl font-extrabold text-cyan-600 dark:text-cyan-400" id="incResult">$0.00 <span class="text-lg text-slate-400 font-normal">/hr</span></h3></div></div>`
    },
  invoiceGenerator: {
        title: "Freelance Invoice Gen",
        desc: "Create professional PDF invoices instantly.",
        category: "Business",
        isNew: true,
        icon: "fa-file-invoice-dollar",
        colorClass: "text-emerald-600",
        bgClass: "bg-emerald-100 dark:bg-emerald-900/30",
        html: `
        <div class="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 fade-in h-auto lg:h-[calc(100vh-140px)]">
            <div class="w-full lg:w-1/3 glass p-6 rounded-xl shadow-lg border border-white/20 overflow-y-auto custom-scrollbar flex flex-col">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-bold text-lg text-emerald-600 flex items-center"><i class="fa-solid fa-pen-to-square mr-2"></i>Edit Details</h3>
                    <div class="flex gap-2">
                        <button onclick="document.getElementById('invJsonInput').click()" class="text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300 px-2 py-1 rounded" title="Load JSON"><i class="fa-solid fa-upload"></i> Load</button>
                        <input type="file" id="invJsonInput" class="hidden" accept=".json" onchange="loadInvoiceJSON(this)">
                        <button onclick="downloadInvoiceJSON()" class="text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300 px-2 py-1 rounded" title="Save JSON"><i class="fa-solid fa-download"></i> Save</button>
                    </div>
                </div>
                
                <div class="space-y-4 flex-1">
                    <div>
                        <label class="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Design Template</label>
                        <select id="invTemplate" class="w-full p-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" onchange="updateInvoicePreview()">
                            <option value="minimal">1. Minimalist (Clean)</option>
                            <option value="corporate">2. Corporate (Dark Header)</option>
                            <option value="modern">3. Modern (Teal Accents)</option>
                        </select>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                         <div class="p-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-center hover:bg-white/50 transition cursor-pointer group relative overflow-hidden" onclick="document.getElementById('invLogoInput').click()">
                            <input type="file" id="invLogoInput" class="hidden" accept="image/*" onchange="handleInvLogo(this)">
                            <div id="invLogoStatus" class="text-[10px] text-slate-500 font-bold uppercase group-hover:text-emerald-500"><i class="fa-solid fa-image block text-lg mb-1"></i> Logo</div>
                            <img id="invLogoPreviewSmall" class="hidden h-8 w-auto mx-auto object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-100 transition">
                        </div>
                        <div class="p-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-center hover:bg-white/50 transition cursor-pointer group relative overflow-hidden" onclick="document.getElementById('invSigInput').click()">
                            <input type="file" id="invSigInput" class="hidden" accept="image/*" onchange="handleInvSig(this)">
                            <div id="invSigStatus" class="text-[10px] text-slate-500 font-bold uppercase group-hover:text-emerald-500"><i class="fa-solid fa-pen-nib block text-lg mb-1"></i> Signature</div>
                            <img id="invSigPreviewSmall" class="hidden h-8 w-auto mx-auto object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-100 transition">
                        </div>
                    </div>

                    <div class="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                        <input type="checkbox" id="invWatermark" onchange="updateInvoicePreview()" class="accent-emerald-500 w-4 h-4 rounded">
                        <label for="invWatermark" class="text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer select-none">Use Logo as Background Watermark</label>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                        <div>
                             <label class="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Invoice #</label>
                             <input type="text" id="invNum" placeholder="Inv-001" class="w-full p-2 rounded-lg border dark:border-slate-600 bg-white/50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" oninput="updateInvoicePreview()">
                        </div>
                        <div>
                             <label class="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Date</label>
                             <input type="date" id="invDate" class="w-full p-2 rounded-lg border dark:border-slate-600 bg-white/50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" oninput="updateInvoicePreview()">
                        </div>
                    </div>
                    
                    <div>
                        <label class="text-[10px] font-bold uppercase text-slate-500 mb-1 block">From (Your Details)</label>
                        <textarea id="invFrom" rows="3" placeholder="Your Name&#10;Address line 1&#10;contact@email.com" class="w-full p-2 rounded-lg border dark:border-slate-600 bg-white/50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" oninput="updateInvoicePreview()"></textarea>
                    </div>
                    
                    <div>
                        <label class="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Bill To (Client)</label>
                        <textarea id="invTo" rows="3" placeholder="Client Company&#10;123 Business Rd&#10;City, Country" class="w-full p-2 rounded-lg border dark:border-slate-600 bg-white/50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" oninput="updateInvoicePreview()"></textarea>
                    </div>

                    <div class="bg-white/40 dark:bg-slate-800/40 p-3 rounded-xl border border-white/20">
                        <label class="text-[10px] font-bold uppercase text-slate-500 mb-2 flex justify-between items-center">
                            <span>Line Items</span>
                            <button onclick="addInvItem()" class="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded hover:bg-emerald-200 transition">
                                <i class="fa-solid fa-plus"></i> Add
                            </button>
                        </label>
                        <div id="invItemsInput" class="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                            </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Tax Rate %</label>
                            <input type="number" id="invTaxRate" value="0" class="w-full p-2 rounded-lg border dark:border-slate-600 bg-white/50 dark:bg-slate-800 text-sm text-right" oninput="updateInvoicePreview()">
                        </div>
                        <div>
                            <label class="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Currency</label>
                            <select id="invCurrency" class="w-full p-2 rounded-lg border dark:border-slate-600 bg-white/50 dark:bg-slate-800 text-sm" onchange="updateInvoicePreview()">
                                <option value="$">$ USD</option>
                                <option value="€">€ EUR</option>
                                <option value="£">£ GBP</option>
                                <option value="৳">৳ BDT</option>
                                <option value="₹">₹ INR</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button onclick="downloadInvoicePDF()" class="mt-4 w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center">
                    <i class="fa-solid fa-file-pdf mr-2"></i> Download PDF
                </button>
            </div>

            <div class="w-full lg:w-2/3 bg-slate-200 dark:bg-slate-900/50 rounded-xl p-4 lg:p-8 overflow-y-auto flex justify-center items-start shadow-inner">
                <div id="invoicePreview" class="bg-white text-slate-800 w-[210mm] min-h-[297mm] shadow-2xl relative text-sm origin-top scale-[0.6] sm:scale-[0.8] md:scale-100 transition-transform overflow-hidden">
                    </div>
            </div>
        </div>
        `
    },
    jsonCsv: {
        title: "JSON to CSV Converter",
        desc: "Flatten complex JSON data into readable spreadsheets.",
        category: "Developer",
        icon: "fa-file-code",
        colorClass: "text-yellow-500",
        bgClass: "bg-yellow-100 dark:bg-yellow-900/30",
        html: `<div class="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 h-auto md:h-[calc(100vh-250px)] fade-in"><div class="flex flex-col min-h-[300px] glass p-4 rounded-xl shadow-lg border border-white/20"><label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">JSON Input</label><textarea id="jsonInput" class="flex-1 w-full p-4 border-0 rounded-lg bg-white/50 dark:bg-slate-900/50 dark:text-white font-mono text-xs resize-none focus:ring-2 focus:ring-yellow-500 outline-none" placeholder='[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]'></textarea></div><div class="flex flex-col min-h-[300px] glass p-4 rounded-xl shadow-lg border border-white/20"><div class="flex justify-between items-center mb-2"><label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">CSV Output</label><button onclick="convertJsonToCsv()" class="text-xs bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-3 py-1.5 rounded-lg shadow-md transition">Convert JSON</button></div><textarea id="csvOutput" class="flex-1 w-full p-4 border-0 rounded-lg bg-slate-900 text-green-400 font-mono text-xs resize-none" readonly></textarea></div></div>`
    },
    textUtils: {
        title: "Text String Utilities",
        desc: "Case conversion and Slug generation for developers and gamers.",
        category: "Developer",
        icon: "fa-font",
        colorClass: "text-gray-500",
        bgClass: "bg-gray-100 dark:bg-gray-800",
        html: `<div class="max-w-3xl mx-auto glass p-8 rounded-2xl shadow-lg border border-white/20 fade-in space-y-6"><input type="text" id="strInput" class="w-full text-lg p-4 border-0 rounded-xl bg-white/50 dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-gray-500 outline-none shadow-inner" placeholder="Type or paste text here..." oninput="processString()"><div class="grid gap-3"><div class="flex items-center bg-white/40 dark:bg-slate-800/40 p-2 rounded-lg"><span class="w-20 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase pl-2">Slug</span><input type="text" id="outSlug" class="flex-1 p-2 bg-transparent border-none text-sm font-mono dark:text-white focus:ring-0" readonly><button onclick="copyToClipboard('outSlug')" class="p-2 text-slate-400 hover:text-primary"><i class="fa-solid fa-copy"></i></button></div><div class="flex items-center bg-white/40 dark:bg-slate-800/40 p-2 rounded-lg"><span class="w-20 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase pl-2">UPPER</span><input type="text" id="outUpper" class="flex-1 p-2 bg-transparent border-none text-sm font-mono dark:text-white focus:ring-0" readonly><button onclick="copyToClipboard('outUpper')" class="p-2 text-slate-400 hover:text-primary"><i class="fa-solid fa-copy"></i></button></div><div class="flex items-center bg-white/40 dark:bg-slate-800/40 p-2 rounded-lg"><span class="w-20 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase pl-2">lower</span><input type="text" id="outLower" class="flex-1 p-2 bg-transparent border-none text-sm font-mono dark:text-white focus:ring-0" readonly><button onclick="copyToClipboard('outLower')" class="p-2 text-slate-400 hover:text-primary"><i class="fa-solid fa-copy"></i></button></div><div class="flex items-center bg-white/40 dark:bg-slate-800/40 p-2 rounded-lg"><span class="w-20 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase pl-2">Camel</span><input type="text" id="outCamel" class="flex-1 p-2 bg-transparent border-none text-sm font-mono dark:text-white focus:ring-0" readonly><button onclick="copyToClipboard('outCamel')" class="p-2 text-slate-400 hover:text-primary"><i class="fa-solid fa-copy"></i></button></div><div class="flex items-center bg-white/40 dark:bg-slate-800/40 p-2 rounded-lg"><span class="w-20 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase pl-2">Sponge</span><input type="text" id="outSponge" class="flex-1 p-2 bg-transparent border-none text-sm font-mono dark:text-white focus:ring-0" readonly><button onclick="copyToClipboard('outSponge')" class="p-2 text-slate-400 hover:text-primary"><i class="fa-solid fa-copy"></i></button></div></div></div>`
    },
    passwordGenerator: {
        title: "Secure Password Gen",
        desc: "Generate strong, random passwords instantly.",
        category: "Security",
        icon: "fa-shield-halved",
        colorClass: "text-rose-500",
        bgClass: "bg-rose-100 dark:bg-rose-900/30",
        html: `<div class="max-w-xl mx-auto glass p-8 rounded-2xl shadow-lg border border-white/20 fade-in text-center"><div class="mb-6"><div class="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4"><i class="fa-solid fa-lock text-3xl"></i></div><h3 class="text-2xl font-bold dark:text-white">Generate Secure Password</h3></div><div class="relative mb-6"><input type="text" id="passOutput" class="w-full p-4 text-center text-xl font-mono font-bold rounded-xl border-2 border-rose-100 dark:border-rose-900 bg-white dark:bg-slate-900 dark:text-white outline-none" readonly placeholder="Click Generate"><button onclick="copyToClipboard('passOutput')" class="absolute right-2 top-2 bottom-2 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg text-sm font-bold text-slate-600 transition">Copy</button></div><div class="flex gap-4 justify-center mb-6"><label class="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400"><input type="checkbox" id="passSpecial" checked class="accent-rose-500 rounded"> <span>Symbols (!@#)</span></label><label class="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400"><input type="checkbox" id="passNumbers" checked class="accent-rose-500 rounded"> <span>Numbers (123)</span></label></div><button onclick="generatePass()" class="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition-all"><i class="fa-solid fa-arrows-rotate mr-2"></i> Generate Password</button></div>`
    },
    qrGenerator: {
        title: "QR Suite (Gen & Scan)",
        desc: "Generate colorful QR codes or Scan existing ones.",
        category: "Media",
        icon: "fa-qrcode",
        colorClass: "text-emerald-500",
        bgClass: "bg-emerald-100 dark:bg-emerald-900/30",
        html: `
            <div class="max-w-4xl mx-auto fade-in">
                <div class="flex justify-center mb-8">
                    <div class="bg-white/50 dark:bg-slate-800/50 p-1 rounded-xl flex shadow-sm">
                        <button onclick="setQrMainMode('generate')" id="btn-qr-gen" class="px-6 py-2 rounded-lg text-sm font-bold bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400 transition-all">Generate</button>
                        <button onclick="setQrMainMode('scan')" id="btn-qr-scan" class="px-6 py-2 rounded-lg text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-600/50 transition-all">Scanner</button>
                    </div>
                </div>

                <div id="qr-mode-generate" class="grid md:grid-cols-2 gap-8">
                    <div class="glass p-8 rounded-2xl shadow-lg border border-white/20 space-y-6">
                        <div class="flex gap-2 p-1 bg-white/30 dark:bg-slate-800/30 rounded-lg">
                            <button onclick="setQrMode('url')" id="qr-tab-url" class="flex-1 py-2 text-sm font-bold rounded-md bg-white dark:bg-slate-700 shadow-sm transition">URL/Text</button>
                            <button onclick="setQrMode('wifi')" id="qr-tab-wifi" class="flex-1 py-2 text-sm font-bold rounded-md text-slate-500 transition">WiFi</button>
                        </div>

                        <div id="qr-input-url">
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Content</label>
                            <input type="text" id="qrText" class="w-full p-3 border-0 rounded-xl bg-white/50 dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="https://example.com" value="https://example.com">
                        </div>

                        <div id="qr-input-wifi" class="hidden space-y-4">
                            <div>
                                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Network Name (SSID)</label>
                                <input type="text" id="wifiSsid" class="w-full p-3 border-0 rounded-xl bg-white/50 dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="MyWiFi">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password</label>
                                <input type="text" id="wifiPass" class="w-full p-3 border-0 rounded-xl bg-white/50 dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="password123">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Security</label>
                                <select id="wifiType" class="w-full p-3 border-0 rounded-xl bg-white/50 dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                                    <option value="WPA">WPA/WPA2</option>
                                    <option value="WEP">WEP</option>
                                    <option value="nopass">No Encryption</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Dark Color</label>
                                <input type="color" id="qrDark" class="w-full h-12 rounded-lg cursor-pointer border-0 bg-transparent" value="#0f172a">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Light Color</label>
                                <input type="color" id="qrLight" class="w-full h-12 rounded-lg cursor-pointer border-0 bg-transparent" value="#ffffff">
                            </div>
                        </div>
                        
                        <button onclick="generateQR()" class="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                            Generate QR Code
                        </button>
                    </div>

                    <div class="flex flex-col items-center justify-center glass p-8 rounded-2xl shadow-lg border border-white/20">
                        <div id="qrcode" class="border-4 border-white dark:border-slate-800 p-4 bg-white rounded-xl shadow-inner mb-6"></div>
                        <button onclick="downloadQR()" id="qrDownloadBtn" class="hidden bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-lg font-bold shadow-md transition">
                            <i class="fa-solid fa-download mr-2"></i> Download
                        </button>
                    </div>
                </div>

                <div id="qr-mode-scan" class="hidden max-w-2xl mx-auto">
                    <div class="glass p-8 rounded-2xl shadow-lg border border-white/20 text-center">
                        <h3 class="text-xl font-bold mb-4 dark:text-white">Upload QR Code to Scan</h3>
                        
                        <div class="border-2 border-dashed border-emerald-300 dark:border-emerald-900/50 rounded-xl p-10 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition group" onclick="document.getElementById('qrScanInput').click()">
                            <i class="fa-solid fa-expand text-4xl text-emerald-500 mb-3 group-hover:scale-110 transition-transform"></i>
                            <p class="text-sm text-slate-500 dark:text-slate-400">Click to select image</p>
                            <input type="file" id="qrScanInput" class="hidden" accept="image/*" onchange="handleQRScan(this)">
                        </div>

                        <div id="qrScanResult" class="hidden mt-6 p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl text-left break-all">
                            <p class="text-xs font-bold uppercase text-slate-500 mb-1">Result:</p>
                            <p id="qrScanText" class="text-lg font-mono text-emerald-600 dark:text-emerald-400"></p>
                            <button onclick="copyToClipboard('qrScanText')" class="mt-2 text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded hover:bg-emerald-200">Copy</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
};

// --- Logic: Welcome Screen (Updated for Animation & Structure) ---

function filterDashboard() {
    const query = document.getElementById('dashboardSearch').value.toLowerCase();
    const categories = document.querySelectorAll('[id^="cat-"]');

    categories.forEach(catSection => {
        const cards = catSection.querySelectorAll('.tool-card');
        let hasVisibleCards = false;

        cards.forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase();
            const desc = card.querySelector('p').innerText.toLowerCase();
            
            // Check visibility using display property
            const isVisible = title.includes(query) || desc.includes(query);
            
            if (isVisible) {
                // Must ensure it's displayed, Tailwind utility 'flex' is correct here
                card.style.display = "flex"; 
                card.classList.remove('hidden');
                hasVisibleCards = true;
            } else {
                card.classList.add('hidden');
                card.style.display = "none"; // Ensure absolute hiding
            }
        });

        if (hasVisibleCards) {
            catSection.classList.remove('hidden');
            catSection.style.display = "block";
        } else {
            catSection.classList.add('hidden');
            catSection.style.display = "none";
        }
    });
}

function loadWelcomeScreen() {
    const workspace = document.getElementById('workspace');
    const titleEl = document.getElementById('tool-title');
    const descEl = document.getElementById('tool-desc');
    
    titleEl.textContent = "Dashboard";
    descEl.textContent = "Select a tool to get started.";

    if(!sidebar.classList.contains('-translate-x-full') && window.innerWidth < 768) {
        toggleSidebar();
    }

    const categories = {};
    Object.keys(tools).forEach(key => {
        const tool = tools[key];
        const catName = tool.category || "Other";
        if (!categories[catName]) categories[catName] = [];
        categories[catName].push({ key, ...tool });
    });

    // START: Dynamic generation of the entire Dashboard content (All 16 tools)
    let html = `
        <div class="max-w-7xl mx-auto pb-10">
            <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 shadow-2xl mb-12 p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 fade-in">
                <div class="z-10 max-w-2xl">
                    <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">
                        <span class="block text-white/90 text-lg font-bold uppercase tracking-widest mb-2">Welcome to</span>
                        ZenTool Suite
                    </h1>
                    <p class="text-indigo-100 text-lg md:text-xl font-medium mb-8 leading-relaxed max-w-lg">
                        Your ultimate digital swiss army knife. Create, convert, and calculate everything in one place.
                    </p>
                    <div class="relative max-w-md w-full mb-8 shadow-xl">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <i class="fa-solid fa-magnifying-glass text-indigo-200"></i>
                        </div>
                        <input type="text" id="dashboardSearch" oninput="filterDashboard()" 
                            class="block w-full p-4 pl-11 text-sm text-white border border-white/20 rounded-xl bg-white/10 placeholder-indigo-200 focus:ring-4 focus:ring-white/30 focus:border-white backdrop-blur-md transition-all outline-none" 
                            placeholder="Find a tool (e.g., 'PDF', 'QR Code')...">
                    </div>
                    <div class="flex flex-wrap gap-3 justify-center md:justify-start">
                        ${Object.keys(categories).map(cat => `
                            <a href="#cat-${cat.replace(/\s+/g, '-')}" class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm font-bold backdrop-blur-sm transition-all border border-white/10 hover:scale-105">
                                ${cat}
                            </a>
                        `).join('')}
                    </div>
                </div>
                <div class="relative z-0">
                    <img src="logo.svg" class="w-48 h-48 md:w-64 md:h-64 drop-shadow-2xl animate-float">
                    <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-pink-500/30 rounded-full blur-xl animate-pulse-slow"></div>
                    <div class="absolute -top-4 -left-4 w-32 h-32 bg-blue-500/30 rounded-full blur-xl animate-pulse-slow delay-75"></div>
                </div>
            </div>
            
            <div class="space-y-12">
    `;

    let delayCounter = 0;

    Object.keys(categories).forEach(cat => {
        const safeCat = cat.replace(/\s+/g, '-');
        html += `
            <div id="cat-${safeCat}" class="scroll-mt-24">
                <div class="flex items-center gap-4 mb-6">
                    <h2 class="text-2xl font-bold text-slate-800 dark:text-white">${cat}</h2>
                    <div class="h-px flex-1 bg-gradient-to-r from-slate-200 dark:from-slate-700 to-transparent"></div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        `;

        categories[cat].forEach(tool => {
            const delay = delayCounter * 0.05;
            html += `
                <div onclick="loadTool('${tool.key}')" 
                     style="animation-delay: ${delay}s"
                     class="slide-up-item cursor-pointer p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 shadow-sm hover:shadow-xl hover:shadow-primary/10 tool-card flex flex-col items-start group relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-slate-50 dark:to-slate-700/50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
                    <div class="w-12 h-12 rounded-xl ${tool.bgClass} ${tool.colorClass} flex items-center justify-center mb-4 text-xl shadow-inner group-hover:scale-110 transition-transform duration-300 z-10">
                        <i class="fa-solid ${tool.icon}"></i>
                    </div>
                    <h3 class="font-bold text-lg text-slate-800 dark:text-white mb-2 z-10 group-hover:text-primary transition-colors">${tool.title}</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 z-10">${tool.desc}</p>
                    <div class="mt-auto flex items-center text-xs font-bold text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        Launch Tool <i class="fa-solid fa-arrow-right ml-2"></i>
                    </div>
                </div>
            `;
            delayCounter++;
        });

        html += `</div></div>`;
    });
    
    html += `</div>`; // Close space-y-12 div

    // About Section (SEO Content - Must match index.html for crawler)
    html += `
        <div class="mt-16 p-8 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-200 dark:border-slate-700/50">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-4">About ZenTool Suite</h2>
            <p class="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                ZenTool is a comprehensive collection of free online utilities designed for freelancers, developers, and content creators. 
                Unlike other services, ZenTool operates as a <strong>Zero-Backend utility</strong>, meaning your files (images, PDFs, documents) 
                are processed entirely within your web browser. This ensures your data never leaves your device, providing maximum privacy and security.
            </p>
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                Whether you need to generate a freelance invoice, convert a HEIC image to JPG, or create a professional CV, 
                ZenTool offers a fast, ad-supported free solution without the need for sign-ups or subscriptions.
            </p>
        </div>
    `;

    html += `</div>`; // Close max-w-7xl div
    // END: Dynamic generation

    workspace.innerHTML = html;
    
    // Attach listener to search bar after it's rendered
    const searchInput = document.getElementById('dashboardSearch');
    if (searchInput) {
        searchInput.addEventListener('input', filterDashboard);
    }
}

// Global variable to hold the original loadTool function reference
let originalLoadTool;

function initializeLoadTool() {
    // Check if we have defined loadTool globally yet
    if (typeof loadTool === 'undefined') {
        window.loadTool = function(toolKey) {
            startProgress();
            
            const workspace = document.getElementById('workspace');
            const tool = tools[toolKey];
            const titleEl = document.getElementById('tool-title');
            const descEl = document.getElementById('tool-desc');

            if(!sidebar.classList.contains('-translate-x-full') && window.innerWidth < 768) {
                toggleSidebar();
            }
            
            if(toolKey === 'imageConverter') currentImageBlob = null;
            if(toolKey === 'pdfArchitect') currentPdfFile = null;
            if(toolKey === 'cvBuilder') cvPhotoData = null;

            titleEl.textContent = tool.title;
            descEl.textContent = tool.desc;
            workspace.innerHTML = tool.html;

            // Tool-specific Initialization
            if(toolKey === 'qrGenerator') {
               loadScript("https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js").then(() => {
                    generateQR();
                    endProgress();
               }).catch(() => {
                    console.error("Failed to load QR library.");
                    endProgress();
               });
            } else if (toolKey === 'cvBuilder') {
                setTimeout(() => {
                    updateCVPreview();
                    endProgress();
                }, 100);
            }
            else if (toolKey === 'invoiceGenerator') {
                // Check if html2canvas and jspdf are loaded globally before initInvoice
                loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js").then(() => {
                    initInvoice();
                    endProgress();
                }).catch(() => {
                    console.error("Failed to load html2canvas library.");
                    initInvoice();
                    endProgress();
                });
            }
            else if (toolKey === 'textHumanizer') {
                 // The promise is handled inside runHumanizer on click, just end progress here
                 setTimeout(endProgress, 300);
            }
            else {
                setTimeout(endProgress, 300);
            }
        };
        // Store reference to the newly defined global loadTool
        originalLoadTool = window.loadTool;
    } else {
        // Handle the case where the function might have been previously overridden (like for invoiceGenerator)
        // Ensure that any custom logic (like initInvoice) runs after the main tool loading logic.
        const originalLogic = window.loadTool;
        window.loadTool = function(toolKey) {
             originalLogic(toolKey);
             if (toolKey === 'invoiceGenerator') setTimeout(initInvoice, 100);
        };
        originalLoadTool = window.loadTool; // Update the reference if needed
    }
}

window.onload = function() {
    // 1. Initialize the Load Tool function
    initializeLoadTool(); 

    // 2. Load the full dashboard using JS (replaces the static 6-tool HTML with 16 tools)
    loadWelcomeScreen();
    
    // 3. Set theme (done outside of loadWelcomeScreen to be cleaner)
    if (localStorage.getItem('theme') === 'dark') {
        html.classList.add('dark');
    }
};

// --- Core Functions (kept mostly the same for stability, but ensuring scope) ---

// Defining loadTool globally for accessibility, overridden above for initialization logic
function loadTool(toolKey) {
    // This function will be properly defined and overridden in initializeLoadTool()
    // It exists here only to satisfy the HTML calls before JS initialization fully runs
    console.warn("loadTool not fully initialized yet. Attempting late execution.");
    if (originalLoadTool) originalLoadTool(toolKey);
}

function copyToClipboard(elementId) {
    const el = document.getElementById(elementId);
    let textToCopy;

    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.select();
        document.execCommand('copy');
    } else {
        textToCopy = el.innerText;
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
    
    const btn = event.target.closest('button');
    if(btn) {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
        setTimeout(() => {
            btn.innerHTML = originalHtml;
        }, 1000);
    }
}

// --- 1. HUMANIZER LOGIC (Browser AI) ---
let humanizerPipeline = null;

async function runHumanizer() {
    const text = document.getElementById('humanizerInput').value;
    if (!text) return alert("Please enter some text!");

    const statusEl = document.getElementById('aiModelStatus');
    const progressEl = document.getElementById('aiProgressBar');
    const progressText = document.getElementById('aiProgressText');
    const outputEl = document.getElementById('humanizerOutput');
    const btn = document.getElementById('btnHumanize');

    btn.disabled = true;
    btn.innerHTML = '<div class="loader !w-4 !h-4 !border-white mr-2"></div> Processing...';
    
    try {
        if (!humanizerPipeline) {
            statusEl.classList.remove('hidden');
            // Dynamically import Xenova library
            const { pipeline, env } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.16.0');
            env.allowLocalModels = false;
            env.useBrowserCache = true;

            humanizerPipeline = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-77M', {
                progress_callback: (data) => {
                    if (data.status === 'progress') {
                        const pct = Math.round(data.progress * 100);
                        progressEl.style.width = pct + "%";
                        progressText.innerText = pct + "%";
                        if (pct === 100) setTimeout(() => statusEl.classList.add('hidden'), 1000);
                    }
                }
            });
        }

        const result = await humanizerPipeline("Rewrite this text to be more natural and human-like: " + text, {
            max_new_tokens: 256,
            temperature: 0.9,
            repetition_penalty: 1.2
        });

        outputEl.value = result[0].generated_text;

    } catch (e) {
        console.error(e);
        alert("AI Error: " + e.message + ". Please use a modern browser (Chrome/Edge).");
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-stars mr-2"></i> Humanize Text';
    }
}

// --- 2. PDF ARCHITECT LOGIC ---
let currentPdfFile = null;
let currentPdfType = null;
let pdfMode = 'pdf';

function setPdfMode(mode) {
    pdfMode = mode;
    const btnPdf = document.getElementById('btn-mode-pdf');
    const btnOffice = document.getElementById('btn-mode-office');
    const contentPdf = document.getElementById('mode-pdf-content');
    const contentOffice = document.getElementById('mode-office-content');

    if(mode === 'pdf') {
        btnPdf.className = "px-6 py-2 rounded-lg text-sm font-bold bg-white dark:bg-slate-700 shadow-sm text-red-600 dark:text-red-400 transition-all";
        btnOffice.className = "px-6 py-2 rounded-lg text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-600/50 transition-all";
        contentPdf.classList.remove('hidden');
        contentOffice.classList.add('hidden');
    } else {
        btnOffice.className = "px-6 py-2 rounded-lg text-sm font-bold bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400 transition-all";
        btnPdf.className = "px-6 py-2 rounded-lg text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-600/50 transition-all";
        contentOffice.classList.remove('hidden');
        contentPdf.classList.add('hidden');
    }
}

function handlePdfUpload(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        currentPdfFile = file;
        document.getElementById('pdfFileName').textContent = file.name;
        document.getElementById('pdfActionArea').classList.remove('hidden');
        
        if(file.name.toLowerCase().endsWith('.docx')) currentPdfType = 'docx';
        else if(file.type.startsWith('image/')) currentPdfType = 'image';
        else if(file.name.toLowerCase().endsWith('.txt')) currentPdfType = 'txt';
    }
}

async function generatePDF() {
    if(!currentPdfFile) return;
    startProgress();

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        if (currentPdfType === 'docx') {
            // Mammoth library is pre-loaded in index.html
            
            const arrayBuffer = await currentPdfFile.arrayBuffer();
            const result = await mammoth.convertToHtml({arrayBuffer: arrayBuffer});
            const html = result.value;
            const container = document.getElementById('hidden-render-container');
            container.innerHTML = html;
            
            await doc.html(container, {
                callback: function(doc) {
                    doc.save(currentPdfFile.name.replace('.docx', '.pdf'));
                    container.innerHTML = '';
                    endProgress();
                },
                x: 10, y: 10, width: 190, windowWidth: 800
            });
        } 
        else if (currentPdfType === 'image') {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = function() {
                    const pageWidth = 210;
                    const pageHeight = 297;
                    const imgRatio = img.width / img.height;
                    let w = pageWidth - 20; 
                    let h = w / imgRatio;
                    if(h > pageHeight - 20) { h = pageHeight - 20; w = h * imgRatio; }
                    doc.addImage(img, 'JPEG', 10, 10, w, h);
                    doc.save(currentPdfFile.name.split('.')[0] + '.pdf');
                    endProgress();
                }
            };
            reader.readAsDataURL(currentPdfFile);
        }
        else if (currentPdfType === 'txt') {
            const text = await currentPdfFile.text();
            const splitText = doc.splitTextToSize(text, 180);
            doc.text(splitText, 15, 15);
            doc.save(currentPdfFile.name.replace('.txt', '.pdf'));
            endProgress();
        }

    } catch (e) {
        console.error(e);
        alert("Error converting file. Please ensure it is a valid format and the mammoth library loaded.");
        endProgress();
    }
}

function exportToOffice(type) {
    startProgress();
    if (type === 'word') {
        const content = document.getElementById('wordContent').value;
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
                    "xmlns:w='urn:schemas-microsoft-com:office:word' "+
                    "xmlns='http://www.w3.org/TR/REC-html40'>"+
                    "<head><meta charset='utf-8'></head><body>";
        const footer = "</body></html>";
        const sourceHTML = header + content.replace(/\n/g, "<br>") + footer;
        
        const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        const fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = 'document.doc';
        fileDownload.click();
        document.body.removeChild(fileDownload);
    } else if (type === 'excel') {
        try {
            const jsonStr = document.getElementById('excelContent').value;
            const jsonObj = JSON.parse(jsonStr);
            if (!Array.isArray(jsonObj)) throw new Error("Not array");

            let csv = Object.keys(jsonObj[0]).join('\t') + '\n';
            jsonObj.forEach(row => {
                csv += Object.values(row).join('\t') + '\n';
            });

            const source = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(csv);
            const fileDownload = document.createElement("a");
            document.body.appendChild(fileDownload);
            fileDownload.href = source;
            fileDownload.download = 'data.xls';
            fileDownload.click();
            document.body.removeChild(fileDownload);
        } catch(e) {
            alert("Invalid JSON for Excel export. Please use format: [{\"Col1\":\"Val1\"}]");
        }
    }
    endProgress();
}

// --- 3. DocuSmith Logic ---
function exportDoc(type) {
    startProgress();
    const content = document.getElementById('docInput').value;
    if(!content) {
        alert("Please enter some text first.");
        endProgress();
        return;
    }

    if(type === 'pdf') {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const splitText = doc.splitTextToSize(content, 180);
        doc.text(splitText, 15, 15);
        doc.save("document.pdf");
        endProgress();
    } 
    else if (type === 'word') {
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
                    "xmlns:w='urn:schemas-microsoft-com:office:word' "+
                    "xmlns='http://www.w3.org/TR/REC-html40'>"+
                    "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></" + "head><" + "body>";
        const footer = "</" + "body></" + "html>";
        const sourceHTML = header+content.replace(/\n/g, "<br>")+footer;
        
        const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        const fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = 'document.doc';
        fileDownload.click();
        document.body.removeChild(fileDownload);
        endProgress();
    }
    else if (type === 'txt') {
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "document.txt";
        link.click();
        endProgress();
    }
}

// --- 4. Image Converter Logic ---
let currentImageBlob = null;
let originalFileName = "image";

async function handleImageUpload(input) {
    startProgress();
    if (input.files && input.files[0]) {
        const file = input.files[0];
        originalFileName = file.name.split('.')[0];
        
        if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
            const loading = document.getElementById('loadingIndicator');
            loading.classList.remove('hidden');
            
            try {
                // heic2any is pre-loaded in index.html
                
                const blob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.8 });
                const url = URL.createObjectURL(Array.isArray(blob) ? blob[0] : blob);
                
                document.getElementById('imgPreviewArea').classList.remove('hidden');
                document.getElementById('previewImg').src = url;
                currentImageBlob = url;
            } catch (e) {
                alert("Could not convert HEIC. Please use a standard JPG or PNG.");
                console.error(e);
            } finally {
                loading.classList.add('hidden');
                endProgress();
            }
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imgPreviewArea').classList.remove('hidden');
            document.getElementById('previewImg').src = e.target.result;
            currentImageBlob = e.target.result;
            endProgress();
        }
        reader.readAsDataURL(file);
    } else {
        endProgress();
    }
}

function convertImage() {
    if(!currentImageBlob) return;
    startProgress();
    
    setTimeout(() => { 
        const format = document.getElementById('convertFormat').value;
        const img = new Image();
        img.crossOrigin = "Anonymous";
        
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            
            if (format === 'image/jpeg') {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            
            ctx.drawImage(img, 0, 0);
            
            try {
                const dataUrl = canvas.toDataURL(format);
                const link = document.createElement('a');
                const ext = format.split('/')[1] === 'jpeg' ? 'jpg' : format.split('/')[1];
                link.download = `${originalFileName}_converted.${ext}`;
                link.href = dataUrl;
                link.click();
                endProgress();
            } catch(e) {
                alert("Conversion failed. The image might be too large or corrupted.");
                endProgress();
            }
        };
        img.src = currentImageBlob;
    }, 100);
}

// --- 5. Bio Styler Logic ---
const fontMaps = {
    bold: "𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙",
    italic: "𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡",
    script: "𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜𝐵𝒞𝒟𝐸𝒯𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵",
    normal: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
};

function generateBioStyles() {
    const input = document.getElementById('bioInput').value;
    const outputArea = document.getElementById('bioOutputs');
    outputArea.innerHTML = '';

    if(!input) return;

    const styles = ['bold', 'italic', 'script'];
    const labels = ['Bold', 'Italic', 'Tattoo/Script'];

    styles.forEach((style, index) => {
        let converted = input.split('').map(char => {
            const idx = fontMaps.normal.indexOf(char);
            return idx !== -1 ? Array.from(fontMaps[style])[idx] : char;
        }).join('');

        outputArea.innerHTML += `
            <div class="bg-white/50 dark:bg-slate-800/50 p-4 border dark:border-slate-600 rounded-lg flex justify-between items-center hover:bg-white dark:hover:bg-slate-700/50 transition-colors">
                <div>
                    <span class="text-xs text-slate-400 font-bold uppercase">${labels[index]}</span>
                    <p class="text-lg text-slate-800 dark:text-slate-200" id="style-${style}">${converted}</p>
                </div>
                <button onclick="copyToClipboard('style-${style}')" class="text-slate-400 hover:text-primary"><i class="fa-solid fa-copy"></i></button>
            </div>
        `;
    });
}

// --- 6. AI Prompt Logic ---
function generatePrompt() {
    const base = document.getElementById('aiBase').value;
    const style = document.getElementById('aiStyle').value;
    const ratio = document.getElementById('aiRatio').value;
    
    if(!base) return;

    startProgress(); 

    setTimeout(() => {
        let modifiers = "";
        
        switch(style) {
            case 'photo': modifiers = "photorealistic, 8k, highly detailed, cinematic lighting, shot on 35mm lens, depth of field, sharp focus, unreal engine 5 render"; break;
            case 'cyberpunk': modifiers = "cyberpunk city style, neon lights, futuristic, high tech, synthwave color palette, volumetric fog, glitch art aesthetic, blade runner vibe"; break;
            case 'painting': modifiers = "oil painting, textured canvas, visible brushstrokes, classical art style, dramatic lighting, masterpiece, artstation trends"; break;
            case '3d': modifiers = "3D render, Pixar style, disney animation style, clay material, smooth lighting, octane render, cute, vibrant colors"; break;
            case 'sketch': modifiers = "charcoal sketch, pencil drawing, monochrome, minimalist lines, white background, high contrast, technical drawing"; break;
        }

        const final = `/imagine prompt: ${base}, ${modifiers} ${ratio} --v 5`;
        document.getElementById('aiResult').value = final;
        endProgress();
    }, 800);
}

// --- 7. Fee Calculator Logic ---
let feeMode = 'paypal';

function setFeeMode(mode) {
    feeMode = mode;
    document.querySelectorAll('.fee-tab').forEach(el => {
        el.className = "fee-tab flex-1 text-slate-600 dark:text-slate-400 px-4 py-2 rounded-full font-bold text-sm hover:bg-white/50 dark:hover:bg-slate-800/50 transition";
    });
    const btn = document.getElementById(`btn-${mode}`);
    btn.className = "fee-tab active flex-1 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full font-bold text-sm transition shadow-sm";
    
    calculateFee();
}

function calculateFee() {
    const amount = parseFloat(document.getElementById('feeInput').value) || 0;
    let total = 0;
    let fee = 0;

    if (feeMode === 'paypal') {
        total = (amount + 0.49) / (1 - 0.0349);
        fee = total - amount;
    } else if (feeMode === 'upwork') {
        total = amount / 0.9;
        fee = total - amount;
    } else if (feeMode === 'fiverr') {
        total = amount / 0.8;
        fee = total - amount;
    }

    document.getElementById('feeCost').innerText = '$' + fee.toFixed(2);
    document.getElementById('feeTotal').innerText = '$' + total.toFixed(2);
}

// --- 8. QR Generator & Scanner Logic ---
let qrMode = 'url';
let qrMainMode = 'generate';

function setQrMainMode(mode) {
    qrMainMode = mode;
    const btnGen = document.getElementById('btn-qr-gen');
    const btnScan = document.getElementById('btn-qr-scan');
    const contentGen = document.getElementById('qr-mode-generate');
    const contentScan = document.getElementById('qr-mode-scan');

    if (mode === 'generate') {
        btnGen.className = "px-6 py-2 rounded-lg text-sm font-bold bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400 transition-all";
        btnScan.className = "px-6 py-2 rounded-lg text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-600/50 transition-all";
        contentGen.classList.remove('hidden');
        contentScan.classList.add('hidden');
    } else {
        // Load jsQR only when the scanner is selected
        loadScript("https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js")
            .catch(() => console.error("Failed to load scanner library"));

        btnScan.className = "px-6 py-2 rounded-lg text-sm font-bold bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400 transition-all";
        btnGen.className = "px-6 py-2 rounded-lg text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-600/50 transition-all";
        contentScan.classList.remove('hidden');
        contentGen.classList.add('hidden');
    }
}

function setQrMode(mode) {
    qrMode = mode;
    document.getElementById('qr-tab-url').className = mode === 'url' ? 'flex-1 py-2 text-sm font-bold rounded-md bg-white dark:bg-slate-700 shadow-sm transition' : 'flex-1 py-2 text-sm font-bold rounded-md text-slate-500 transition';
    document.getElementById('qr-tab-wifi').className = mode === 'wifi' ? 'flex-1 py-2 text-sm font-bold rounded-md bg-white dark:bg-slate-700 shadow-sm transition' : 'flex-1 py-2 text-sm font-bold rounded-md text-slate-500 transition';
    
    if(mode === 'url') {
        document.getElementById('qr-input-url').classList.remove('hidden');
        document.getElementById('qr-input-wifi').classList.add('hidden');
    } else {
        document.getElementById('qr-input-url').classList.add('hidden');
        document.getElementById('qr-input-wifi').classList.remove('hidden');
    }
}

function generateQR() {
    let text = "";
    const dark = document.getElementById('qrDark').value;
    const light = document.getElementById('qrLight').value;
    const container = document.getElementById('qrcode');
    
    if (qrMode === 'url') {
        text = document.getElementById('qrText').value;
    } else {
        const ssid = document.getElementById('wifiSsid').value;
        const pass = document.getElementById('wifiPass').value;
        const type = document.getElementById('wifiType').value;
        text = `WIFI:S:${ssid};T:${type};P:${pass};;`;
    }

    container.innerHTML = "";
    document.getElementById('qrDownloadBtn').classList.add('hidden');

    if(text && typeof QRCode !== 'undefined') {
        new QRCode(container, {
            text: text,
            width: 200,
            height: 200,
            colorDark : dark,
            colorLight : light,
            correctLevel : QRCode.CorrectLevel.H
        });
        
        setTimeout(() => {
            const img = container.querySelector('img');
            if(img) document.getElementById('qrDownloadBtn').classList.remove('hidden');
        }, 100);
    }
}

function downloadQR() {
    const container = document.getElementById('qrcode');
    const img = container.querySelector('img');
    if(img) {
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = img.src;
        link.click();
    }
}

function handleQRScan(input) {
    if (input.files && input.files[0]) {
        startProgress();
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0, img.width, img.height);
                
                try {
                    if (typeof jsQR === 'undefined') {
                        throw new Error("jsQR library not loaded");
                    }
                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height, {
                        inversionAttempts: "dontInvert",
                    });

                    if (code) {
                        document.getElementById('qrScanResult').classList.remove('hidden');
                        document.getElementById('qrScanText').innerText = code.data;
                    } else {
                        alert("No QR Code found in image.");
                    }
                } catch(e) {
                    alert("Scanner library not ready yet. Please try again or check browser support.");
                }
                endProgress();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// --- 9. Subtitle Converter Logic ---
let currentSubContent = "";
let currentSubName = "subtitle";

function handleSubUpload(input) {
    startProgress();
    const file = input.files[0];
    if(!file) { endProgress(); return; }
    currentSubName = file.name.split('.')[0];
    
    const reader = new FileReader();
    reader.onload = (e) => {
        currentSubContent = e.target.result;
        document.getElementById('subOutput').value = "File loaded. Ready to convert.";
        endProgress();
    };
    reader.readAsText(file);
}

function convertSub(type) {
    if(!currentSubContent) return;
    startProgress();
    
    setTimeout(() => {
        let result = "";
        if(type === 'vtt') {
            result = "WEBVTT\n\n" + currentSubContent.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
        } else if (type === 'txt') {
            const lines = currentSubContent.split('\n');
            lines.forEach(line => {
                if(!line.match(/^\d+$/) && !line.match(/\d{2}:\d{2}:\d{2}/)) {
                    if(line.trim() !== "") result += line + " ";
                }
            });
        }
        document.getElementById('subOutput').value = result;
        endProgress();
    }, 300);
}

function downloadSub() {
    const content = document.getElementById('subOutput').value;
    if(!content || content.startsWith("File loaded")) return;
    
    const blob = new Blob([content], {type: 'text/plain'});
    const link = document.createElement('a');
    const isVtt = content.startsWith("WEBVTT");
    link.download = `${currentSubName}.${isVtt ? 'vtt' : 'txt'}`;
    link.href = URL.createObjectURL(blob);
    link.click();
}

// --- 10. Rate Calculator Logic ---
function calcRate() {
    const goal = parseFloat(document.getElementById('incGoal').value) || 0;
    const exp = parseFloat(document.getElementById('incExp').value) || 0;
    const hours = parseFloat(document.getElementById('incHours').value) || 1;
    const vacation = parseFloat(document.getElementById('incVacation').value) || 0;

    const totalWeeks = 52 - vacation;
    const totalHours = totalWeeks * hours;
    const totalAnnualNeed = (goal + exp) * 12;

    const hourlyRate = totalAnnualNeed / totalHours;

    document.getElementById('incResult').innerText = '$' + (isFinite(hourlyRate) ? hourlyRate.toFixed(2) : "0.00") + " /hr";
}

// --- 11. JSON CSV Logic ---
function convertJsonToCsv() {
    startProgress();
    try {
        const raw = document.getElementById('jsonInput').value;
        const json = JSON.parse(raw);
        if(!Array.isArray(json)) throw new Error("Input must be an array of objects");
        if(json.length === 0) return;

        const headers = Object.keys(json[0]);
        const csvRows = [];
        
        csvRows.push(headers.join(','));

        for(const row of json) {
            const values = headers.map(header => {
                const escaped = (''+row[header]).replace(/"/g, '\\"');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }

        document.getElementById('csvOutput').value = csvRows.join('\n');
    } catch(e) {
        document.getElementById('csvOutput').value = "Error: Invalid JSON. Ensure it is an array of objects [{\"name\":\"value\"}]";
    } finally {
        endProgress();
    }
}

// --- 12. Text Utils Logic ---
function processString() {
    const str = document.getElementById('strInput').value;
    document.getElementById('outSlug').value = str.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    document.getElementById('outUpper').value = str.toUpperCase();
    document.getElementById('outLower').value = str.toLowerCase();
    document.getElementById('outCamel').value = str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
    document.getElementById('outSponge').value = str.split('').map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join('');
}

// --- 13. CV Builder Logic ---
let cvPhotoData = null;

function handleCVPhoto(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            cvPhotoData = e.target.result;
            const img = document.getElementById('cvPhotoPreview');
            const ph = document.getElementById('cvPhotoPlaceholder');
            img.src = cvPhotoData;
            img.classList.remove('hidden');
            ph.classList.add('hidden');
            updateCVPreview();
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function updateCVPreview() {
    const name = document.getElementById('cvName').value || 'John Doe';
    const job = document.getElementById('cvJob').value || 'Software Engineer';
    const email = document.getElementById('cvEmail').value || 'john@example.com';
    const phone = document.getElementById('cvPhone').value || '123-456-7890';
    const address = document.getElementById('cvAddress').value || '';
    const web = document.getElementById('cvWeb').value || '';
    
    const summary = document.getElementById('cvSummary').value || 'Experienced professional with a passion for building great things.';
    const exp = (document.getElementById('cvExp').value || 'Acme Corp | 2020 - Present\nLed team of developers.').replace(/\n/g, '<br>');
    const edu = (document.getElementById('cvEdu').value || 'B.S. Computer Science | MIT | 2019').replace(/\n/g, '<br>');
    const skills = document.getElementById('cvSkills').value || 'JavaScript, HTML, CSS, React';
    const template = document.getElementById('cvTemplateSelector').value;
    
    const preview = document.getElementById('cvPreviewArea');
    let html = '';

    const photoHtml = cvPhotoData ? `<div class="mb-4"><img src="${cvPhotoData}" style="width:100px; height:100px; border-radius:50%; object-fit:cover;"></div>` : '';
    const contactLine = [email, phone, address, web].filter(x => x).join(' • ');

    switch(template) {
        case '1':
            html = `<div class="cv-t1 text-left">${photoHtml}<h1>${name}</h1><p class="text-xl text-gray-600">${job}</p><div class="text-sm mt-2 border-b pb-4">${contactLine}</div><p class="mt-4 italic">${summary}</p><div class="mt-4"><h3 class="font-bold border-b mb-2">Experience</h3><p>${exp}</p></div><div class="mt-4"><h3 class="font-bold border-b mb-2">Education</h3><p>${edu}</p></div><div class="mt-4"><h3 class="font-bold border-b mb-2">Skills</h3><p>${skills}</p></div></div>`;
            break;
        case '2':
            html = `<div class="cv-t2"><div class="cv-t2-sidebar">${cvPhotoData ? `<img src="${cvPhotoData}" style="width:120px; height:120px; border-radius:50%; margin-bottom:20px; object-fit:cover; border:3px solid white;">` : ''}<h2 class="text-2xl font-bold mb-2">${name}</h2><p class="mb-4 text-blue-200">${job}</p><div class="text-xs mb-6 space-y-1"><div>${email}</div><div>${phone}</div><div>${address}</div><div>${web}</div></div><h3 class="font-bold border-b border-blue-400 mb-2 mt-4">Skills</h3><p class="text-sm">${skills}</p><h3 class="font-bold border-b border-blue-400 mb-2 mt-8">Education</h3><p class="text-sm">${edu}</p></div><div class="cv-t2-main"><h3 class="text-xl font-bold text-blue-900 mb-2">Profile</h3><p>${summary}</p><h3 class="text-xl font-bold text-blue-900 mb-2 mt-6">Experience</h3><p>${exp}</p></div></div>`;
            break;
        case '10':
             html = `<div class="p-8 font-sans h-full"><div class="flex justify-between items-start border-b-4 border-indigo-600 pb-6 mb-6"><div><h1 class="text-5xl font-extrabold tracking-tight text-slate-900">${name}</h1><div class="text-indigo-600 font-mono text-lg mt-2">${job}</div></div>${cvPhotoData ? `<img src="${cvPhotoData}" style="width:100px; height:100px; border-radius:10px; object-fit:cover;">` : ''}</div><div class="flex gap-8"><div class="w-2/3"><h3 class="font-bold text-slate-900 text-lg mt-6 mb-3">SUMMARY</h3><p class="text-slate-600 mb-6">${summary}</p><h3 class="font-bold text-slate-900 text-lg mb-3">EXPERIENCE</h3><div class="pl-4 border-l-2 border-slate-200">${exp}</div></div><div class="w-1/3 bg-slate-50 p-4 rounded text-sm"><div class="mb-4 font-mono text-slate-500 text-xs">${email}<br>${phone}<br>${address}<br>${web}</div><h3 class="font-bold text-slate-900 mb-2">EDUCATION</h3><p class="text-slate-600 mb-6">${edu}</p><h3 class="font-bold text-slate-900 mb-2">SKILLS</h3><div class="flex flex-wrap gap-2">${skills.split(',').map(s => `<span class="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded font-bold">${s.trim()}</span>`).join('')}</div></div></div></div>`;
            break;
        default:
             html = `<div class="cv-t1 text-left"><h1>${name}</h1><p>${job}</p><p>${summary}</p></div>`;
    }
    preview.innerHTML = html;
}

async function downloadCV() {
    startProgress();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const element = document.getElementById('cvPreviewArea');
    const originalWidth = element.style.width;
    element.style.width = '210mm'; 

    await doc.html(element, {
        callback: function(doc) {
            doc.save('resume.pdf');
            element.style.width = originalWidth; 
            endProgress();
        },
        x: 0,
        y: 0,
        width: 210,
        windowWidth: 800
    });
}

// --- 14. Image Compressor Logic ---
let compOriginalFile = null;

function handleCompUpload(input) {
    if (input.files && input.files[0]) {
        compOriginalFile = input.files[0];
        document.getElementById('compOrigSize').innerText = (compOriginalFile.size / 1024).toFixed(2) + " KB";
        document.getElementById('compUploadBox').classList.add('hidden');
        document.getElementById('compInterface').classList.remove('hidden');
        updateCompression();
    }
}

function updateCompression() {
    if(!compOriginalFile) return;
    const quality = parseFloat(document.getElementById('compRange').value);
    document.getElementById('compQualityDisplay').innerText = `Quality: ${(quality * 100).toFixed(0)}%`;
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            document.getElementById('compPreview').src = compressedDataUrl;
            const head = 'data:image/jpeg;base64,';
            const size = Math.round((compressedDataUrl.length - head.length) * 3 / 4);
            document.getElementById('compNewSize').innerText = (size / 1024).toFixed(2) + " KB";
        }
    };
    reader.readAsDataURL(compOriginalFile);
}

function downloadCompressed() {
    const dataUrl = document.getElementById('compPreview').src;
    if(!dataUrl) return;
    const link = document.createElement('a');
    link.download = "compressed-image.jpg";
    link.href = dataUrl;
    link.click();
}

// --- 15. URL Shrinker Logic ---
async function shrinkUrl() {
    const url = document.getElementById('urlInput').value;
    if(!url) return alert("Please enter a URL first!");

    const btn = event.target.closest('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<div class="loader !w-4 !h-4 !border-white"></div>';
    btn.disabled = true;

    try {
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const shortUrl = await response.text();
        document.getElementById('shortUrlOutput').value = shortUrl;
        document.getElementById('urlQr').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shortUrl)}`;
        const resultArea = document.getElementById('urlResult');
        resultArea.classList.remove('hidden');
        setTimeout(() => resultArea.classList.remove('opacity-0'), 50);
    } catch (error) {
        alert("Could not shrink URL. The URL might be invalid or the service is temporarily blocked.");
        console.error(error);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}
// --- 16. Password Generator Logic ---
function generatePass() {
    const length = 16; 
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    if (document.getElementById('passSpecial').checked) {
        chars += '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('passOutput').value = password;
}

// --- 17. Invoice Generator Logic ---
let invItems = [{desc: "Web Development Services", qty: 1, price: 500}];
let invLogoData = null; 
let invSigData = null; 

function initInvoice() {
    if(!document.getElementById('invItemsInput')) return;
    const dateInput = document.getElementById('invDate');
    if(dateInput && !dateInput.value) dateInput.valueAsDate = new Date();
    renderInvInputs();
    updateInvoicePreview();
}

// This logic is now handled in initializeLoadTool, removing the duplicate override
/*
const originalLoadToolForInv = loadTool; 
loadTool = function(toolKey) {
    originalLoadToolForInv(toolKey);
    if(toolKey === 'invoiceGenerator') setTimeout(initInvoice, 100);
}
*/

function handleInvLogo(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            invLogoData = e.target.result;
            const smPrev = document.getElementById('invLogoPreviewSmall');
            const status = document.getElementById('invLogoStatus');
            if(smPrev) { smPrev.src = invLogoData; smPrev.classList.remove('hidden'); status.classList.add('hidden'); }
            updateInvoicePreview();
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function handleInvSig(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            invSigData = e.target.result;
            const smPrev = document.getElementById('invSigPreviewSmall');
            const status = document.getElementById('invSigStatus');
            if(smPrev) { smPrev.src = invSigData; smPrev.classList.remove('hidden'); status.classList.add('hidden'); }
            updateInvoicePreview();
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function renderInvInputs() {
    const container = document.getElementById('invItemsInput');
    if(!container) return;
    container.innerHTML = '';
    
    invItems.forEach((item, index) => {
        container.innerHTML += `
            <div class="flex gap-2 items-center fade-in bg-white dark:bg-slate-700 p-2 rounded-lg border border-slate-100 dark:border-slate-600 shadow-sm">
                <input type="text" placeholder="Description" value="${item.desc}" oninput="updateInvItem(${index}, 'desc', this.value)" class="flex-1 bg-transparent border-b border-transparent focus:border-emerald-500 outline-none text-xs dark:text-white pb-1">
                <input type="number" placeholder="#" value="${item.qty}" oninput="updateInvItem(${index}, 'qty', this.value)" class="w-10 bg-transparent border-b border-transparent focus:border-emerald-500 outline-none text-xs text-right dark:text-white pb-1">
                <input type="number" placeholder="$" value="${item.price}" oninput="updateInvItem(${index}, 'price', this.value)" class="w-14 bg-transparent border-b border-transparent focus:border-emerald-500 outline-none text-xs text-right dark:text-white pb-1">
                <button onclick="removeInvItem(${index})" class="text-slate-400 hover:text-red-500 transition px-1"><i class="fa-solid fa-xmark"></i></button>
            </div>
        `;
    });
}

function addInvItem() {
    invItems.push({desc: "", qty: 1, price: 0});
    renderInvInputs();
    updateInvoicePreview();
}

function removeInvItem(index) {
    if(invItems.length > 1) { invItems.splice(index, 1); renderInvInputs(); updateInvoicePreview(); }
}

function updateInvItem(index, field, value) {
    invItems[index][field] = field === 'desc' ? value : parseFloat(value) || 0;
    updateInvoicePreview();
}

// --- MAIN TEMPLATE RENDERER ---
function updateInvoicePreview() {
    // 1. Gather Data
    const data = {
        num: document.getElementById('invNum').value || 'Inv-001',
        date: document.getElementById('invDate').value,
        from: (document.getElementById('invFrom').value || 'Your Name').replace(/\n/g, '<br>'),
        to: (document.getElementById('invTo').value || 'Client Name').replace(/\n/g, '<br>'),
        currency: document.getElementById('invCurrency').value,
        taxRate: parseFloat(document.getElementById('invTaxRate').value) || 0,
        template: document.getElementById('invTemplate').value,
        useWatermark: document.getElementById('invWatermark').checked
    };

    // 2. Calculate Totals
    let subtotal = 0;
    const rowsHtml = invItems.map(item => {
        const total = item.qty * item.price;
        subtotal += total;
        return `
            <tr class="border-b border-slate-100 last:border-0 relative z-10">
                <td class="py-3 px-4">${item.desc || 'Item'}</td>
                <td class="text-right py-3 px-4">${item.qty}</td>
                <td class="text-right py-3 px-4">${data.currency}${item.price.toFixed(2)}</td>
                <td class="text-right py-3 px-4 font-bold text-slate-800">${data.currency}${total.toFixed(2)}</td>
            </tr>
        `;
    }).join('');

    const tax = subtotal * (data.taxRate / 100);
    const total = subtotal + tax;
    
    // 3. Components
    const logoHtml = invLogoData ? `<img src="${invLogoData}" class="h-16 w-auto object-contain mb-4 relative z-10">` : '';
    
    // Watermark Component
    const watermarkHtml = (data.useWatermark && invLogoData) 
        ? `<div class="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.05]">
             <img src="${invLogoData}" style="width: 70%; max-height: 70%; object-fit: contain;">
           </div>` 
        : '';

    // Signature Component
    const sigHtml = invSigData 
        ? `<div class="mt-8 pt-4 inline-block text-center relative z-10">
             <img src="${invSigData}" class="h-12 w-auto object-contain mb-2 border-b border-slate-300 px-4">
             <p class="text-[10px] font-bold uppercase text-slate-400">Authorized Signature</p>
           </div>`
        : `<div class="mt-16 pt-8 border-t border-slate-300 inline-block w-48 text-center relative z-10">
             <p class="text-[10px] font-bold uppercase text-slate-400">Authorized Signature</p>
           </div>`;

    // 4. Build HTML based on Template
    let html = '';

    if (data.template === 'corporate') {
        html = `
            <div class="h-full flex flex-col font-sans relative bg-white">
                ${watermarkHtml}
                <div class="bg-slate-800 text-white p-12 flex justify-between items-center relative z-10">
                    <div>${logoHtml}<h1 class="text-4xl font-bold tracking-widest uppercase">Invoice</h1></div>
                    <div class="text-right">
                        <p class="text-slate-400 text-xs uppercase font-bold">Invoice Number</p>
                        <p class="text-xl font-bold mb-2">#${data.num}</p>
                        <p class="text-slate-400 text-xs uppercase font-bold">Date</p>
                        <p class="text-lg">${data.date}</p>
                    </div>
                </div>
                <div class="p-12 flex-1 relative z-10">
                    <div class="flex justify-between mb-12 gap-8">
                        <div><p class="text-xs font-bold text-slate-400 uppercase mb-2">From</p><p class="text-slate-700">${data.from}</p></div>
                        <div class="text-right"><p class="text-xs font-bold text-slate-400 uppercase mb-2">Bill To</p><p class="text-slate-900 font-bold text-lg">${data.to}</p></div>
                    </div>
                    <table class="w-full mb-8">
                        <thead class="bg-slate-100 text-slate-600">
                            <tr>
                                <th class="text-left py-2 px-4 text-xs uppercase font-bold">Description</th>
                                <th class="text-right py-2 px-4 text-xs uppercase font-bold">Qty</th>
                                <th class="text-right py-2 px-4 text-xs uppercase font-bold">Price</th>
                                <th class="text-right py-2 px-4 text-xs uppercase font-bold">Total</th>
                            </tr>
                        </thead>
                        <tbody class="text-slate-600">${rowsHtml}</tbody>
                    </table>
                    <div class="flex justify-end mb-8">
                        <div class="w-1/3 text-right space-y-2">
                            <div class="flex justify-between text-slate-500"><span>Subtotal</span><span>${data.currency}${subtotal.toFixed(2)}</span></div>
                            <div class="flex justify-between text-slate-500"><span>Tax (${data.taxRate}%)</span><span>${data.currency}${tax.toFixed(2)}</span></div>
                            <div class="flex justify-between text-slate-900 font-bold text-xl border-t border-slate-200 pt-2"><span>Total</span><span>${data.currency}${total.toFixed(2)}</span></div>
                        </div>
                    </div>
                    <div class="flex justify-end">${sigHtml}</div>
                </div>
            </div>`;
            
    } else if (data.template === 'modern') {
        html = `
            <div class="h-full p-12 font-sans relative bg-white">
                ${watermarkHtml}
                <div class="absolute top-0 left-0 w-full h-4 bg-teal-500 z-10"></div>
                <div class="flex justify-between items-start mb-16 mt-4 relative z-10">
                    <div>${logoHtml}<p class="text-slate-400 font-bold">INVOICE #${data.num}</p></div>
                    <div class="text-right"><h1 class="text-4xl font-extrabold text-teal-600 mb-2">INVOICE</h1><p class="text-slate-500">${data.date}</p></div>
                </div>
                <div class="grid grid-cols-2 gap-12 mb-12 relative z-10">
                    <div class="border-l-4 border-slate-200 pl-4"><p class="text-xs font-bold text-teal-600 uppercase mb-1">From</p><p class="text-slate-700">${data.from}</p></div>
                    <div class="border-l-4 border-teal-500 pl-4"><p class="text-xs font-bold text-teal-600 uppercase mb-1">Bill To</p><p class="text-slate-900 font-bold">${data.to}</p></div>
                </div>
                <table class="w-full mb-8 relative z-10">
                    <thead>
                        <tr class="border-b-2 border-teal-500 text-teal-700">
                            <th class="text-left py-2 px-4 text-sm font-bold">Item</th>
                            <th class="text-right py-2 px-4 text-sm font-bold">Qty</th>
                            <th class="text-right py-2 px-4 text-sm font-bold">Price</th>
                            <th class="text-right py-2 px-4 text-sm font-bold">Total</th>
                        </tr>
                    </thead>
                    <tbody class="text-slate-600">${rowsHtml}</tbody>
                </table>
                <div class="flex justify-end mt-12 relative z-10">
                    <div class="bg-teal-50 p-6 rounded-xl w-1/2">
                        <div class="flex justify-between text-teal-800 mb-2"><span>Subtotal</span><span>${data.currency}${subtotal.toFixed(2)}</span></div>
                        <div class="flex justify-between text-teal-800 mb-4 border-b border-teal-200 pb-2"><span>Tax</span><span>${data.currency}${tax.toFixed(2)}</span></div>
                        <div class="flex justify-between text-teal-900 font-extrabold text-2xl"><span>Total</span><span>${data.currency}${total.toFixed(2)}</span></div>
                    </div>
                </div>
                <div class="absolute bottom-12 right-12 z-10">${sigHtml}</div>
            </div>`;

    } else {
        html = `
            <div class="p-12 font-sans h-full relative bg-white">
                ${watermarkHtml}
                <div class="flex justify-between items-start mb-12 border-b-2 border-emerald-500 pb-8 relative z-10">
                    <div>
                        ${logoHtml}
                        <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight uppercase">Invoice</h1>
                        <p class="text-emerald-600 font-bold mt-1 text-lg">#${data.num}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Date Issued</p>
                        <p class="font-medium text-lg">${data.date}</p>
                    </div>
                </div>
                <div class="flex justify-between mb-16 gap-8 relative z-10">
                    <div class="w-1/2"><p class="font-bold text-slate-400 uppercase text-[10px] tracking-wider mb-2">From</p><p class="whitespace-pre-line text-slate-700 leading-relaxed">${data.from}</p></div>
                    <div class="w-1/2 text-right"><p class="font-bold text-slate-400 uppercase text-[10px] tracking-wider mb-2">Bill To</p><p class="whitespace-pre-line text-slate-800 font-bold leading-relaxed">${data.to}</p></div>
                </div>
                <table class="w-full mb-8 relative z-10">
                    <thead>
                        <tr class="bg-slate-50 border-y border-slate-200">
                            <th class="text-left py-3 px-4 font-bold uppercase text-xs text-slate-500">Description</th>
                            <th class="text-right py-3 px-4 font-bold uppercase text-xs text-slate-500 w-24">Qty</th>
                            <th class="text-right py-3 px-4 font-bold uppercase text-xs text-slate-500 w-32">Price</th>
                            <th class="text-right py-3 px-4 font-bold uppercase text-xs text-slate-500 w-32">Total</th>
                        </tr>
                    </thead>
                    <tbody class="text-slate-600">${rowsHtml}</tbody>
                </table>
                <div class="flex justify-end mt-8 relative z-10">
                    <div class="w-64 space-y-3">
                        <div class="flex justify-between text-slate-500 text-sm"><span>Subtotal</span><span class="font-medium">${data.currency}${subtotal.toFixed(2)}</span></div>
                        <div class="flex justify-between text-slate-500 text-sm"><span>Tax</span><span class="font-medium">${data.currency}${tax.toFixed(2)}</span></div>
                        <div class="flex justify-between font-bold text-2xl text-emerald-600 border-t-2 border-slate-100 pt-4 mt-2"><span>Total</span><span>${data.currency}${total.toFixed(2)}</span></div>
                    </div>
                </div>
                <div class="flex justify-end mt-12 relative z-10">${sigHtml}</div>
            </div>`;
    }

    document.getElementById('invoicePreview').innerHTML = html;
}

function downloadInvoicePDF() {
    startProgress();
    const element = document.getElementById('invoicePreview');
    // html2canvas is pre-loaded in index.html
    
    html2canvas(element, { scale: 3, useCORS: true }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4'); 
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
        pdf.save(`Invoice_${document.getElementById('invNum').value || 'Draft'}.pdf`);
        endProgress();
    }).catch(err => {
        console.error(err);
        alert("Error generating PDF. Make sure all images are loaded.");
        endProgress();
    });
}

function downloadInvoiceJSON() {
    const data = {
        num: document.getElementById('invNum').value,
        date: document.getElementById('invDate').value,
        from: document.getElementById('invFrom').value,
        to: document.getElementById('invTo').value,
        items: invItems,
        tax: document.getElementById('invTaxRate').value,
        currency: document.getElementById('invCurrency').value,
        logo: invLogoData,
        signature: invSigData,
        template: document.getElementById('invTemplate').value,
        useWatermark: document.getElementById('invWatermark').checked
    };
    const blob = new Blob([JSON.stringify(data)], {type: "application/json"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `InvoiceData_${data.num || 'Draft'}.json`;
    link.click();
}

function loadInvoiceJSON(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                document.getElementById('invNum').value = data.num || '';
                document.getElementById('invDate').value = data.date || '';
                document.getElementById('invFrom').value = data.from || '';
                document.getElementById('invTo').value = data.to || '';
                document.getElementById('invTaxRate').value = data.tax || 0;
                document.getElementById('invCurrency').value = data.currency || '$';
                if(data.template) document.getElementById('invTemplate').value = data.template;
                if(data.useWatermark) document.getElementById('invWatermark').checked = true;
                if(data.items) invItems = data.items;
                
                // Handle Images
                if(data.logo) {
                    invLogoData = data.logo;
                    const smPrev = document.getElementById('invLogoPreviewSmall');
                    if(smPrev) { 
                        smPrev.src = data.logo; 
                        smPrev.classList.remove('hidden'); 
                        document.getElementById('invLogoStatus').classList.add('hidden');
                    }
                }
                if(data.signature) {
                    invSigData = data.signature;
                    const smPrev = document.getElementById('invSigPreviewSmall');
                    if(smPrev) { 
                        smPrev.src = data.signature; 
                        smPrev.classList.remove('hidden'); 
                        document.getElementById('invSigStatus').classList.add('hidden');
                    }
                }

                renderInvInputs();
                updateInvoicePreview();
            } catch(err) {
                alert("Invalid Invoice JSON file.");
            }
        };
        reader.readAsText(input.files[0]);
    }

}
