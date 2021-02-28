import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TodoService } from '../app/todos/todo.service';
import { Todo } from '../app/todos/todo';

/**
 * A "mock" version of the `Todoservice` that can be used to test components
 * without having to create an actual service.
 */
@Injectable()
export class MockTodoService extends TodoService {
  public static testTodos: Todo[] = [
    {
      _id: '38895985ae3b752b124e7663',
      owner: 'Blanche',
      status: 'false',
      body: 'In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.',
      category: 'software design'
    },
    {
      _id: '58895985ae3b752b124e7663',
      owner: 'Fry',
      status: 'false',
      body: 'Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.',
      category: 'video games'
    },
    {
      _id: '58895985ae3b752b124e7663',
      owner: 'Bob',
      status: 'true',
      body: 'Ullamco irure laborum magna dolor non. Anim occaecat adipisicing cillum eu magna in.',
      category: 'homework'
    },
  ];

  constructor() {
    super(null);
  }

  getTodos(filters: { body?: string; owner?: string; order?: string }): Observable<Todo[]> {
    return of(MockTodoService.testTodos);
  }

  getTodoById(id: string): Observable<Todo> {
    // If the specified ID is for the first test user,
    // return that user, otherwise return `null` so
    // we can test illegal user requests.
    if (id === MockTodoService.testTodos[0]._id) {
      return of(MockTodoService.testTodos[0]);
    } else {
      return of(null);
    }
  }


}
