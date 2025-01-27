import { ResolveFn } from '@angular/router';
import { ImageUtils } from '@omegajump-core/drawing';

export const imagesPreloadResolver: ResolveFn<boolean> = () => {
  return ImageUtils.preloadAllImages();
};
