const { serverInit, serverCleanup } = require('~/test/setup')
const { expectError } = require('~/test/helpers')
const { UNAUTHORIZED, FORBIDDEN } = require('~/consts/errors')
const testUserAuthentication = require('~/utils/testUserAuth')
const TokenService = require('~/services/token')
const endpointUrl = '/resources-categories/'
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const resourcesCategoryService = require('~/services/resourcesCategory')
const testResourceCategoryData = {
  name: 'Chemical Category'
}

const updateResourceCategoryData = {
  name: 'Computer Science'
}

describe('ResourceCategory controller', () => {
  let app, accessToken, currentUser, studentAccessToken, testResourceCategory

  beforeAll(async () => {
    ({ app } = await serverInit())
  })

  beforeEach(async () => {
    accessToken = 'mocked-token'
    currentUser = { id: 'testId', role: 'TUTOR' }
  })

  afterEach(async () => {
    await serverCleanup()
  })

  describe(`POST ${endpointUrl}`, () => {
    it('should create a new resource category', async () => {
      jest.spyOn(jwt, 'sign').mockReturnValue('mocked-token')
      jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'testId', role: 'TUTOR' })
      jest.spyOn(resourcesCategoryService, 'createResourcesCategory').mockImplementationOnce( () => {
        return {
          _id: 'newCategoryId',
          name: testResourceCategoryData.name,
          author: 'testId',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      })

      jest.spyOn(TokenService, 'validateAccessToken').mockImplementationOnce((token) => {
        return { id: 'testId', role: 'tutor' }
      })

      testResourceCategory = await app
        .post(endpointUrl)
        .send(testResourceCategoryData)
        .set('Cookie', [`accessToken=${accessToken}`])

      expect(testResourceCategory.statusCode).toBe(201)
      expect(testResourceCategory._body).toMatchObject({
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        author: currentUser.id,
        ...testResourceCategoryData
      })
    })

    it('should throw UNAUTHORIZED', async () => {
      const response = await app.post(endpointUrl)

      expectError(401, UNAUTHORIZED, response)
    })

    it('should throw FORBIDDEN', async () => {
      const response = await app
        .post(endpointUrl)
        .send(testResourceCategoryData)
        .set('Cookie', [`accessToken=${studentAccessToken}`])

      expectError(403, FORBIDDEN, response)
    })
  })

  describe(`PATCH ${endpointUrl}:id`, () => {
    //TODO - Fix this test
    it.skip('should update resource category', async () => {
      jest.spyOn(jwt, 'sign').mockReturnValue('mocked-token')
      jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'testId', role: 'TUTOR' })
      jest.spyOn(resourcesCategoryService, 'createResourcesCategory').mockImplementationOnce( () => {
        return {
          _id: 'testId',
          name: testResourceCategoryData.name,
          author: 'testId',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      })

      jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockImplementation((id) => {
        return id === 'testId'
      })

      jest.spyOn(TokenService, 'validateAccessToken').mockImplementationOnce((token) => {
        return { id: 'testId', role: 'tutor' }
      })
      testResourceCategory = await app
        .post(endpointUrl)
        .send(testResourceCategoryData)
        .set('Cookie', [`accessToken=${accessToken}`])

      jest.spyOn(TokenService, 'validateAccessToken').mockImplementationOnce((token) => {
        return { id: 'testId', role: 'tutor' }
      })

      jest.mock('~/middlewares/entityValidation')

      const foo = require('~/middlewares/entityValidation')
      foo.mockImplementation((entities) => {
        return async (req, _res, next) => {
          console.log('Custom mock for isEntityValid')
          next()
        }
      })

      const response = await app
        .patch(endpointUrl + testResourceCategory.body._id)
        .send(updateResourceCategoryData)
        .set('Cookie', [`accessToken=${accessToken}`])
      expect(response.statusCode).toBe(204)
    })

    it('should throw UNAUTHORIZED', async () => {
      const response = await app.patch(endpointUrl)

      expectError(401, UNAUTHORIZED, response)
    })

    it('should throw FORBIDDEN', async () => {
      const response = await app
        .patch(endpointUrl)
        .send(updateResourceCategoryData)
        .set('Cookie', [`accessToken=${studentAccessToken}`])

      expectError(403, FORBIDDEN, response)
    })
  })
})
