/**
 * Utility to compress images before saving to localStorage to prevent QuotaExceededError
 */
export async function compressImage(
  dataUrlOrFile: string | File,
  maxDimension: number = 1080,
  quality: number = 0.85
): Promise<string> {
  return new Promise((resolve) => {
    try {
      let src = '';
      if (typeof dataUrlOrFile === 'string') {
        src = dataUrlOrFile;
        // If it's not a data URL or small enough, resolve directly
        if (!src.startsWith('data:image') || src.length < 80000) {
          resolve(src);
          return;
        }
      } else {
        src = URL.createObjectURL(dataUrlOrFile);
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(typeof dataUrlOrFile === 'string' ? dataUrlOrFile : src);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };

      img.onerror = () => {
        resolve(typeof dataUrlOrFile === 'string' ? dataUrlOrFile : src);
      };

      img.src = src;
    } catch {
      resolve(typeof dataUrlOrFile === 'string' ? dataUrlOrFile : '');
    }
  });
}
