# Your Private PDF

A modern, privacy-first PDF converter web application where all file processing happens entirely in your browser. No uploads, no backends, no tracking, no analytics. Your files never leave your device.

## Features

- **PDF to Text**: Extract text from PDFs with optional OCR for scanned documents
- **Merge PDFs**: Combine multiple PDFs into one document
- **Split PDFs**: Extract specific pages from a PDF
- **Rotate Pages**: Rotate pages in any direction
- **Compress PDFs**: Reduce file size with configurable quality levels (Low, Medium, High)
- **Images to PDF**: Convert up to 100 JPG or PNG images into a single PDF
- **OCR Scanning**: Recognize text in scanned PDFs using machine learning (runs in browser)

## Privacy & Security

- **100% Client-Side Processing**: All operations happen in your browser using WebAssembly and Web Workers
- **No Server Uploads**: Files are processed locally in memory and never sent to any server
- **No Tracking**: Zero analytics, cookies, or user tracking of any kind
- **No Data Storage**: Files are never stored on disk or database
- **Offline Ready**: Works offline after initial load (PWA compatible)
- **Open Architecture**: All processing code is transparent and auditable

## Supported Browsers

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Opera 76+

## Technologies Used

- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **pdf-lib**: Client-side PDF creation and manipulation
- **PDF.js**: PDF rendering and text extraction
- **Tesseract.js**: OCR using WebAssembly
- **Shadcn/UI**: Accessible component library

## Getting Started

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Type Checking

```bash
npm run type-check
```

## Deployment

### Deploy to Vercel (Recommended)

This project is optimized for Vercel deployment with zero-configuration:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel and push to deploy automatically.

### Environment Variables

No environment variables are required for basic functionality. The app is designed to work with zero configuration.

Optional:
- `NEXT_PUBLIC_APP_NAME`: Application name (default: "Your Private PDF")

See `.env.example` for available options.

## Project Structure

```
├── app/
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles with design tokens
│   └── blog/
│       ├── layout.tsx       # Blog layout
│       ├── page.tsx         # Blog listing page
│       └── [slug]/page.tsx  # Individual blog post page
├── components/
│   ├── ui/                  # Shadcn UI components
│   ├── converters/          # Tool-specific converter components
│   ├── pdf-converter.tsx    # Main application container
│   ├── tool-grid.tsx        # Tool selection grid
│   ├── header.tsx           # App header
│   ├── footer.tsx           # App footer
│   ├── faq-section.tsx      # FAQ section
│   └── blog-section.tsx     # Blog preview section
├── lib/
│   └── utils.ts             # Utility functions
├── public/
│   ├── robots.txt           # SEO robots configuration
│   └── sitemap.xml          # SEO sitemap
└── package.json             # Dependencies and scripts
```

## Performance Considerations

### Large Files
- PDF to Text: Fast for most PDFs, slower for scanned documents with OCR
- Image to PDF: Supports up to 100 images; processing time increases with image count
- Compress PDF: Aggressive compression trades quality for size; vector-heavy PDFs may not compress significantly

### Low-End Devices
- Progress indicators show processing status
- Heavy operations (OCR, large PDFs) may take longer on older devices
- Consider reducing image quality or quantity for memory-constrained environments

### Browser Limits
- File size handling depends on available RAM
- Most modern browsers can handle 50-100MB files
- Very large PDFs (>500MB) may cause browser slowdown or crashes

## Limitations

1. **Already Optimized PDFs**: Files that are already compressed may see minimal size reduction
2. **Vector-Heavy PDFs**: Documents with primarily vector graphics may not compress as much as raster-heavy PDFs
3. **Complex Layouts**: Extremely complex PDF layouts may lose some formatting during compression
4. **Encrypted PDFs**: Password-protected PDFs cannot be processed
5. **OCR Accuracy**: OCR quality depends on document scan quality and language complexity

## Development

### Code Style
- TypeScript for type safety
- ESLint for code linting
- Component-based architecture with React best practices

### Testing
Run the linter:
```bash
npm run lint
```

### Adding New Features
1. Create new converter component in `components/converters/`
2. Add tool configuration to `components/tool-grid.tsx`
3. Import and integrate in `components/pdf-converter.tsx`
4. Update main router logic for navigation

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| PDF Processing | ✓ | ✓ | ✓ | ✓ |
| WebAssembly | ✓ | ✓ | ✓ | ✓ |
| Web Workers | ✓ | ✓ | ✓ | ✓ |
| Canvas API | ✓ | ✓ | ✓ | ✓ |

## FAQ

**Q: Is my data really private?**
A: Yes. All processing happens in your browser using client-side technologies. Files are never sent to any server and are automatically deleted from memory after processing.

**Q: Can you see my files?**
A: No. We have no server access to your files, and we don't use any analytics or tracking.

**Q: Does it work offline?**
A: Yes, after the initial load. Your Private PDF is designed to work completely offline.

**Q: Why is compression limited?**
A: Lossy compression requires careful image quality management. Your Private PDF uses client-side algorithms optimized for privacy, not maximum compression.

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or suggestions, please open an issue on GitHub or visit our website.

---

**Made with privacy in mind.** Your files, your control.
