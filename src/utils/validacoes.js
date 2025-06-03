function validateCPF(rule, value, callback) {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) {
    return callback(new Error('CPF inválido'))
  }

  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(cleaned.charAt(i)) * (10 - i)
  let firstDigit = (sum * 10) % 11
  if (firstDigit === 10) firstDigit = 0
  if (firstDigit !== parseInt(cleaned.charAt(9))) return callback(new Error('CPF inválido'))

  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(cleaned.charAt(i)) * (11 - i)
  let secondDigit = (sum * 10) % 11
  if (secondDigit === 10) secondDigit = 0
  if (secondDigit !== parseInt(cleaned.charAt(10))) return callback(new Error('CPF inválido'))

  callback()
}

export { validateCPF }
