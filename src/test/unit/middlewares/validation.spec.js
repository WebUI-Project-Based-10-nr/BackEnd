const { createError } = require('~/utils/errorsHelper')
const { BODY_IS_NOT_DEFINED } = require('~/consts/errors')
const { validateRequired, validateFunc } = require('~/utils/validationHelper')
const validationMiddleware = require('~/middlewares/validation')

jest.mock('~/utils/errorsHelper', () => ({
  createError: jest.fn()
}))

jest.mock('~/utils/validationHelper', () => ({
  validateRequired: jest.fn(),
  validateFunc: {
    required: jest.fn(),
    type: jest.fn(),
    length: jest.fn(),
    regex: jest.fn(),
    enum: jest.fn()
  }
}))

describe('validationMiddleware', () => {
  const next = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should throw error if body is not defined', () => {
    const req = { body: undefined }
    const schema = {}

    const error = new Error(BODY_IS_NOT_DEFINED)
    createError.mockReturnValue(error)

    expect(() => validationMiddleware(schema)(req, {}, next)).toThrow(error)
    expect(createError).toHaveBeenCalledWith(422, BODY_IS_NOT_DEFINED)
    expect(next).not.toHaveBeenCalled()
  })

  it('should validate required fields and call validation functions if field is present', () => {
    const req = {
      body: {
        name: 'John Doe',
        age: 25
      }
    }
    const schema = {
      name: { required: true, type: 'string' },
      age: { required: true, type: 'number' }
    }

    validationMiddleware(schema)(req, {}, next)

    expect(validateRequired).toHaveBeenCalledWith('name', true, 'John Doe')
    expect(validateRequired).toHaveBeenCalledWith('age', true, 25)

    expect(validateFunc.type).toHaveBeenCalledWith('name', 'string', 'John Doe')
    expect(validateFunc.type).toHaveBeenCalledWith('age', 'number', 25)

    expect(next).toHaveBeenCalled()
  })

  it('should call validation functions for required field and handle optional field correctly', () => {
    const req = {
      body: {
        name: 'John Doe'
      }
    }
    const schema = {
      name: { required: true, type: 'string' },
      age: { required: false, type: 'number' }
    }

    validationMiddleware(schema)(req, {}, next)

    expect(validateRequired).toHaveBeenCalledWith('name', true, 'John Doe')
    expect(validateRequired).toHaveBeenCalledWith('age', false, undefined)
    expect(validateFunc.type).not.toHaveBeenCalledWith('age', 'number', undefined)

    expect(next).toHaveBeenCalled()
  })

  it('should call next if validation passes successfully', () => {
    const req = {
      body: {
        email: 'example@test.com',
        password: '123456'
      }
    }
    const schema = {
      email: { required: true, type: 'string' },
      password: { required: true, type: 'string' }
    }

    validationMiddleware(schema)(req, {}, next)

    expect(validateRequired).toHaveBeenCalledWith('email', true, 'example@test.com')
    expect(validateRequired).toHaveBeenCalledWith('password', true, '123456')

    expect(validateFunc.type).toHaveBeenCalledWith('email', 'string', 'example@test.com')
    expect(validateFunc.type).toHaveBeenCalledWith('password', 'string', '123456')

    expect(next).toHaveBeenCalled()
  })
})
