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



}
