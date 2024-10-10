const googleAuthValidationSchema = {
  token: {
    type: 'object',
    required: true
  },
  role: {
    type: 'string'
  }
}

module.exports = googleAuthValidationSchema
