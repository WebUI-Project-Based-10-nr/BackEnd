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
  countDocuments: jest.fn(),
  findById: jest.fn(),
  save: jest.fn()
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

describe('updateQuiz service', () => {
  const mockAuthorId = '12345'
  const mockQuizId = '6789'
  const mockData = { title: 'Updated Title', description: 'Updated Description' }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should update the quiz if it exists and belongs to the indicated author', async () => {
    const mockQuiz = {
      _id: mockQuizId,
      author: mockAuthorId,
      title: 'Initial title',
      description: 'Initial description',
      save: jest.fn().mockResolvedValue(true)
    }

    Quiz.findById.mockResolvedValue(mockQuiz)

    await quizService.updateQuiz(mockAuthorId, mockQuizId, mockData)

    expect(Quiz.findById).toHaveBeenCalledWith(mockQuizId)
    expect(mockQuiz.title).toBe('Updated Title')
    expect(mockQuiz.description).toBe('Updated Description')
    expect(mockQuiz.save).toHaveBeenCalled()
  })

  it('should throw a not found error if the quiz does not exist', async () => {
    const errorMessage = 'The requested URL was not found'

    Quiz.findById.mockResolvedValue(null)

    await expect(quizService.updateQuiz(mockAuthorId, mockQuizId, mockData)).rejects.toThrow(errorMessage)
    expect(Quiz.findById).toHaveBeenCalledWith(mockQuizId)
  })

  it('should throw a not authorized error if the quiz has a different author', async () => {
    const errorMessage = 'You do not have permission to perform this action.'
    const mockQuiz = {
      _id: mockQuizId,
      author: 'Different author ID',
      title: 'Initial title',
      description: 'Initial description',
      save: jest.fn().mockResolvedValue(true)
    }

    Quiz.findById.mockResolvedValue(mockQuiz)

    await expect(quizService.updateQuiz(mockAuthorId, mockQuizId, mockData)).rejects.toThrow(errorMessage)
    expect(Quiz.findById).toHaveBeenCalledWith(mockQuizId)
  })

  it('should update allowed fields only', async () => {
    const mockQuiz = {
      _id: mockQuizId,
      author: mockAuthorId,
      title: 'Initial title',
      description: 'Initial description',
      extraField: 'Not to be updated',
      save: jest.fn().mockResolvedValue(true)
    }

    Quiz.findById.mockResolvedValue(mockQuiz)

    const dataWithExtraField = { title: 'New title', extraField: 'Updated extra field' }

    await quizService.updateQuiz(mockAuthorId, mockQuizId, dataWithExtraField)

    expect(mockQuiz.title).toBe('New title')
    expect(mockQuiz.extraField).toBe('Not to be updated')
    expect(mockQuiz.save).toHaveBeenCalled()
  })
})
