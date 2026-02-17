export async function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

export async function downloadImage(canvas: HTMLCanvasElement, filename: string = 'room-design.png') {
  return new Promise<void>((resolve) => {
    canvas.toBlob(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      }
    });
  });
}

export async function captureARPhoto(modelViewerElement: HTMLElement): Promise<Blob | null> {
  try {
    const modelViewer = modelViewerElement as any;
    if (modelViewer && modelViewer.toBlob) {
      return await modelViewer.toBlob();
    }
  } catch (error) {
    console.error('Error capturing AR photo:', error);
  }
  return null;
}

export function getRecommendedProducts(categories: string[], allProducts: any[]) {
  const recommended = allProducts.filter(product => 
    categories.some(cat => product.category.toLowerCase() === cat.toLowerCase())
  );
  return recommended.length > 0 ? recommended : allProducts.slice(0, 4);
}
