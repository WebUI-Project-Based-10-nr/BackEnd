const { serverInit, serverCleanup, stopServer } = require('~/test/setup');
const TokenService = require('~/services/token');
const endpointUrl = '/questions/';
const Question = require('~/models/question'); // Import the Mongoose model directly
const dbHandler = require('~/test/dbHandler'); // Import your in-memory database handler
const mongoose = require('mongoose');

describe('Question controller', () => {
  let app, accessToken, currentUser;
  jest.setTimeout(30000); // Set a higher timeout value, e.g., 30 seconds

  beforeAll(async () => {
    await dbHandler.connect(); // Connect to the in-memory database
    ({ app } = await serverInit()); // Do not include another mongoose.connect() here
  });

  afterAll(async () => {
    await dbHandler.closeDatabase(); // Close the connection properly
    await stopServer();
  });


  beforeEach(async () => {
    accessToken = 'mocked-token';
    currentUser = { id: new mongoose.Types.ObjectId(), role: 'TUTOR' }; // Use ObjectId for `id`

    // Mock token validation to return an ObjectId for `id`
    jest.spyOn(TokenService, 'validateAccessToken').mockImplementation(() => {
      return { id: currentUser.id, role: 'user' }; // Match the `id` format used in the `currentUser`
    });

    // Insert test data into the database with valid ObjectId fields
    await Question.create([
      {
        _id: new mongoose.Types.ObjectId(), // Generate new ObjectId for `_id`
        title: 'Sample Question 1',
        author: currentUser.id, // Use the ObjectId from `currentUser` for `author`
        type: 'multipleChoice', // Add the required `type` field
        text: 'This is a sample question text.', // Ensure the `text` field is included
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: new mongoose.Types.ObjectId(), // Generate new ObjectId for `_id`
        title: 'Sample Question 2',
        author: currentUser.id, // Use the ObjectId from `currentUser` for `author`
        type: 'multipleChoice',
        text: 'This is another sample question text.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  });

  afterEach(async () => {
    await dbHandler.clearDatabase(); // Clear data between tests
    jest.clearAllMocks();
  });

  describe(`GET ${endpointUrl}`, () => {
    it('should get a 200 response and return questions in ascending order', async () => {
      const response = await app
        .get(`${endpointUrl}?limit=10&skip=0&sort%5Border%5D=asc&sort%5BorderBy%5D=title&title=`)
        .set('Cookie', [`accessToken=${accessToken}`]);

      expect(response.statusCode).toBe(200);
      expect(response.body.items).toHaveLength(2);
      expect(response.body.items[0].title).toBe('Sample Question 1');
      expect(response.body.items[1].title).toBe('Sample Question 2');
    });

    it('should get a 200 response and return questions in descending order', async () => {
      const response = await app
        .get(`${endpointUrl}?limit=10&skip=0&sort%5Border%5D=desc&sort%5BorderBy%5D=title&title=`)
        .set('Cookie', [`accessToken=${accessToken}`]);

      expect(response.statusCode).toBe(200);
      expect(response.body.items).toHaveLength(2);
      expect(response.body.items[0].title).toBe('Sample Question 2');
      expect(response.body.items[1].title).toBe('Sample Question 1');
    });
  });
});
