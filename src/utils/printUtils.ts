import jsPDF from 'jspdf';
import { toJpeg } from 'html-to-image';

/**
 * Pre-converts images in an element to base64 Data URLs so that rendering
 * can proceed without CORS canvas tainting issues.
 */
async function inlineImagesAsBase64(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll('img'));
  const promises = images.map(async (img) => {
    if (!img.src || img.src.startsWith('data:')) return;
    try {
      const resp = await fetch(img.src, { mode: 'cors' });
      if (!resp.ok) throw new Error('Image fetch failed');
      const blob = await resp.blob();
      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          img.src = reader.result as string;
          resolve();
        };
        reader.onerror = () => resolve();
        reader.readAsDataURL(blob);
      });
    } catch {
      // If external fetch is blocked, replace with an inline SVG placeholder so canvas doesn't taint
      const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%230b1c36"/><text x="50%" y="45%" fill="%2338bdf8" font-family="sans-serif" font-weight="bold" font-size="20" text-anchor="middle">ÉQUIPEMENT INDUSTRIEL</text><text x="50%" y="60%" fill="%2394a3b8" font-family="monospace" font-size="14" text-anchor="middle">${encodeURIComponent(img.alt || 'Machine')}</text></svg>`;
      img.src = fallbackSvg;
    }
  });

  await Promise.all(promises);
}

/**
 * Generates and downloads a real, high-resolution A4 PDF file using jsPDF and html-to-image.
 * Uses browser-native SVG/Canvas rendering which natively supports modern CSS (oklch, CSS variables, etc.).
 */
export async function exportElementToPdf(
  element: HTMLElement, 
  filename: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Inline any external images to ensure they don't break canvas
    await inlineImagesAsBase64(element);

    // 2. Measure exact element dimensions without scroll or outer margins
    const elementWidth = element.offsetWidth || element.clientWidth || 800;
    const elementHeight = element.offsetHeight || element.scrollHeight || 1100;
    const computedPadding = window.getComputedStyle(element).padding;

    // 3. Render element to high-res JPEG data URL (pixelRatio: 2 = ~300 DPI)
    // Force zero outer margins so the cloned SVG foreignObject doesn't offset or clip the content!
    const imgData = await toJpeg(element, {
      quality: 0.98,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      skipFonts: true,
      cacheBust: true,
      width: elementWidth,
      height: elementHeight,
      style: {
        margin: '0',
        marginLeft: '0',
        marginRight: '0',
        marginTop: '0',
        marginBottom: '0',
        padding: computedPadding,
        boxSizing: 'border-box',
        left: '0',
        top: '0',
        width: `${elementWidth}px`,
        maxWidth: `${elementWidth}px`,
        transform: 'none',
      }
    });

    // 4. Load image to measure exact natural dimensions
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Erreur de chargement de l'image de synthèse"));
      img.src = imgData;
    });

    // 5. Create PDF with standard A4 dimensions (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pageWidth = 210; // mm
    const pageHeight = 297; // mm
    const sideMargin = 10; // 10mm left and 10mm right for balanced presentation
    const topBottomMargin = 10; // 10mm top and bottom
    const availableWidth = pageWidth - (sideMargin * 2); // 190mm
    const availableHeight = pageHeight - (topBottomMargin * 2); // 277mm

    // Target dimensions in mm when scaled to availableWidth
    const naturalRatio = img.naturalHeight / img.naturalWidth;
    let targetWidth = availableWidth;
    let targetHeight = targetWidth * naturalRatio;

    // Slicing parameters based on original image pixels
    const mmPerPx = targetWidth / img.naturalWidth;
    // How many pixels of the source image fit in one A4 printable height
    const pageHeightInPx = availableHeight / mmPerPx;

    if (targetHeight <= availableHeight) {
      // Case 1: Perfectly fits on a single A4 page
      const startX = (pageWidth - targetWidth) / 2;
      const startY = Math.max(topBottomMargin, (pageHeight - targetHeight) / 2);
      pdf.addImage(imgData, 'JPEG', startX, startY, targetWidth, targetHeight);
    } else if (targetHeight <= availableHeight * 1.25) {
      // Case 2: Document is slightly longer (up to 25% over 1 page).
      // Scale it neatly to fit 100% on a single professional A4 page without clipping or awkward splitting!
      const scale = availableHeight / targetHeight;
      const fittedWidth = targetWidth * scale;
      const fittedHeight = availableHeight;
      const startX = (pageWidth - fittedWidth) / 2;
      pdf.addImage(imgData, 'JPEG', startX, topBottomMargin, fittedWidth, fittedHeight);
    } else {
      // Case 3: Truly multi-page document.
      // Slicing: create distinct canvas slices so each page contains ONLY its own vertical segment,
      // preventing repetition, scrolling overlap, or incomplete rendering across pages.
      let sourceY = 0;
      let pageIndex = 0;

      while (sourceY < img.naturalHeight) {
        if (pageIndex > 0) {
          pdf.addPage();
        }

        const currentSliceHeightPx = Math.min(pageHeightInPx, img.naturalHeight - sourceY);
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = img.naturalWidth;
        sliceCanvas.height = currentSliceHeightPx;

        const ctx = sliceCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
          ctx.drawImage(
            img,
            0,
            sourceY,
            img.naturalWidth,
            currentSliceHeightPx,
            0,
            0,
            img.naturalWidth,
            currentSliceHeightPx
          );

          const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.98);
          const sliceHeightMm = currentSliceHeightPx * mmPerPx;
          const startX = (pageWidth - targetWidth) / 2;

          pdf.addImage(sliceData, 'JPEG', startX, topBottomMargin, targetWidth, sliceHeightMm);
        }

        sourceY += currentSliceHeightPx;
        pageIndex++;
      }
    }

    const cleanName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    pdf.save(cleanName);

    return { success: true };
  } catch (err: any) {
    console.error('Error generating PDF:', err);
    return { success: false, error: err?.message || 'Erreur lors de la génération du PDF' };
  }
}

/**
 * Attempts native system print. In environments like AI Studio sandboxed iframes,
 * browser security blocks window.print(). In that case, it seamlessly exports the PDF.
 */
export async function printOrDownloadPdf(
  element: HTMLElement,
  title: string,
  filename: string
): Promise<{ success: boolean; method: 'print' | 'pdf'; message?: string }> {
  // Check if we are running in a restricted iframe
  const inIframe = window.self !== window.top;

  if (!inIframe) {
    try {
      window.print();
      return { success: true, method: 'print' };
    } catch (e) {
      console.warn('Native window.print() failed:', e);
    }
  }

  // In an iframe (or if window.print failed/blocked), generate the real PDF directly!
  const res = await exportElementToPdf(element, filename);
  if (res.success) {
    return { 
      success: true, 
      method: 'pdf', 
      message: "Votre fiche officielle A4 a été générée et téléchargée au format PDF haute résolution prêt à être imprimé."
    };
  }

  return { success: false, method: 'pdf', message: res.error };
}

/**
 * Safe print helper that opens or prints with full styles, or downloads the PDF.
 */
export function safePrintDocument(title: string, htmlContent: string): Promise<boolean> {
  downloadPrintableFile(`${title}.html`, title, htmlContent);
  return Promise.resolve(true);
}

/**
 * Generates a self-contained, fully styled HTML document.
 * Uses explicit RGB/HEX CSS rules so that when opened in any browser (even offline),
 * it displays with complete visual formatting without relying on external styles.
 */
export function getFullPrintHtml(title: string, bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 10mm 10mm 10mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #f1f5f9;
      line-height: 1.35;
      font-size: 11px;
      margin: 0;
      padding: 20px;
    }
    .print-sheet-container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 30px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 5px 8px;
      text-align: left;
    }
    th {
      background-color: #f1f5f9 !important;
      font-weight: 700;
      color: #334155;
    }
    img {
      max-width: 100%;
      height: auto;
      display: block;
    }
    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
      }
      .print-sheet-container {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        max-width: 100% !important;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-sheet-container">
    ${bodyContent}
  </div>
</body>
</html>`;
}

/**
 * Downloads the document as a fully styled standalone HTML file
 */
export function downloadPrintableFile(filename: string, title: string, htmlContent: string) {
  const fullHtml = getFullPrintHtml(title, htmlContent);
  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
