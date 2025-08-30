import { ImagesMap, loadHumanAssets, loadIcons, loadObstacleAssets, loadPlayerAssets } from "./load";

export class ImageStorage {

  public static obstacles: HTMLImageElement[] = [];

  public static playerImages: ImagesMap;

  public static humanImages: ImagesMap;

  public static icons: ImagesMap;

  public static async init(): Promise<void> {
    ImageStorage.obstacles = await loadObstacleAssets();
    ImageStorage.playerImages = await loadPlayerAssets();
    ImageStorage.humanImages = await loadHumanAssets();
    ImageStorage.icons = await loadIcons();
  }
}
