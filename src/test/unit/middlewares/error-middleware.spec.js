jest.mock('~/logger/logger', () => ({
  error: jest.fn()
}))

jest.mock('~/utils/getUniqueFields', () => jest.fn())

const {
  INTERNAL_SERVER_ERROR,
  DOCUMENT_ALREADY_EXISTS,
  MONGO_SERVER_ERROR,
  VALIDATION_ERROR
} = require('~/consts/errors')
const getUniqueFields = require('~/utils/getUniqueFields')
const errorMiddleware = require('~/middlewares/error')

describe('errorMiddleware', () => {
  let res

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should handle MongoServerError with 11000 code (duplicate key)', () => {
    const err = {
      name: 'MongoServerError',
      code: 11000,
      message: 'duplicate key error'
    }

    getUniqueFields.mockReturnValue(['field1'])

    errorMiddleware(err, null, res, null)

    expect(getUniqueFields).toHaveBeenCalledWith(err.message)
    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({
      status: 409,
      ...DOCUMENT_ALREADY_EXISTS(['field1'])
    })
  })

  it('should handle MongoServerError with other codes', () => {
    const err = {
      name: 'MongoServerError',
      code: 99999,
      message: 'some other mongo error'
    }

    errorMiddleware(err, null, res, null)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      ...MONGO_SERVER_ERROR(err.message)
    })
  })

  it('should handle ValidationError', () => {
    const err = {
      name: 'ValidationError',
      message: 'validation failed'
    }

    errorMiddleware(err, null, res, null)

    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({
      status: 409,
      ...VALIDATION_ERROR(err.message)
    })
  })

  it('should handle errors without status and code', () => {
    const err = {
      message: 'something went wrong'
    }

    errorMiddleware(err, null, res, null)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      code: INTERNAL_SERVER_ERROR.code,
      message: err.message
    })
  })

  it('should handle errors with status and code', () => {
    const err = {
      status: 400,
      code: 'BAD_REQUEST',
      message: 'bad request error'
    }

    errorMiddleware(err, null, res, null)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      status: 400,
      code: err.code,
      message: err.message
    })
  })
})
