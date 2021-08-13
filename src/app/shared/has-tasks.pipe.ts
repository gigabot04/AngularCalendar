import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'hasTasks'
})
export class HasTasksPipe implements PipeTransform {

  transform(value: string, dates: Observable<string[]>): Observable<boolean> {
    return dates.pipe(map(datesArr => {
        return datesArr.includes(value)
      }
    ))
  }

}
