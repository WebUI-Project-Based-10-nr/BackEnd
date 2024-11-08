const categoryService = require('~/services/category')
const { getCategoriesNames } = require('~/controllers/category')
const { serverInit, stopServer } = require("~/test/setup");
const jwt = require("jsonwebtoken");
const TokenService = require("~/services/token");
const dbHandler = require("~/test/dbHandler");
const mongoose = require("mongoose");
const Category = require('~/models/category');


describe('Category controller', () => {
  let app, currentUser

  beforeAll(async () => {
    await dbHandler.connect(); // Connect to the in-memory database
    ({ app } = await serverInit())
  })


  afterAll(async () => {
    await dbHandler.closeDatabase(); // Close the connection properly
    await stopServer();
  });

  describe('POST /categories - Add Category', () => {
    const endpointUrl = '/categories';
    const mockCategoryData = { name: 'Sample', appearance: 'light' };
    const adminToken = 'admin_access_token';
    const userToken = 'user_access_token';
    currentUser = { id: new mongoose.Types.ObjectId(), role: 'ADMIN' };

    beforeEach(async () => {
      await Category.create(
        {
          _id: new mongoose.Types.ObjectId(), // Generate new ObjectId for `_id`
          ...mockCategoryData
        });
    });

    afterEach(async () => {
      await dbHandler.clearDatabase(); // Clear data between tests
      jest.clearAllMocks();
    });

    it('should create a category and respond with 200 for ADMIN role', async () => {

      jest.spyOn(jwt, 'sign').mockReturnValue('mocked-token')
      jest.spyOn(jwt, 'verify').mockReturnValue(currentUser)
      jest.spyOn(TokenService, 'validateAccessToken').mockImplementation(() => {
        return { id: currentUser.id, role: 'admin' }; // Match the `id` format used in the `currentUser`
      });

      const response = await app
        .post(endpointUrl)
        .set('Cookie', [`accessToken=${adminToken}`])
        .send(mockCategoryData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({name: mockCategoryData.name});
    });

    it('should respond with 403 if user does not have ADMIN role', async () => {
      jest.spyOn(jwt, 'sign').mockReturnValue('mocked-token')
      jest.spyOn(jwt, 'verify').mockReturnValue(currentUser)
      jest.spyOn(TokenService, 'validateAccessToken').mockImplementation(() => {
        return { currentUser }; // Match the `id` format used in the `currentUser`
      });

      const response = await app
        .post(endpointUrl)
        .set('Cookie', [`accessToken=${userToken}`])
        .send(mockCategoryData);

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({ message: 'You do not have permission to perform this action.' });
    });

    it('should respond with 400 for invalid data (missing name)', async () => {
      const invalidData = { appearance: 'light' };
      jest.spyOn(jwt, 'sign').mockReturnValue('mocked-token')
      jest.spyOn(jwt, 'verify').mockReturnValue(currentUser)
      jest.spyOn(TokenService, 'validateAccessToken').mockImplementation(() => {
        return { id: currentUser.id, role: 'admin' }; // Match the `id` format used in the `currentUser`
      });

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

      jest.spyOn(categoryService, 'getCategoriesNames').mockImplementation(() => {
        return mockCategoryNames; // Match the `id` format used in the `currentUser`
      });
      await getCategoriesNames({}, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockCategoryNames)
    })
  })
})
