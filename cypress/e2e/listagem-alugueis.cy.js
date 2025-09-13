/// <reference types="cypress" />

describe('Tela de Listagem de Aluguéis', () => {
  beforeEach(() => {
    // Simula usuário autenticado
    window.localStorage.setItem('token', 'jwt-token-teste')
    // Mocka a resposta da listagem de aluguéis
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

  it('deve criar um novo aluguel', () => {
    cy.intercept('POST', '**/alugueis', {
      id: 3,
      moto: {
        id: 2,
        modelo: 'CB 500F',
        marca: 'Honda',
        placa: 'XYZ9Z99',
        ano: 2021,
        status: 'ALUGADA',
      },
      locatario: {
        id: 2,
        nome: 'Maria Oliveira',
      },
      dataInicio: '29/06/2030',
      dataFim: '05/07/2030',
      status: 'ATIVO',
    }).as('postAluguel')

    cy.contains('Novo Aluguel').click()
    cy.get('.el-dialog__title').should('contain', 'Novo Aluguel')

    cy.contains('span', 'Selecione um locatário').click()
    cy.get('.el-select-dropdown .el-select-dropdown__item').contains('Maria Oliveira').click()

    cy.contains('span', 'Selecione uma moto').click({ force: true })
    cy.get('.el-select-dropdown .el-select-dropdown__item').contains('Yamaha MT-07 (2022)').click()

    cy.get('input[placeholder="Escolha uma data"]')
      .first()
      .invoke('removeAttr', 'readonly')
      .clear()
      .type('05/07/2030')
    cy.get('body').type('{enter}')
    cy.get('input[placeholder="Escolha uma data"]')
      .eq(1)
      .invoke('removeAttr', 'readonly')
      .clear()
      .type('15/07/2030')

    cy.contains('Salvar').click()

    cy.wait('@postAluguel')
    cy.contains('Aluguel cadastrado com sucesso!')
  })

  it.only('deve editar um aluguel', () => {
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
      dataInicio: '05/07/2030',
      dataFim: '15/07/2030',
      status: 'ATIVO',
    }).as('putAluguel')
    cy.get('.el-table__row').first().contains('Ações').click()
    cy.contains('Editar').click()
    cy.get('input[placeholder="Escolha uma data"]')
      .first()
      .invoke('removeAttr', 'readonly')
      .clear()
      .type('05/07/2030')
    cy.get('body').type('{enter}')
    cy.get('input[placeholder="Escolha uma data"]')
      .eq(1)
      .invoke('removeAttr', 'readonly')
      .clear()
      .type('15/07/2030')
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

  it('deve validar todos os campos obrigatórios quando estão vazios', () => {
    cy.contains('Novo Aluguel').click()
    cy.get('.el-dialog__title').should('contain', 'Novo Aluguel')

    // Tenta salvar sem preenher nenhum campo
    cy.contains('Salvar').click()

    // Verifica se as mensagens de erro aparecem para todos os campos obrigatórios
    cy.contains('O locatário é obrigatório').should('be.visible')
    cy.contains('A moto é obrigatória').should('be.visible')
    cy.contains('A data de início é obrigatória').should('be.visible')
    cy.contains('A data de fim é obrigatória').should('be.visible')

    // Verifica se o modal permanece aberto (não foi fechado)
    cy.get('.el-dialog__title').should('contain', 'Novo Aluguel')
  })
})
