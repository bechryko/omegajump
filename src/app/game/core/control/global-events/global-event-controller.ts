import { filter, Observable, Subject } from 'rxjs';
import { GlobalEvent } from './global-events';

export class GlobalEventController {
  private readonly _events$: Subject<GlobalEvent> = new Subject();

  public dispatchEvent(event: GlobalEvent): void {
    this._events$.next(event);
  }

  public watchEvents<T extends GlobalEvent>(eventConstructor: new (...args: any[]) => T): Observable<T> {
    return this._events$.pipe(filter((event): event is T => event instanceof eventConstructor));
  }
}
