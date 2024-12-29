import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'oj-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OJButtonComponent {
  // eslint-disable-next-line @angular-eslint/no-output-native
  public readonly click = output<void>();

  public onClick(event: MouseEvent): void {
    event.stopPropagation();
    this.click.emit();
  }
}
