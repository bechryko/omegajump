import { ChangeDetectionStrategy, Component, HostListener, input } from '@angular/core';

@Component({
  selector: 'oj-option',
  imports: [],
  templateUrl: './option.component.html',
  styleUrl: './option.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OJOptionComponent<T> {
  public readonly value = input.required<T>();

  @HostListener('click')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onClick: () => void = () => {};
}
