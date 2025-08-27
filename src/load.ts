export async function loadObstacleAssets(): Promise<HTMLImageElement[]> {
  const imagePromises: Promise<HTMLImageElement>[] = [];

  // Obstacles
  const obstacles = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  for (const obs of obstacles) {
    const image = new Image(16, 16);
    image.src = `/assets/obstacles/${obs}.png`;
    imagePromises.push(new Promise((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = () => reject();
    }));
  }

  return Promise.all(imagePromises);
}

export async function loadPlayerAssets(): Promise<Map<string, HTMLImageElement>> {
  const catImages = ['back-cat', 'side-cat'];
  const imagesMap = new Map<string, HTMLImageElement>();
  const imagePromises: Promise<HTMLImageElement>[] = [];

  for (const cat of catImages) {
    const image = new Image(16, 16);
    image.src = `/assets/player/${cat}.png`;
    imagesMap.set(cat, image);
    imagePromises.push(new Promise((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = () => reject();
    }));
  }

  await Promise.all(imagePromises);
  return imagesMap;
}
