# 🖼️ Advanced Batch Image Resizer

A powerful, web-based image processing tool built with Next.js that allows you to resize, enhance, and customize multiple images with professional-grade features.

## ✨ Features

### 🎯 Core Functionality
- **Batch Processing** - Process multiple images simultaneously
- **Custom Dimensions** - Set precise width and height (100px - 5000px)
- **Multiple Formats** - Export as PNG, JPEG, or WebP
- **High Quality Output** - Enhanced rendering with 95% default quality

### 🎨 Advanced Effects
- **Background Removal** - Intelligent edge-detection background removal
- **Custom Backgrounds** - Solid colors, transparency, or custom images
- **Blur Effects** - Adjustable blur intensity (0-50px)
- **Fade Effects** - Top and bottom gradient fades (0-150px)
- **Color Adjustments** - Brightness, contrast, and saturation controls

### 🏷️ Watermarking
- **Custom Text** - Add personalized watermarks
- **Multiple Positions** - 8 positioning options including repeat pattern
- **Customizable Styling** - Font, size, color, and opacity controls
- **Adjustable Spacing** - Control spacing for repeat patterns

### 🎭 Visual Enhancements
- **Border Effects** - Customizable width and color
- **Overlay Effects** - Color overlays with opacity control
- **Live Preview** - Real-time preview of your settings
- **Auto-Download** - Processed images download automatically

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/advance-image-resizer.git
   cd advance-image-resizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How to Use

### Basic Usage
1. **Upload Images** - Click "Choose Files" and select multiple images
2. **Set Dimensions** - Adjust output width and height
3. **Configure Settings** - Customize effects, quality, and format
4. **Process** - Click "Process Images" to start batch processing
5. **Download** - Images automatically download when complete

### Background Removal
1. Enable "Remove Background" checkbox
2. Choose background type:
   - **Transparent** - PNG with transparent background
   - **Solid Color** - Choose any color
   - **Custom Image** - Upload your own background image

### Watermarking
1. Enter watermark text
2. Select position (including "Repeat All Over" for patterns)
3. Adjust font, size, color, and opacity
4. For repeat patterns, control spacing between watermarks

## 🛠️ Tech Stack

- **Framework** - [Next.js 14](https://nextjs.org/)
- **Language** - TypeScript
- **Styling** - Tailwind CSS
- **Image Processing** - HTML5 Canvas API
- **Fonts** - Geist Sans & Geist Mono

## 📁 Project Structure

```
advance_image_resizer/
├── app/
│   ├── components/
│   │   └── image-resizer/
│   │       ├── ImageResizer.tsx      # Main component
│   │       ├── ControlPanel.tsx      # Settings panel
│   │       ├── FileUpload.tsx        # File upload component
│   │       └── LivePreview.tsx       # Preview component
│   ├── hooks/
│   │   └── useImageResizerSettings.ts # Settings management
│   ├── types/
│   │   └── index.ts                  # TypeScript definitions
│   ├── utils/
│   │   └── imageProcessing.ts        # Image processing utilities
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Home page
├── public/                           # Static assets
└── README.md
```

## ⚙️ Configuration

### Default Settings
- **Dimensions**: 832x832px
- **Format**: PNG
- **Quality**: 95%
- **Background**: Transparent
- **Effects**: Optimized for quality

### Customizable Options
- Output dimensions (100-5000px)
- Image quality (1-100%)
- Blur intensity (0-50px)
- Fade effects (0-150px)
- Brightness (50-150%)
- Contrast (50-150%)
- Saturation (0-200%)

## 🎨 Features in Detail

### Background Removal Algorithm
- Edge-based color sampling
- Intelligent tolerance detection
- Preserves subject details
- Supports complex backgrounds

### Quality Enhancement
- High-DPI rendering support
- Advanced image smoothing
- Optimized canvas settings
- Enhanced contrast processing

### Batch Processing
- Concurrent image processing
- Progress tracking
- Error handling
- Memory optimization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ravi Kumar**
- Portfolio: [https://ravi-wt.netlify.app/](https://ravi-wt.netlify.app/)
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Fonts by [Vercel](https://vercel.com/font)

---

⭐ **Star this repository if you found it helpful!**
