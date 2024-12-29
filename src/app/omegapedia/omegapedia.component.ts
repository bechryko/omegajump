import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { OJButtonComponent } from '@omegajump-shared/components';
import { Path } from '@omegajump-shared/enums';

@Component({
  selector: 'oj-omegapedia',
  imports: [TranslocoPipe, OJButtonComponent],
  templateUrl: './omegapedia.component.html',
  styleUrl: './omegapedia.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OmegapediaComponent {
  public readonly router = inject(Router);

  public navigateToMainMenu(): void {
    this.router.navigateByUrl(Path.MAIN_MENU);
  }
}
