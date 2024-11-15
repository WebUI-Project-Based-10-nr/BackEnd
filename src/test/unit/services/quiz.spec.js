const Quiz = require('~/models/quiz')
const quizService = require('~/services/quiz')

jest.mock('~/models/quiz', () => ({
  findById: jest.fn()
}))

describe('getQuizById Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return the quiz when a valid ID is provided', async () => {
    const mockQuiz = {
      _id: '66bd1977da1a3f609fe9a1af',
      title: 'Sample Quiz',
      description: 'Sample description'
    }

    Quiz.findById.mockResolvedValueOnce(mockQuiz)

    const result = await quizService.getQuizById('66bd1977da1a3f609fe9a1af')

    expect(Quiz.findById).toHaveBeenCalledWith('66bd1977da1a3f609fe9a1af')
    expect(result).toEqual(mockQuiz)
  })

  it('should throw a not found error if quiz does not exist', async () => {
    Quiz.findById.mockResolvedValueOnce(null)

    await expect(quizService.getQuizById('66bd1977da1a3f609fe9a1af')).rejects.toThrow(
      'The requested URL was not found.'
    )

    expect(Quiz.findById).toHaveBeenCalledWith('66bd1977da1a3f609fe9a1af')
  })

  it('should throw a database error if an exception occurs', async () => {
    const errorMessage = 'Database error'

    Quiz.findById.mockRejectedValueOnce(new Error(errorMessage))

    await expect(quizService.getQuizById('66bd1977da1a3f609fe9a1af')).rejects.toThrow(errorMessage)

    expect(Quiz.findById).toHaveBeenCalledWith('66bd1977da1a3f609fe9a1af')
  })
})
