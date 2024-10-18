require('~/initialization/envSetup')
const { authMiddleware } = require('~/middlewares/auth')
const { createUnauthorizedError } = require('~/utils/errorsHelper')
const tokenService = require('~/services/token')
const authService = require('~/services/auth')

jest.mock('~/services/token')
jest.mock('google-auth-library')
jest.mock('~/services/user')
jest.mock('~/services/auth')

describe('Auth middleware', () => {
  const error = createUnauthorizedError()
  const mockResponse = {}
  const mockNextFunc = jest.fn()

  it('Should throw UNAUTHORIZED error when access token is not given', () => {
    const mockRequest = { cookies: { accessToken: 'invalid_token' } }

    const middlewareFunc = () => authMiddleware(mockRequest, mockResponse, mockNextFunc)

    expect(middlewareFunc).toThrow(error)
  })

  it('Should throw UNAUTHORIZED error when access token is invalid', () => {
    const mockRequest = { cookies: { accessToken: 'token' } }

    const middlewareFunc = () => authMiddleware(mockRequest, mockResponse, mockNextFunc)

    expect(middlewareFunc).toThrow(error)
  })

  it('Should save userData from accessToken to a request object', () => {
    const payload = { userId: 'testId' }
    const { accessToken } = tokenService.generateTokens(payload)
    const mockRequest = { cookies: { accessToken } }

    authMiddleware(mockRequest, mockResponse, mockNextFunc)

    expect(mockRequest.user).toEqual(expect.objectContaining(payload))
  })
})

describe('authService.googleAuth', () => {
  const mockGoogleUser = {
    email: 'test@example.com',
    given_name: 'Test',
    family_name: 'User',
    sub: 'googleSubId'
  }
  const mockToken = 'mockIdToken'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return a token for a valid Google user', async () => {
    jest.spyOn(authService, 'googleAuth').mockResolvedValue(mockToken)

    const token = await authService.googleAuth(mockGoogleUser)

    expect(token).toBe(mockToken)
  })

  it('should throw an error for an invalid Google user', async () => {
    jest.spyOn(authService, 'googleAuth').mockRejectedValue(new Error('Invalid Google user'))

    await expect(authService.googleAuth(null)).rejects.toThrow('Invalid Google user')
  })
})
