import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TodoListComponent } from './todo-list.component';
import { TodoService } from './todo.service';
import { MockTodoService } from '../../testing/todo.service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { Todo } from './todo';


const COMMON_IMPORTS: any[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatSnackBarModule,
  BrowserAnimationsModule,
  RouterTestingModule,
  HttpClientTestingModule
];


describe('TodoListComponent', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [ COMMON_IMPORTS ],
      declarations: [TodoListComponent],
      providers: [{ provide: TodoService, useClass: MockTodoService }],
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
    fixture = TestBed.createComponent(TodoListComponent);
    todoList = fixture.componentInstance;
    fixture.detectChanges();
    todoList.getTodosFromServer();
    });
  }));



  it('should create', () => {
    expect(todoList).toBeTruthy();
  });



});

