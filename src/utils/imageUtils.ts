/**
 * Utility for resizing and compressing images taken on the field (smartphones, cameras)
 * to ensure fast rendering and safe localStorage persistence without QuotaExceeded errors.
 */

export interface ResizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * Resizes an image File (e.g. from camera or file picker) and returns a lightweight Base64 Data URL.
 */
export function compressAndResizeImage(
  file: File,
  options: ResizeOptions = {}
): Promise<string> {
  const { maxWidth = 1024, maxHeight = 768, quality = 0.82 } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original read if canvas 2d context fails
          resolve(e.target?.result as string);
          return;
        }

        // Draw image on canvas with high quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to lightweight JPEG data URL
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      img.onerror = () => {
        reject(new Error("Impossible de charger le fichier image."));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Erreur lors de la lecture du fichier."));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Curated high-resolution industrial equipment photographs for quick field selection
 */
export const INDUSTRIAL_PRESET_IMAGES = [
  {
    id: 'preset-atlas-copco',
    name: 'Compresseur à vis Atlas Copco GA (Actuel)',
    category: 'Compresseur',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    description: 'Compresseur à vis lubrifié capoté insonorisé'
  },
  {
    id: 'preset-compressor-piston',
    name: 'Compresseur industriel à pistons bi-étagé',
    category: 'Compresseur',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80',
    description: 'Groupe motocompresseur avec réservoir horizontal'
  },
  {
    id: 'preset-vertical-tank',
    name: 'Réservoir sous pression vertical (DESP)',
    category: 'Réservoir ESP',
    url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80',
    description: 'Cuve d\'air comprimé verticale 11 bar avec soupape'
  },
  {
    id: 'preset-dryer',
    name: 'Sécheur d\'air frigorifique industriel',
    category: 'Traitement d\'air',
    url: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1000&q=80',
    description: 'Sécheur frigorifique à échangeur thermique'
  },
  {
    id: 'preset-pump',
    name: 'Groupe motopompe centrifuge industrielle',
    category: 'Pompe',
    url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1000&q=80',
    description: 'Pompe de circulation avec moteur asynchrone'
  },
  {
    id: 'preset-chiller',
    name: 'Groupe froid / Refroidisseur industriel (Chiller)',
    category: 'Froid',
    url: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=1000&q=80',
    description: 'Chiller de refroidissement process'
  }
];
