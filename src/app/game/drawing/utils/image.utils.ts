export class ImageUtils {
  private static loadedImageMap: Record<string, HTMLImageElement> = {};

  public static getImage(imageSrc: string): HTMLImageElement {
    if (!this.loadedImageMap[imageSrc]) {
      this.loadedImageMap[imageSrc] = new Image();
      this.loadedImageMap[imageSrc].src = imageSrc;
    }
    return this.loadedImageMap[imageSrc];
  }

  public static resetLoadedImages(): void {
    this.loadedImageMap = {};
  }
}
