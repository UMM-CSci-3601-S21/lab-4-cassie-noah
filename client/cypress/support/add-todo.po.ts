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



}
