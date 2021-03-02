import { inRange } from 'cypress/types/lodash';
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

  it('should show error messages for invalid inputs', () => {
    cy.get('[data-test=bodyError]').should('not.exist');

    page.getFormField('owner').click().blur();
    cy.get('[data-test=ownerError]').should('exist').and('be.visible');

    page.getFormField('owner').type('P').blur();
    cy.get('[data-test=ownerError]').should('exist').and('be.visible');
    page.getFormField('owner').clear().type('This is a very long owner that goes beyond the 50 character limit').blur();
    cy.get('[data-test=ownerError]').should('exist').and('be.visible');
    // Entering a valid owner should remove the error.
    page.getFormField('owner').clear().type('Horse Boy').blur();
    cy.get('[data-test=ownerError]').should('not.exist');

    // Before doing anything there shouldn't be an error
    cy.get('[data-test=statusError]').should('not.exist');
    // Just clicking the status field without entering anything should cause an error message
    page.getFormField('status').click().blur();
    // Some more tests for various invalid status inputs
    cy.get('[data-test=statusError]').should('exist').and('be.visible');
    page.getFormField('status').type('5').blur();
    cy.get('[data-test=statusError]').should('exist').and('be.visible');
    page.getFormField('status').clear().type('HOrseies').blur();
    cy.get('[data-test=statusError]').should('exist').and('be.visible');
    page.getFormField('status').clear().type('9').blur();
    cy.get('[data-test=statusError]').should('exist').and('be.visible');
    // Testing status with different caps
    page.getFormField('status').clear().type('false').blur();
    cy.get('[data-test=statusError]').should('not.exist');
    page.getFormField('status').clear().type('true').blur();
    cy.get('[data-test=statusError]').should('not.exist');
    page.getFormField('status').clear().type('True').blur();
    cy.get('[data-test=statusError]').should('not.exist');
    page.getFormField('status').clear().type('False').blur();
    cy.get('[data-test=statusError]').should('not.exist');

    // Before doing anything there shouldn't be an error
    cy.get('[data-test=bodyError]').should('not.exist');
    page.getFormField('body').click().blur();
    cy.get('[data-test=bodyError]').should('exist').and('be.visible');
    // having nothing for the body should throw an error
    // typing a valid body should fix the error
    page.getFormField('body').clear().type('I like horses').blur();
    cy.get('[data-test=bodyError]').should('not.exist');
  });
  describe('Adding a new Todo', () => {
    beforeEach(() => {
      cy.task('seed:database');
    });

    it('should go to the right page and contain the correct information', () =>{
      const todo: Todo = {
        _id: null,
        owner: 'Horse Boy',
        status: 'false',
        category: 'horses',
        body: 'I like horses'
      };
      page.addTodo(todo);

      // We should have stayed on the new user page
      cy.url()
        .should('not.match', /\/todos\/[0-9a-fA-F]{24}$/)
        .should('match', /\/todos\/new$/);
      // We should see the confirmation message at the bottom of the screen
      cy.get('.mat-simple-snackbar').should('contain', `Added Todo`);
    });
  });
});



