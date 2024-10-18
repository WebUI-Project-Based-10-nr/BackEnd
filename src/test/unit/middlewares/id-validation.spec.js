const mongoose = require('mongoose')
const { INVALID_ID } = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper')
const idValidation = require('~/middlewares/idValidation')

jest.mock('~/utils/errorsHelper', () => ({
  createError: jest.fn()
}))

describe('idValidation middleware', () => {
  let req, res, next

  beforeEach(() => {
    req = {}
    res = {}
    next = jest.fn()
  })

  it('should call next if id is valid', () => {
    mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true)

    idValidation(req, res, next, 'validId')

    expect(next).toHaveBeenCalled()
  })

  it('should throw an error if id is invalid', () => {
    mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(false)

    const error = new Error(INVALID_ID)
    createError.mockReturnValue(error)

    expect(() => idValidation(req, res, next, 'invalidId')).toThrow(error)
  })
})
