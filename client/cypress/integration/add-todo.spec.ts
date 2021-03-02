import {Todo } from 'src/app/todos/todo';
import {AddTodoPage} from '../support/add-todo.po';

describe('Add Todo', () => {
  const page = new AddTodoPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTitle().should('have.text', 'New Todo');
  });

  it('Should enable and disable the add todo button', () => {
    page.addTodoButton().should('be.disabled');
  });
});
