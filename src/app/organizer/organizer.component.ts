import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DateService } from '../shared/date.service';
import { TasksService } from '../shared/tasks.service';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})

export class OrganizerComponent implements OnInit, AfterViewInit {

  form: FormGroup | null = null

  private refresh = new Subject()

  public tasks$ = this.refresh
    .pipe(
      switchMap(()=>this.dateService.date),
      switchMap(value=>this.tasksService.load(value))
    )

  constructor(public dateService: DateService, private tasksService: TasksService) {  }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    })
  }

  ngAfterViewInit(): void {
    this.refresh.next()
  }

  submit() {
    if (this.form) {
      const {title} = this.form.value

      const task = {
        title,
        date: this.dateService.date.value.format('DD-MM-YYYY')
      }
      this.tasksService.create(task).subscribe(task => {
        this.refresh.next()
        this.tasksService.loadDates.next()
        this.form?.reset()
      }, err => console.log(err))

    }
  }

  remove(task: any) {
    this.tasksService.remove(task).subscribe(() => {
      this.tasksService.loadDates.next()
      this.refresh.next()
    }, err => console.log(err))
  }
}
