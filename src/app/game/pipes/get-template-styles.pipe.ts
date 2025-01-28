import { Pipe, PipeTransform } from '@angular/core';
import { LocationDescription } from '@omegajump-menu/location-selection-menu/location-descriptions';

@Pipe({
  name: 'getTemplateStyles'
})
export class GetTemplateStylesPipe implements PipeTransform {
  public transform(locationDescription: LocationDescription | null, aspectRatio: string): Record<string, string> | null {
    if (!locationDescription) {
      return null;
    }

    const { style } = locationDescription;
    /* eslint-disable @typescript-eslint/naming-convention */
    return {
      backgroundColor: style.backgroundColor,
      color: style.fontColor,
      '--text-shadow-color': style.textShadowColor,
      aspectRatio
    };
    /* eslint-enable @typescript-eslint/naming-convention */
  }
}
