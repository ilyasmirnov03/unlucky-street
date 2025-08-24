export async function loadImages(): Promise<HTMLImageElement[]> {
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

