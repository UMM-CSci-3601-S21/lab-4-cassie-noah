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
    page.getFormField('owner').type('Test');
    page.addTodoButton().should('be.disabled');
    page.addTodoButton().should('be.disabled');
    page.getFormField('category').type('hamburgers');
    page.addTodoButton().should('be.disabled');
    page.addTodoButton().should('be.disabled');
    page.getFormField('status').type('false');
    page.addTodoButton().should('be.disabled');
    page.getFormField('body').type('test body');
    page.addTodoButton().should('be.enabled');
  });


});
