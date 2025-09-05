# Weekly Payslip Generator (Browser-Based)

Generate 52 weekly, professional payslips (PDF) for one year, zipped for download.

## Features
- Offline, browser-based (no backend required)
- Generates payslips as PDFs using [jsPDF](https://github.com/parallax/jsPDF)
- Packs all PDFs in a ZIP using [JSZip](https://github.com/Stuk/jszip)
- Simple, responsive form
- Calculates gross/net pay, PAYG, super, and leave accruals

## Usage

1. **Open `index.html` in your browser**  
   (No server needed—just double-click!)

2. **Fill out company and employee details**
3. **Set starting pay period (Tuesday)**
4. **Click "Generate Payslips"**
5. **Download ZIP containing 52 PDF payslips**

## Customization

- Add a company logo by extending the PDF generation in `app.js`
- Refine styles in `style.css`
- Adjust leave/PAYG rates in calculation logic

## Dependencies

- [jsPDF CDN](https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js)
- [JSZip CDN](https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js)

## License

MIT License

---

*Made by mrfortune94, powered by Copilot.*