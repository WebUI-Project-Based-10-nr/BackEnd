const Quiz = require('~/models/quiz')
const { quizService } = require('~/services/quiz')

jest.mock('~/models/quiz', () => ({
  find: jest.fn().mockReturnThis(),
  collation: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  lean: jest.fn().mockReturnThis(),
  populate: jest.fn().mockReturnThis(),
  exec: jest.fn(),
  countDocuments: jest.fn()
}))

const mockItems = [{ title: 'Quiz 1' }, { title: 'Quiz 2' }]

describe('getQuizzes Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call getQuizzes with correct match parameters', async () => {
    const matchedItem = mockItems.filter((quiz) => quiz.title === 'Quiz 1')
    Quiz.exec.mockResolvedValueOnce(matchedItem)
    Quiz.countDocuments.mockResolvedValueOnce(1)

    const match = { title: 'Quiz 1' }
    const sort = {}
    const skip = 0
    const limit = 10

    const result = await quizService.getQuizzes(match, sort, skip, limit)

    expect(Quiz.find).toHaveBeenCalled()
    expect(Quiz.countDocuments).toHaveBeenCalled()
    expect(result).toEqual({
      items: [{ title: 'Quiz 1' }],
      count: 1
    })
  })

  it('should use default values for skip and limit', async () => {
    const match = {}
    const sort = {}

    Quiz.exec.mockResolvedValueOnce(mockItems)
    Quiz.countDocuments.mockResolvedValueOnce(mockItems.length)

    await quizService.getQuizzes(match, sort)

    expect(Quiz.skip).toHaveBeenCalledWith(0)
    expect(Quiz.limit).toHaveBeenCalledWith(10)
  })

  it('should return an empty array and zero count when no quizzes exist', async () => {
    Quiz.exec.mockResolvedValueOnce([])
    Quiz.countDocuments.mockResolvedValueOnce(0)

    const result = await quizService.getQuizzes({}, {})

    expect(result).toEqual({ items: [], count: 0 })
  })

  it('should handle errors thrown by the database', async () => {
    const errorMessage = 'Database error'

    Quiz.find.mockReturnValue({
      collation: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockRejectedValue(new Error(errorMessage))
    })

    await expect(quizService.getQuizzes({}, {})).rejects.toThrow(errorMessage)
    expect(Quiz.find).toHaveBeenCalled()
  })
})
