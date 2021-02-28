import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockUserService } from 'src/testing/user.service.mock';
import { AddTodoComponent } from './add-todo.component';
import { TodoService } from '../todo.service';
import { MockTodoService } from 'src/testing/todo.service.mock';

describe('AddTodoComponent', () => {
  let component: AddTodoComponent;
  let addTodoForm: FormGroup;
  let fixture: ComponentFixture<AddTodoComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      declarations: [AddTodoComponent],
      providers: [{ provide: TodoService,  useValue: new MockTodoService() }],
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTodoComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
    addTodoForm = component.addTodoForm;
    expect(addTodoForm).toBeDefined();
    expect(addTodoForm.controls).toBeDefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(addTodoForm).toBeTruthy();
  });


});
