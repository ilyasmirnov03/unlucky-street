export type ImagesMap = Map<string, HTMLImageElement>;

async function getAssetsWithMap(
  assets: string[],
  rootPath: string,
  width = 16,
  height = 16,
): Promise<ImagesMap> {
  const imagePromises: Promise<HTMLImageElement>[] = [];
  const imagesMap = new Map<string, HTMLImageElement>();

  for (const asset of assets) {
    const image = new Image(width, height);
    image.src = `${rootPath}/${asset}.png`;
    imagesMap.set(asset, image);
    imagePromises.push(new Promise((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = (e) => reject(e);
    }));
  }

  await Promise.all(imagePromises);
  return imagesMap;
}

export async function loadObstacleAssets(): Promise<HTMLImageElement[]> {
  const imagePromises: Promise<HTMLImageElement>[] = [];

  // Obstacles
  const obstacles = ['1'];
  for (const obs of obstacles) {
    const image = new Image(16, 16);
    image.src = `./assets/obstacles/${obs}.png`;
    imagePromises.push(new Promise((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = (e) => reject(e);
    }));
  }

  return Promise.all(imagePromises);
}

export async function loadPlayerAssets(): Promise<ImagesMap> {
  const catImages = ['back-cat', 'side-cat'];
  return await getAssetsWithMap(catImages, './assets/player');
}

export async function loadHumanAssets(): Promise<ImagesMap> {
  const humanImages = ['human', 'hat1', 'hat2', 'hat3', 'hat4'];
  return await getAssetsWithMap(humanImages, './assets/human', 16, 32);
}

export async function loadIcons(): Promise<ImagesMap> {
  const humanImages = ['angry', 'happy', 'pockerface', 'empty'];
  return await getAssetsWithMap(humanImages, './assets/icons', 16, 16);
}

export async function loadCandy(): Promise<ImagesMap> {
  const candyImages = ['fish'];
  return await getAssetsWithMap(candyImages, './assets/candy', 8, 5);
}
