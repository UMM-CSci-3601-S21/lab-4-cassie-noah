import { Todo } from 'src/app/todos/todo';

export class AddTodoPage{
  navigateTo(){
    return cy.visit('/todos/new');
  }

  getTitle(){
    return cy.get('.add-todo-title');
  }
  addTodoButton(){
    return cy.get('[data-test=confirmAddTodoButton]');
  }
  selectMatSelectValue(select: Cypress.Chainable, value: string) {
    // Find and click the drop down
    return select.click()
      // Select and click the desired value from the resulting menu
      .get(`mat-option[value="${value}"]`).click();
  }
  getFormField(formField: string){
    return cy.get(`mat-form-field [formControlName=${formField}]`);

  }

  getErrorField(formField: string){
    return cy.get(`mat-error[data-test=${formField}]`);
  }

  addTodo(newTodo: Todo) {
    this.getFormField('owner').type(newTodo.owner);
    this.getFormField('status').type(newTodo.status.toString());
    if (newTodo.category) {
      this.getFormField('category').type(newTodo.category);
    }
    if (newTodo.body) {
      this.getFormField('body').type(newTodo.body);
    }
    return this.addTodoButton().click();
  }
}
