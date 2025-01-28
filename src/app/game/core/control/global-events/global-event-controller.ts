import { filter, Observable, Subject } from 'rxjs';
import { GlobalEvent } from './global-events';

export class GlobalEventController {
  private readonly _events$ = new Subject<GlobalEvent>();

  public dispatchEvent(event: GlobalEvent): void {
    this._events$.next(event);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public watchEvents<T extends GlobalEvent>(eventConstructor: new (...args: any[]) => T): Observable<T> {
    return this._events$.pipe(filter((event): event is T => event instanceof eventConstructor));
  }
}
