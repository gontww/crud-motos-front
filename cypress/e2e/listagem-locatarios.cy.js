/// <reference types="cypress" />

describe('Tela de Listagem de Locatários', () => {
  beforeEach(() => {
    // Simula usuário autenticado
    window.localStorage.setItem('token', 'jwt-token-teste')
    // Mocka a resposta da listagem de locatários
    cy.fixture('locatarios.json').then((locatarios) => {
      cy.intercept('GET', '**/locatarios', locatarios).as('getLocatarios')
    })
    cy.visit('/listagem-locatario')
    cy.wait('@getLocatarios')
  })

  it('deve exibir a lista de locatários', () => {
    cy.get('.el-table').should('exist')
    cy.get('.el-table__row').should('have.length', 2)
    cy.contains('João da Silva')
    cy.contains('Maria Oliveira')
  })

  it('deve abrir o modal de cadastro ao clicar em Cadastrar Locatário', () => {
    cy.contains('Cadastrar Locatário').click()
    cy.get('.el-dialog__title').should('contain', 'Cadastrar Novo Locatário')
    cy.get('input[placeholder="Ex: João da Silva"]').should('exist')
  })

  it.only('deve cadastrar um novo locatário', () => {
    cy.intercept('POST', '**/locatarios', {
      id: 3,
      nome: 'Carlos Souza',
      cpf: '084.937.908-34',
      telefone: '(31) 91234-5678',
      email: 'carlos@email.com',
    }).as('postLocatario')
    cy.contains('Cadastrar Locatário').click()
    cy.get('input[placeholder="Ex: João da Silva"]').type('Carlos Souza')
    cy.get('input[placeholder="Ex: 123.456.789-00"]').type('084.937.908-34')
    cy.get('input[placeholder="Ex: (11) 91234-5678"]').type('(31) 91234-5678')
    cy.get('input[placeholder="Ex: joao@email.com"]').type('carlos@email.com')
    cy.contains('Salvar').click()
    cy.wait('@postLocatario')
    cy.contains('Locatário cadastrado com sucesso!')
  })

  it('deve abrir o modal de edição ao clicar em Editar', () => {
    cy.get('.el-table__row').first().contains('Editar').click()
    cy.get('.el-dialog__title').should('contain', 'Editar Locatário')
    cy.get('input[placeholder="Ex: João da Silva"]').should('exist')
  })

  it('deve editar um locatário', () => {
    cy.intercept('PUT', '**/locatarios/1', {
      id: 1,
      nome: 'João da Silva Editado',
      cpf: '000.000.141-41',
      telefone: '(11) 91234-5678',
      email: 'joao@email.com',
    }).as('putLocatario')
    cy.get('.el-table__row').first().contains('Editar').click()
    cy.get('input[placeholder="Ex: João da Silva"]').clear().type('João da Silva Editado')
    cy.contains('Atualizar').click()
    cy.wait('@putLocatario')
    cy.contains('Locatário atualizado com sucesso!')
  })

  it('deve excluir um locatário', () => {
    cy.intercept('DELETE', '**/locatarios/1', {}).as('deleteLocatario')
    cy.get('.el-table__row').first().contains('Excluir').click()
    cy.contains('Sim').click()
    cy.wait('@deleteLocatario')
    cy.contains('Locatário "João da Silva" excluído com sucesso!')
  })
})
