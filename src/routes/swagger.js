const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')

const swaggerSetup = (app) => {
  const swaggerOptions = app.get('swaggerOptions')
  console.log(swaggerOptions)

  if (!swaggerOptions) {
    throw new Error('Swagger options not found in app settings.')
  }

  const swaggerSpec = swaggerJSDoc(swaggerOptions)

  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))
}

module.exports = swaggerSetup
