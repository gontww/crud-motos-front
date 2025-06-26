/// <reference types="cypress" />

describe('Tela de Listagem de Aluguéis', () => {
  beforeEach(() => {
    window.localStorage.setItem('token', 'fake-jwt-token')
    cy.fixture('alugueis.json').then((alugueis) => {
      cy.intercept('GET', '**/alugueis', alugueis).as('getAlugueis')
    })
    cy.fixture('locatarios.json').then((locatarios) => {
      cy.intercept('GET', '**/locatarios', locatarios).as('getLocatarios')
    })
    cy.fixture('motos.json').then((motos) => {
      cy.intercept('GET', '**/motos', motos).as('getMotos')
    })
    cy.visit('/listagem-aluguel')
    cy.wait(['@getAlugueis', '@getLocatarios', '@getMotos'])
  })

  it('deve exibir a lista de aluguéis', () => {
    cy.get('.el-table').should('exist')
    cy.get('.el-table__row').should('have.length', 2)
    cy.contains('MT-07')
    cy.contains('CB 500F')
    cy.contains('João da Silva')
    cy.contains('Maria Oliveira')
  })

  it('deve abrir o modal de cadastro ao clicar em Novo Aluguel', () => {
    cy.contains('Novo Aluguel').click()
    cy.get('.el-dialog__title').should('contain', 'Novo Aluguel')
    cy.get('input[placeholder="Escolha uma data"]').should('exist')
  })


  it('deve abrir o modal de edição ao clicar em Editar', () => {
    cy.get('.el-table__row').first().contains('Ações').click()
    cy.contains('Editar').click()
    cy.get('.el-dialog__title').should('contain', 'Editar Aluguel')
    cy.get('input[placeholder="Escolha uma data"]').should('exist')
  })

  it('deve editar um aluguel', () => {
    cy.intercept('PUT', '**/alugueis/1', {
      id: 1,
      moto: {
        id: 1,
        modelo: 'MT-07',
        marca: 'Yamaha',
        placa: 'ABC1D23',
        ano: 2022,
        status: 'DISPONIVEL',
      },
      locatario: {
        id: 1,
        nome: 'João da Silva',
      },
      dataInicio: '2030-07-05',
      dataFim: '2030-07-15',
      status: 'ATIVO',
    }).as('putAluguel')
    cy.get('.el-table__row').first().contains('Ações').click()
    cy.contains('Editar').click()
    cy.get('input[placeholder="Escolha uma data"]').first()
      .invoke('removeAttr', 'readonly')
      .clear()
      .type('2030-07-05')
    cy.get('body').type('{esc}')
    cy.get('input[placeholder="Escolha uma data"]').eq(1)
      .invoke('removeAttr', 'readonly')
      .clear()
      .type('2030-07-15')
    cy.contains('Atualizar').click()
    cy.wait('@putAluguel')
    cy.contains('Aluguel atualizado com sucesso!')
  })

  it('deve finalizar um aluguel', () => {
    cy.intercept('GET', '**/alugueis/1/finalizar', {}).as('finalizarAluguel')
    cy.get('.el-table__row').first().contains('Ações').click()
    cy.contains('Finalizar').click()
    cy.contains('Sim').click()
    cy.wait('@finalizarAluguel')
    cy.contains('Aluguel finalizado com sucesso!')
  })

  it('deve excluir um aluguel', () => {
    cy.intercept('DELETE', '**/alugueis/1', {}).as('deleteAluguel')
    cy.get('.el-table__row').first().contains('Ações').click()
    cy.contains('Excluir').click()
    cy.contains('Sim').click()
    cy.wait('@deleteAluguel')
    cy.contains('Aluguel da moto "MT-07" excluído com sucesso!')
  })
}) 