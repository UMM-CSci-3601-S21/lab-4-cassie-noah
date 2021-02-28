import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Todo } from '../todo';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss']
})
export class AddTodoComponent implements OnInit {

  addTodoForm: FormGroup;

  todo: Todo;

  addTodoValidationMessages = {
    owner: [
      {type: 'required', message: 'Owner is required'},
      {type: 'minlength', message: 'Owner must be at least 2 characters long'},
      {type: 'maxlength', message: 'Owner cannot be more than 50 characters long'},
      {type: 'pattern', message: 'Owner must be letters'}
    ],

    category: [
      {type: 'required', message: 'Category is required'},
      {type: 'minlength', message: 'Category must be at least 2 characters long'},
      {type: 'maxlength', message: 'Category cannot be more than 50 characters long'},
    ],

    status: [
      {type: 'pattern', message: 'Status must be True/False'},
      {type: 'required', message: 'Status is required'}
    ],

    body: [
      {type: 'required', message: 'Body is required' },
      {type: 'minlength', message: 'Body must be at least 2 characters long'},
    ]
  };

  constructor(private todoService: TodoService, private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router) { }

  createForms() {
    this.addTodoForm = this.fb.group({

      owner: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern('^[A-Za-z]$')
      ])),

      status: new FormControl('', Validators.compose([
        Validators.required,
        Validators.min(4),
        Validators.max(5),
        Validators.pattern('^(false|False|True|true)$')
      ])),

      category: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ])),

      body: new FormControl(),
    });

  }


  ngOnInit(): void {
    this.createForms();
  }

  submitForm() {
    this.todoService.addTodo(this.addTodoForm.value).subscribe(newID => {
      this.snackBar.open('Added Todo ' + this.addTodoForm.value.name, null, {
        duration: 2000,
      });
      this.router.navigate(['/todos/', newID]);
    }, err => {
      this.snackBar.open('Failed to add the todo', 'OK', {
        duration: 5000,
      });
    });
  }

}
