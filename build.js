#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const MEMES_DIR = path.join(__dirname, 'memes');
const DIST_DIR = path.join(__dirname, 'dist');
const INDEX_FILE = path.join(DIST_DIR, 'memes-index.json');

function ensureDistDir() {
    if (!fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR, { recursive: true });
        console.log('📁 Created dist directory');
    }
}

function scanMemes() {
    const memes = [];

    // 读取 memes 目录下的所有文件夹
    const folders = fs.readdirSync(MEMES_DIR).filter(item => {
        const itemPath = path.join(MEMES_DIR, item);
        return fs.statSync(itemPath).isDirectory();
    });

    folders.forEach(folder => {
        const memeJsonPath = path.join(MEMES_DIR, folder, 'meme.json');

        if (fs.existsSync(memeJsonPath)) {
            try {
                const memeData = JSON.parse(fs.readFileSync(memeJsonPath, 'utf8'));

                // 为图片添加完整路径
                if (memeData.images) {
                    memeData.images = memeData.images.map(img => ({
                        ...img,
                        path: `memes/${folder}/${img.file}`
                    }));
                }

                // 添加文件夹信息
                memeData.folder = folder;

                memes.push(memeData);
                console.log(`✅ Processed: ${memeData.title}`);
            } catch (error) {
                console.error(`❌ Error processing ${folder}:`, error.message);
            }
        } else {
            console.warn(`⚠️  No meme.json found in ${folder}`);
        }
    });

    return memes;
}

function generateHTML() {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AbsolutelyRight - AI Agent Memes</title>
    <meta name="description" content="The Ultimate Collection of AI Agent Memes. When your AI agent finally understands your prompt on the 10th try.">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --bg-primary: #0a0e27;
            --bg-secondary: #151935;
            --text-primary: #e0e6ed;
            --text-secondary: #a0a9b8;
            --accent: #7c3aed;
            --accent-hover: #9333ea;
            --border: #2a3f5f;
            --shadow: rgba(0, 0, 0, 0.3);
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
            color: var(--text-primary);
            min-height: 100vh;
            line-height: 1.6;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 20px;
        }

        header {
            padding: 40px 0;
            text-align: center;
            border-bottom: 1px solid var(--border);
            background: rgba(10, 14, 39, 0.8);
            backdrop-filter: blur(10px);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        h1 {
            font-size: 3rem;
            font-weight: 800;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }

        .tagline {
            color: var(--text-secondary);
            font-size: 1.2rem;
            font-style: italic;
        }

        .filters {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
            margin: 40px 0;
        }

        .filter-btn {
            padding: 8px 20px;
            background: var(--bg-secondary);
            border: 2px solid var(--border);
            color: var(--text-primary);
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 0.95rem;
        }

        .filter-btn:hover {
            border-color: var(--accent);
            transform: translateY(-2px);
        }

        .filter-btn.active {
            background: var(--accent);
            border-color: var(--accent);
            color: white;
        }

        .meme-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 30px;
            padding: 40px 0;
        }

        .meme-card {
            background: var(--bg-secondary);
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px var(--shadow);
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
            position: relative;
        }

        .meme-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px var(--shadow);
        }

        .meme-card img {
            width: 100%;
            height: auto;
            display: block;
        }

        .meme-info {
            padding: 20px;
        }

        .meme-title {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--text-primary);
        }

        .meme-category {
            display: inline-block;
            padding: 4px 12px;
            background: var(--accent);
            color: white;
            border-radius: 12px;
            font-size: 0.85rem;
            margin-top: 8px;
        }

        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            animation: fadeIn 0.3s;
        }

        .modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .modal-content {
            max-width: 90%;
            max-height: 90%;
            position: relative;
        }

        .modal-content img {
            width: 100%;
            height: auto;
            display: block;
            border-radius: 10px;
        }

        .modal-close {
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            background: none;
            border: none;
            padding: 10px;
        }

        .hero-section {
            text-align: center;
            padding: 60px 0;
        }

        .hero-meme {
            max-width: 600px;
            margin: 40px auto;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 20px 60px var(--shadow);
        }

        .hero-meme img {
            width: 100%;
            height: auto;
            display: block;
        }

        .cta-section {
            text-align: center;
            padding: 60px 0;
            border-top: 1px solid var(--border);
        }

        .cta-title {
            font-size: 2rem;
            margin-bottom: 20px;
        }

        .cta-buttons {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 30px;
        }

        .cta-btn {
            padding: 12px 30px;
            background: var(--accent);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .cta-btn:hover {
            background: var(--accent-hover);
            transform: translateY(-2px);
        }

        footer {
            text-align: center;
            padding: 40px 0;
            border-top: 1px solid var(--border);
            color: var(--text-secondary);
        }

        footer a {
            color: var(--accent);
            text-decoration: none;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @media (max-width: 768px) {
            h1 {
                font-size: 2rem;
            }

            .meme-grid {
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 20px;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>🧠 AbsolutelyRight</h1>
            <p class="tagline">The Ultimate Collection of AI Agent Memes</p>
            <p class="tagline">When your AI agent finally understands your prompt on the 10th try</p>
        </div>
    </header>

    <div class="container">
        <div class="filters" id="filterButtons">
            <!-- Will be populated dynamically -->
        </div>

        <section class="hero-section">
            <div class="hero-meme" id="heroMeme">
                <!-- Will be populated dynamically -->
            </div>
            <h2>Welcome to the Sacred Hall of AI Agent Memes</h2>
            <p>Where we collect the most relatable, hilarious, and painfully accurate memes about working with AI agents.</p>
        </section>

        <div class="meme-grid" id="memeGrid">
            <!-- Memes will be loaded dynamically -->
        </div>

        <section class="cta-section">
            <h2 class="cta-title">🚀 Join the Movement</h2>
            <p>Share your worst prompt engineering moments and best AI wins!</p>
            <div class="cta-buttons">
                <a href="https://github.com/Deepractice/AbsolutelyRight" class="cta-btn" target="_blank">
                    ⭐ Star on GitHub
                </a>
                <a href="https://github.com/Deepractice/AbsolutelyRight/issues" class="cta-btn" target="_blank">
                    💬 Share Your Story
                </a>
                <a href="https://deepractice.ai" class="cta-btn" target="_blank">
                    🤖 Visit Deepractice
                </a>
            </div>
        </section>
    </div>

    <footer>
        <div class="container">
            <p>Built with 💜 by humans and AI agents at <a href="https://deepractice.ai" target="_blank">Deepractice.ai</a></p>
            <p>Making AI Accessible - Where we turn "absolutely wrong" into "absolutely right"</p>
            <p style="margin-top: 20px; font-size: 0.9rem;">
                <em>This page was co-created by a human and an AI agent. Both are absolutely right about everything.</em>
            </p>
        </div>
    </footer>

    <div class="modal" id="modal">
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">&times;</button>
            <img id="modalImage" src="" alt="">
        </div>
    </div>

    <script>
        let memesData = null;
        let currentFilter = 'all';

        // Category display names
        const categoryNames = {
            'prompt-engineering': '🤖 Prompt Engineering',
            'success': '🎯 When AI Gets It',
            'debug': '😭 Debugging with AI',
            'ai-superpowers': '🚀 AI Superpowers',
            'productivity': '⚡ Productivity',
            'hallucination': '🎪 Hallucinations',
            'future': '🔮 Future'
        };

        // Load memes data
        async function loadMemes() {
            try {
                const response = await fetch('memes-index.json');
                const data = await response.json();
                memesData = data;

                // Initialize filters
                initializeFilters(data.categories);

                // Display hero meme (random or first)
                displayHeroMeme(data.memes);

                // Display all memes
                displayMemes(data.memes);

                // Setup modal handlers
                setupModalHandlers();
            } catch (error) {
                console.error('Failed to load memes:', error);
                document.getElementById('memeGrid').innerHTML = '<p>Failed to load memes. Please try again later.</p>';
            }
        }

        function initializeFilters(categories) {
            const filterContainer = document.getElementById('filterButtons');

            // Add 'All' button
            filterContainer.innerHTML = '<button class="filter-btn active" data-filter="all">🎭 All Memes</button>';

            // Add category buttons
            Object.keys(categories).forEach(category => {
                const btn = document.createElement('button');
                btn.className = 'filter-btn';
                btn.dataset.filter = category;
                btn.textContent = categoryNames[category] || category;
                filterContainer.appendChild(btn);
            });

            // Setup filter click handlers
            filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    currentFilter = btn.dataset.filter;

                    // Update active button
                    filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    // Filter memes
                    filterMemes(currentFilter);
                });
            });
        }

        function displayHeroMeme(memes) {
            if (memes.length === 0) return;

            // Pick a random meme or the first one
            const heroMeme = memes[Math.floor(Math.random() * Math.min(memes.length, 2))];
            const heroContainer = document.getElementById('heroMeme');

            if (heroMeme.images && heroMeme.images[0]) {
                heroContainer.innerHTML = \`
                    <img src="\${heroMeme.images[0].path}" alt="\${heroMeme.title}" />
                \`;
            }
        }

        function displayMemes(memes) {
            const grid = document.getElementById('memeGrid');
            grid.innerHTML = '';

            memes.forEach(meme => {
                if (meme.images && meme.images[0]) {
                    const card = document.createElement('div');
                    card.className = 'meme-card';
                    card.dataset.categories = JSON.stringify(meme.category || []);
                    card.dataset.memeId = meme.id;

                    const firstCategory = meme.category ? meme.category[0] : '';
                    const categoryLabel = categoryNames[firstCategory] || firstCategory;

                    card.innerHTML = \`
                        <img src="\${meme.images[0].path}" alt="\${meme.title}" loading="lazy">
                        <div class="meme-info">
                            <h3 class="meme-title">\${meme.title}</h3>
                            <p>\${meme.description}</p>
                            \${firstCategory ? \`<span class="meme-category">\${categoryLabel}</span>\` : ''}
                        </div>
                    \`;

                    grid.appendChild(card);
                }
            });
        }

        function filterMemes(filter) {
            const cards = document.querySelectorAll('.meme-card');

            cards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else {
                    const categories = JSON.parse(card.dataset.categories || '[]');
                    if (categories.includes(filter)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        }

        function setupModalHandlers() {
            const modal = document.getElementById('modal');
            const modalImage = document.getElementById('modalImage');

            // Setup click handlers for meme cards
            document.querySelectorAll('.meme-card').forEach(card => {
                card.addEventListener('click', () => {
                    const img = card.querySelector('img');
                    modalImage.src = img.src;
                    modalImage.alt = img.alt;
                    modal.classList.add('active');
                });
            });
        }

        function closeModal() {
            document.getElementById('modal').classList.remove('active');
        }

        // Modal event listeners
        document.getElementById('modal').addEventListener('click', (e) => {
            if (e.target.id === 'modal') {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        // Load memes when page loads
        document.addEventListener('DOMContentLoaded', loadMemes);
    </script>
</body>
</html>`;

    const indexDest = path.join(DIST_DIR, 'index.html');
    fs.writeFileSync(indexDest, htmlContent);
    console.log('📄 Generated index.html');
}

function copyStaticFiles() {
    // Copy memes directory to dist
    const memesDest = path.join(DIST_DIR, 'memes');
    if (!fs.existsSync(memesDest)) {
        fs.mkdirSync(memesDest, { recursive: true });
    }

    // Copy all meme folders
    const folders = fs.readdirSync(MEMES_DIR).filter(item => {
        const itemPath = path.join(MEMES_DIR, item);
        return fs.statSync(itemPath).isDirectory();
    });

    folders.forEach(folder => {
        const srcFolder = path.join(MEMES_DIR, folder);
        const destFolder = path.join(memesDest, folder);

        if (!fs.existsSync(destFolder)) {
            fs.mkdirSync(destFolder, { recursive: true });
        }

        // Copy all files in the folder
        const files = fs.readdirSync(srcFolder);
        files.forEach(file => {
            const srcFile = path.join(srcFolder, file);
            const destFile = path.join(destFolder, file);

            if (fs.statSync(srcFile).isFile()) {
                fs.copyFileSync(srcFile, destFile);
            }
        });

        console.log(`📁 Copied meme folder: ${folder}`);
    });
}

function build() {
    console.log('🚀 Building AbsolutelyRight...\n');

    // Ensure dist directory exists
    ensureDistDir();

    // Scan and generate index
    const memes = scanMemes();

    // Create index object
    const index = {
        version: '1.0.0',
        generated: new Date().toISOString(),
        total: memes.length,
        categories: {},
        tags: {},
        memes: memes
    };

    // 统计分类
    memes.forEach(meme => {
        if (meme.category) {
            meme.category.forEach(cat => {
                if (!index.categories[cat]) {
                    index.categories[cat] = [];
                }
                index.categories[cat].push(meme.id);
            });
        }

        // 统计标签
        if (meme.tags) {
            meme.tags.forEach(tag => {
                if (!index.tags[tag]) {
                    index.tags[tag] = [];
                }
                index.tags[tag].push(meme.id);
            });
        }
    });

    // Write index file
    fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
    console.log(`\n📊 Generated memes index`);

    // Generate HTML file
    generateHTML();

    // Copy static files
    copyStaticFiles();

    console.log(`\n✨ Build completed successfully!`);
    console.log(`📊 Total memes: ${memes.length}`);
    console.log(`📁 Categories: ${Object.keys(index.categories).join(', ')}`);
    console.log(`🏷️  Tags: ${Object.keys(index.tags).join(', ')}`);
    console.log(`💾 Output directory: ${DIST_DIR}`);
    console.log(`\n🎉 You can now deploy the 'dist' folder to Cloudflare Pages!`);
}

// Run build if directly executed
if (require.main === module) {
    build();
}

module.exports = { scanMemes, build };