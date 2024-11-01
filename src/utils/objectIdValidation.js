const { Types } = require('mongoose')
const { createBadRequestError } = require('~/utils/errorsHelper')

const isObjectIdValid = (id) => {
  if (!Types.ObjectId.isValid(id)) {
    throw createBadRequestError()
  }
}

module.exports = isObjectIdValid
