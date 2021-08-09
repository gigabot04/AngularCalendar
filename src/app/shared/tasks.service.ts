import { HttpClient } from "@angular/common/http";
import { Injectable, Pipe } from "@angular/core";
import * as moment from "moment";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface Task {
  id?: string
  title: string
  date: string
}

interface CreateResponce {
  name: string
}

@Injectable({providedIn: 'root'})
export class TasksService {
  static url = 'https://angular-gigabot-calendar-default-rtdb.firebaseio.com/tasks'

  constructor(private http: HttpClient) {
  }

  load(date: moment.Moment):Observable<Task[]> {
    return this.http
      .get<Task[]>(`${TasksService.url}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map(tasks => {
        if (!tasks) {
          return []
        }
        return Object.keys(tasks).map((key: any) => ({...tasks[key], id: key}))
      }))
  }

  create(task: Task): Observable<Task> {
    return this.http
      .post<CreateResponce>(`${TasksService.url}/${task.date}.json`, task)
      .pipe(map((res) => {
        return {...task, id: res.name}
      }))
  }

  remove(task: Task): Observable<Task> {
    return this.http.delete<Task>(`${TasksService.url}/${task.date}/${task.id}.json`)
  }
}
