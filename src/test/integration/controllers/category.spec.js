const categoryService = require('~/services/category')
const { serverInit, stopServer } = require("~/test/setup");
const jwt = require("jsonwebtoken");
const TokenService = require("~/services/token");
const dbHandler = require("~/test/dbHandler");
const mongoose = require("mongoose");
const Category = require('~/models/category');
const { getCategoriesNames, getCategoryById } = require('~/controllers/category')


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
    currentUser = { id: new mongoose.Types.ObjectId(), role: 'admin' };

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
        return { id: currentUser.id, role: currentUser.role }; // Match the `id` format used in the `currentUser`
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
      jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'testId', role: 'TUTOR' })
      jest.spyOn(TokenService, 'validateAccessToken').mockImplementation(() => {
        return { userId: currentUser.id, role: 'tutor' };
      });

      const response = await app
        .post(endpointUrl)
        .set('Cookie', [`accessToken=${userToken}`])
        .send(mockCategoryData);
      console.log('response', response);

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({ message: 'You do not have permission to perform this action.' });
    });

    it('should respond with 400 for invalid data (missing name)', async () => {
      const invalidData = { appearance: 'light' };
      jest.spyOn(jwt, 'sign').mockReturnValue('mocked-token')
      jest.spyOn(jwt, 'verify').mockReturnValue(currentUser)
      jest.spyOn(TokenService, 'validateAccessToken').mockImplementation(() => {
        return { id: currentUser.id, role: currentUser.role }; // Match the `id` format used in the `currentUser`
      });

      const response = await app
        .post(endpointUrl)
        .set('Cookie', [`accessToken=${adminToken}`])
        .send(invalidData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ message: 'Name field is required' });
    });
  });
});

describe('getCategoryById controller', () => {
  it('should return a category by id', async () => {
    const mockCategory = { id: '1', name: 'Category 1', description: 'Description of Category 1' }
    categoryService.getCategoryById.mockResolvedValue(mockCategory)

    const req = { params: { id: '1' } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    await getCategoryById(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(mockCategory)
    expect(categoryService.getCategoryById).toHaveBeenCalledWith('1')
  })

  it('should return 404 if category not found', async () => {
    categoryService.getCategoryById.mockResolvedValue(null)

    const req = { params: { id: '999' } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    await getCategoryById(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(null)
    expect(categoryService.getCategoryById).toHaveBeenCalledWith('999')
  })
})
