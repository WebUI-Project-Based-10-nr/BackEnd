const { INVALID_LANGUAGE } = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper')
const {
  enums: { APP_LANG_ENUM }
} = require('~/consts/validation')
const langMiddleware = require('~/middlewares/appLanguage')

jest.mock('~/utils/errorsHelper', () => ({
  createError: jest.fn()
}))

describe('langMiddleware', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      acceptsLanguages: jest.fn()
    }
    res = {}
    next = jest.fn()
  })

  test('should set req.lang if a valid language is accepted', () => {
    const validLang = 'en'
    req.acceptsLanguages.mockReturnValue(validLang)

    langMiddleware(req, res, next)

    expect(req.lang).toBe(validLang)
    expect(next).toHaveBeenCalled()
  })

  test('should throw an error if no valid language is accepted', () => {
    req.acceptsLanguages.mockReturnValue(false)

    createError.mockReturnValue(new Error(INVALID_LANGUAGE))

    expect(() => langMiddleware(req, res, next)).toThrowError(new Error(INVALID_LANGUAGE))
    expect(createError).toHaveBeenCalledWith(400, INVALID_LANGUAGE)
    expect(next).not.toHaveBeenCalled()
  })

  test('should call next without error if language is valid', () => {
    req.acceptsLanguages.mockReturnValue(APP_LANG_ENUM[0])

    langMiddleware(req, res, next)

    expect(req.lang).toBe(APP_LANG_ENUM[0])
    expect(next).toHaveBeenCalled()
  })
})
