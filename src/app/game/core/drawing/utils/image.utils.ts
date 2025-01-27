import { forkJoin, map, Observable } from 'rxjs';

export class ImageUtils {
  private static readonly IMAGES_TO_PRELOAD = {
    images: {
      platforms: ['solid', 'blue_energy', 'empty_energy', 'confuse', 'black_hole', 'cloaker', 'transformer']
    },
    animations: {
      attributes: ['booster']
    }
  };
  private static readonly DEFAULT_EXTENSION = 'png';

  private static loadedImageMap: Record<string, HTMLImageElement> = {};

  public static preloadAllImages(): Observable<boolean> {
    return forkJoin(ImageUtils.getImageSrcList(ImageUtils.IMAGES_TO_PRELOAD).map(imageSrc => ImageUtils.preloadImage(imageSrc))).pipe(
      map(successList => successList.every(success => success))
    );
  }

  public static getImage(imageSrc: string): HTMLImageElement {
    if (!ImageUtils.loadedImageMap[imageSrc]) {
      throw new Error(`Image ${imageSrc} is not loaded`);
    }
    return ImageUtils.loadedImageMap[imageSrc];
  }

  private static preloadImage(imageSrc: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      if (ImageUtils.loadedImageMap[imageSrc]) {
        observer.next(true);
        observer.complete();
        return;
      }

      const image = new Image();
      image.onload = () => {
        ImageUtils.loadedImageMap[imageSrc] = image;
        observer.next(true);
        observer.complete();
      };
      image.onerror = () => {
        observer.next(false);
        observer.complete();
      };
      image.src = imageSrc;
    });
  }

  private static getImageSrcList(images: {}): string[] {
    return Object.entries(images).reduce<string[]>((acc, [path, subImages]) => {
      if (Array.isArray(subImages)) {
        return [...acc, ...subImages.map(subImage => `${path}/${subImage}.${ImageUtils.DEFAULT_EXTENSION}`)];
      }
      return [...acc, ...ImageUtils.getImageSrcList(subImages as {}).map(subImage => `${path}/${subImage}`)];
    }, []);
  }
}
