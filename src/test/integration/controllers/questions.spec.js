const { serverInit, serverCleanup, stopServer } = require('~/test/setup')
const TokenService = require('~/services/token')
const endpointUrl = '/questions/'
const jwt = require('jsonwebtoken')
const questionService = require('~/services/question')

describe('Question controller', () => {
  let app, accessToken, currentUser

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

  afterAll(async () => {
    await stopServer();
  });

  describe(`GET ${endpointUrl}`, () => {
    it('should get 200 response', async () => {
      jest.spyOn(questionService, 'getQuestions').mockResolvedValueOnce([
        {
          _id: 'questionId1',
          title: 'Sample Question 1',
          author: 'testId',
          category: 'Category 1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: 'questionId2',
          title: 'Sample Question 2',
          author: 'testId',
          category: 'Category 2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);

      jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'testId', role: 'USER' });
      jest.spyOn(TokenService, 'validateAccessToken').mockImplementationOnce((token) => {
        return { id: 'testId', role: 'user' };
      });

      // Perform the GET request
      const response = await app
        .get(`${endpointUrl}?limit=10&skip=0&sort[order]=asc&title=Sample`)
        .set('Cookie', [`accessToken=${accessToken}`]);

      // Assertions
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expect.any(Array));
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject({
        _id: expect.any(String),
        title: expect.any(String),
        author: 'testId',
        category: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  })
})
