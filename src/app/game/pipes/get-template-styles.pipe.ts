import { Pipe, PipeTransform } from '@angular/core';
import { LocationDescription } from '@omegajump-menu/location-selection-menu/location-descriptions';

@Pipe({
  name: 'getTemplateStyles'
})
export class GetTemplateStylesPipe implements PipeTransform {
  public transform(locationDescription: LocationDescription | null): Record<string, string> | null {
    if (!locationDescription) {
      return null;
    }

    const { style } = locationDescription;
    return {
      backgroundColor: style.backgroundColor,
      color: style.fontColor,
      '--text-shadow-color': style.textShadowColor
    };
  }
}
