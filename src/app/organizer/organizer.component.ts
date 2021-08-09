import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { switchMap } from 'rxjs/operators';
import { DateService } from '../shared/date.service';
import { TasksService } from '../shared/tasks.service';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {

  form: FormGroup | null = null

  public tasks$ = this.dateService.date.pipe(
    switchMap(value=> this.tasksService.load(value))
  )

  constructor(public dateService: DateService, private tasksService: TasksService) {  }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    })
  }

  submit() {
    if (this.form) {
      const {title} = this.form.value

      const task = {
        title,
        date: this.dateService.date.value.format('DD-MM-YYYY')
      }

      this.tasksService.create(task).subscribe(task => {
        this.tasks$ = this.dateService.date.pipe(
          switchMap(value=> this.tasksService.load(value))
        )
        this.form?.reset()
      }, err => console.log(err))

    }
  }

  remove(task: any) {
    this.tasksService.remove(task).subscribe(() => {
      this.tasks$ = this.dateService.date.pipe(
        switchMap(value=> this.tasksService.load(value))
      )
    }, err => console.log(err))
  }
}
