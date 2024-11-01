const categoryService = require('~/services/category')
const { getCategoriesNames } = require('~/controllers/category')
const { serverInit } = require("~/test/setup");
const jwt = require("jsonwebtoken");
const TokenService = require("~/services/token");
const endpointUrl = '/categories/'

jest.mock('~/services/category')

describe('Category controller', () => {
  let app, signupResponse

  beforeAll(async () => {
    ({ app } = await serverInit())
  })

  describe('POST /categories - Add Category', () => {
    const endpointUrl = '/categories';
    const mockCategoryData = { name: 'sample', appearance: 'light' };
    const adminToken = 'admin_access_token'; // You may mock or generate this token in the setup.

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create a category and respond with 201 for ADMIN role', async () => {
      jest.spyOn(categoryService, 'addCategory').mockResolvedValue({
        name: 'Sample', appearance: 'light', _id: 'newCategoryId'
      });

      const response = await app
        .post(endpointUrl)
        .set('Cookie', [`accessToken=${adminToken}`])
        .send(mockCategoryData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        name: 'Sample',
        appearance: 'light',
        _id: expect.any(String)
      });
    });

    it('should respond with 403 if user does not have ADMIN role', async () => {
      const userToken = 'user_access_token'; // Non-admin token for testing

      const response = await app
        .post(endpointUrl)
        .set('Cookie', [`accessToken=${userToken}`])
        .send(mockCategoryData);

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({ error: 'Access forbidden: Admins only' });
    });

    it('should respond with 400 for invalid data (missing name)', async () => {
      const invalidData = { appearance: 'light' };
      jest.spyOn(jwt, 'sign').mockReturnValue('mocked-token')
      jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'testId', role: 'admin' })
      jest.spyOn(TokenService, 'validateAccessToken').mockImplementationOnce((token) => {
        return { id: 'testId', role: 'admin' }
      })
      const response = await app
        .post(endpointUrl)
        .set('Cookie', [`accessToken=${adminToken}`])
        .send(invalidData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ message: 'Name field is required' });
    });
  });

  describe('GET /categories/names', () => {
    let res

    beforeEach(() => {
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
    })

    it('should return 200 and a list of category names', async () => {
      const mockCategoryNames = ['Category 1', 'Category 2', 'Category 3']

      categoryService.getCategoriesNames.mockResolvedValue(mockCategoryNames)

      await getCategoriesNames({}, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockCategoryNames)
    })
  })
})
