# Memes Directory Structure

## 📁 Directory Organization

Each meme should have its own directory under `/memes/` with a descriptive kebab-case name.

```
memes/
├── absolutely-right/
│   ├── meme.json
│   ├── absolutely_right.png
│   └── [additional images...]
├── vibe-coding/
│   ├── meme.json
│   └── I'm_vibe_coding.png
└── README.md (this file)
```

## 📋 meme.json Schema

Each meme directory must contain a `meme.json` file with the following structure:

```json
{
  "id": "unique-meme-id",
  "title": "Meme Title in English",
  "title_zh": "中文标题",
  "description": "Brief description of the meme",
  "description_zh": "梗图的简短描述",

  "category": ["prompt-engineering", "success"],
  "tags": ["classic", "understanding", "breakthrough"],

  "images": [
    {
      "file": "image-filename.png",
      "caption": "Optional caption for this image",
      "caption_zh": "图片的可选说明",
      "is_primary": true
    }
  ],

  "context": {
    "scenario": "When/where this meme is most relatable",
    "scenario_zh": "使用场景描述",
    "emotion": "relief|frustration|joy|confusion|confidence",
    "relatability": 10
  },

  "variations": [
    {
      "file": "variation1.png",
      "description": "Alternative version description"
    }
  ],

  "created_at": "2024-09-18",
  "author": "Creator name or 'Community'",
  "source_url": "https://original-source-if-any.com",
  "license": "CC0|CC-BY|MIT|proprietary"
}
```

## 🎯 Field Definitions

### Required Fields

- **id** (string): Unique identifier, usually matches directory name
- **title** (string): English title of the meme
- **description** (string): Brief description explaining the meme
- **category** (array): Categories from the allowed list
- **images** (array): At least one image entry with `file` field

### Optional Fields

- **title_zh** (string): Chinese translation of title
- **description_zh** (string): Chinese translation of description
- **tags** (array): Free-form tags for better searchability
- **context** (object): Additional context about meme usage
- **variations** (array): Alternative versions of the meme
- **created_at** (string): ISO date format (YYYY-MM-DD)
- **author** (string): Creator attribution
- **source_url** (string): Original source link
- **license** (string): License type

## 🏷️ Allowed Categories

Use these standardized categories for better organization:

- `prompt-engineering`: Prompt writing struggles and successes
- `success`: When AI finally understands
- `debug`: Debugging with AI assistance
- `ai-superpowers`: Showcasing AI capabilities
- `productivity`: Productivity gains/losses with AI
- `hallucination`: AI hallucination moments
- `token-limit`: Token/context limit issues
- `learning`: Learning to work with AI
- `future`: Future of programming with AI
- `comparison`: Human vs AI coding

## 📊 Context Emotions

Standard emotion values for the `context.emotion` field:

- `relief`: Finally got it working
- `frustration`: Still not working
- `joy`: Unexpected success
- `confusion`: What just happened?
- `confidence`: I know what I'm doing
- `surprise`: Didn't expect that
- `pride`: Look what I built
- `despair`: Giving up

## ✅ Validation Rules

1. **ID must be unique** across all memes
2. **Images must exist** in the same directory
3. **Categories must be** from the allowed list
4. **Relatability score** should be 1-10
5. **File names** should use snake_case or kebab-case
6. **Directory names** should use kebab-case

## 🚀 Adding a New Meme

1. Create a new directory: `memes/your-meme-name/`
2. Add your image(s) to the directory
3. Create `meme.json` following the schema above
4. Run `node generate-index.js` to update the index
5. Test locally before committing

## 🤖 Automation

The `generate-index.js` script will:
- Scan all meme directories
- Validate `meme.json` files
- Generate `memes-index.json` for the website
- Report any validation errors

## 💡 Best Practices

1. **Use descriptive IDs**: `absolutely-right` not `meme1`
2. **Provide both languages** when possible
3. **Multiple images**: Use `is_primary: true` for the main image
4. **High-quality images**: Prefer PNG for text clarity
5. **Appropriate sizing**: Keep images under 1MB when possible
6. **Clear categorization**: Choose 1-3 most relevant categories
7. **Meaningful tags**: Help others find your meme

## 📝 Example

See `/memes/absolutely-right/meme.json` for a complete example.

---

*This structure ensures memes are well-organized, searchable, and easily maintainable as the collection grows.*