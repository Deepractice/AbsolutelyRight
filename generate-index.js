#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const MEMES_DIR = path.join(__dirname, 'memes');
const OUTPUT_FILE = path.join(__dirname, 'memes-index.json');

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

function generateIndex() {
    console.log('🚀 Generating memes index...\n');

    const memes = scanMemes();

    // 创建索引对象
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

    // 写入文件
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));

    console.log(`\n✨ Index generated successfully!`);
    console.log(`📊 Total memes: ${memes.length}`);
    console.log(`📁 Categories: ${Object.keys(index.categories).join(', ')}`);
    console.log(`🏷️  Tags: ${Object.keys(index.tags).join(', ')}`);
    console.log(`💾 Output: ${OUTPUT_FILE}`);
}

// 如果直接运行此脚本
if (require.main === module) {
    generateIndex();
}

module.exports = { scanMemes, generateIndex };