/// <reference types="cypress" />

describe('Tela de Listagem de Motos', () => {
  beforeEach(() => {
    // Simula usuário autenticado
    window.localStorage.setItem('token', 'jwt-token-teste')
    // Mocka a resposta da listagem de motos
    cy.fixture('motos.json').then((motos) => {
      cy.intercept('GET', '**/motos', motos).as('getMotos')
    })
    cy.visit('/listagem-moto')
    cy.wait('@getMotos')
  })

  it('deve exibir a lista de motos', () => {
    cy.get('.el-table').should('exist')
    cy.get('.el-table__row').should('have.length', 2)
    cy.contains('MT-07')
    cy.contains('CB 500F')
  })

  it('deve abrir o modal de cadastro ao clicar em Cadastrar Moto', () => {
    cy.contains('Cadastrar Moto').click()
    cy.get('.el-dialog__title').should('contain', 'Cadastrar Nova Moto')
    cy.get('input[placeholder="Ex: ABC1D23"]').should('exist')
  })

  it('deve cadastrar uma nova moto', () => {
    cy.intercept('POST', '**/motos', {
      id: 3,
      placa: 'GHI3F56',
      modelo: 'XRE 300',
      marca: 'Honda',
      ano: 2023,
      cor: 'Azul',
      status: 'DISPONIVEL',
    }).as('postMoto')
    cy.contains('Cadastrar Moto').click()
    cy.get('input[placeholder="Ex: ABC1D23"]').type('GHI3F56')
    cy.get('input[placeholder="Ex: MT-07"]').type('XRE 300')
    cy.get('input[placeholder="Ex: Yamaha"]').type('Honda')
    cy.get('input[role="spinbutton"]').clear().type('2023')
    cy.get('input[placeholder="Ex: Preto"]').type('Azul')
    cy.contains('Salvar').click()
    cy.wait('@postMoto')
    cy.contains('Moto cadastrada com sucesso!')
  })

  it('deve abrir o modal de edição ao clicar em Editar', () => {
    cy.get('.el-table__row').first().contains('Editar').click()
    cy.get('.el-dialog__title').should('contain', 'Editar Moto')
    cy.get('input[placeholder="Ex: ABC1D23"]').should('exist')
  })

  it('deve editar uma moto', () => {
    cy.intercept('PUT', '**/motos/1', {
      id: 1,
      placa: 'ABC1D23',
      modelo: 'MT-09',
      marca: 'Yamaha',
      ano: 2022,
      cor: 'Preto',
      status: 'DISPONIVEL',
    }).as('putMoto')
    cy.get('.el-table__row').first().contains('Editar').click()
    cy.get('input[placeholder="Ex: MT-07"]').clear().type('MT-09')
    cy.contains('Atualizar').click()
    cy.wait('@putMoto')
    cy.contains('Moto atualizada com sucesso!')
  })

  it('deve excluir uma moto', () => {
    cy.intercept('DELETE', '**/motos/1', {}).as('deleteMoto')
    cy.get('.el-table__row').first().contains('Excluir').click()
    cy.contains('Sim').click()
    cy.wait('@deleteMoto')
    cy.contains('Moto "MT-07" excluída com sucesso!')
  })
}) 