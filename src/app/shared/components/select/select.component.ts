import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  HostListener,
  input,
  model,
  OnDestroy,
  signal
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { OJOptionComponent } from '../option/option.component';

@Component({
  selector: 'oj-select',
  imports: [TranslocoPipe, OJOptionComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OJSelectComponent<T> implements OnDestroy {
  private readonly options = contentChildren(OJOptionComponent<T>);
  private readonly optionValues = computed(() => this.options().map(option => option.value()));
  private readonly globalEventHandlerRef = this.onGlobalClick.bind(this);
  public readonly extraOptionValue = computed(() => {
    const optionComponents = this.options();
    if (optionComponents?.length) {
      const extraOption = optionComponents.find(option => option.value === this.defaultValue());
      if (extraOption) {
        return undefined;
      }
    }
    return this.defaultValue();
  });
  public readonly defaultValue = input<T>();
  public readonly defaultValueLabelKey = input<string>('COMPONENTS.SELECT.DEFAULT_NO_OPTION_LABEL');
  public readonly value = model<T | undefined>(this.defaultValue());
  public readonly open = signal(false);

  constructor() {
    effect(() => {
      const optionComponents = this.options();
      if (optionComponents?.length) {
        optionComponents.forEach(component => {
          component.onClick = (): void => {
            this.selectValue(component.value());
          };
        });
      }
    });

    effect(() => {
      const currentValue = this.value();
      const defaultValue = this.defaultValue();
      if (currentValue !== defaultValue && !this.optionValues().includes(currentValue!)) {
        this.value.set(defaultValue);
      }
    });

    globalThis.addEventListener('click', this.globalEventHandlerRef);
  }

  public ngOnDestroy(): void {
    globalThis.removeEventListener('click', this.globalEventHandlerRef);
  }

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  public closeDropdown(): void {
    this.open.set(false);
  }

  public toggleDropdown(): void {
    this.open.update(open => !open);
  }

  public selectValue(value: T): void {
    if (this.value() !== value) {
      this.value.set(value);
      this.closeDropdown();
    }
  }

  private onGlobalClick(): void {
    if (this.open()) {
      this.closeDropdown();
    }
  }
}
