const { serverInit, serverCleanup, stopServer } = require('~/test/setup')
const TokenService = require('~/services/token')
const endpointUrl = '/questions/'
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
    const mockQuestions = [
      {
        _id: 'questionId1',
        title: 'Sample Question 1',
        author: 'AtestId',
        category: 'Category 1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'questionId2',
        title: 'Sample Question 2',
        author: 'BtestId',
        category: 'Category 2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    beforeEach(() => {
      jest.clearAllMocks();
      // jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'testId', role: 'USER' });
      jest.spyOn(TokenService, 'validateAccessToken').mockImplementation((token) => {
        return { id: 'testId', role: 'user' };
      });
    });

    it('should get a 200 response and return questions in ascending order', async () => {
      jest.spyOn(questionService, 'getQuestions').mockResolvedValue(mockQuestions);
      const response = await app
        .get(`${endpointUrl}?limit=10&skip=0&sort%5Border%5D=asc&sort%5BorderBy%5D=category&title=`)
        .set('Cookie', [`accessToken=${accessToken}`]);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(mockQuestions.length);
      expect(response.body).toEqual([...mockQuestions]);

    });

    it('should get a 200 response and return questions in descending order', async () => {
      jest.spyOn(questionService, 'getQuestions').mockResolvedValue([...mockQuestions].reverse());
      const response = await app
        .get(`${endpointUrl}?limit=10&skip=0&sort%5Border%5D=desc&sort%5BorderBy%5D=category&title=`)
        .set('Cookie', [`accessToken=${accessToken}`]);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(mockQuestions.length);

      // Verify descending order by reversing mockQuestions
      expect(response.body).toEqual([...mockQuestions].reverse());

    });
  });
})
