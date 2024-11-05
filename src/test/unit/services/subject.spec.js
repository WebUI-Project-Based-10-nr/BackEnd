const Subject = require('~/models/subject')
const subjectService = require('~/services/subject')

jest.mock('~/models/subject')

describe('Subject Service', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const initializeMocks = (subjects, count) => {
    Subject.find.mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(subjects)
    })
    Subject.countDocuments.mockResolvedValue(count)
  }

  describe('getSubjects', () => {
    it('should return subjects and their count', async () => {
      const mockSubjects = [
        { _id: '1', name: 'Subject 1', category: 'Category 1' },
        { _id: '2', name: 'Subject 2', category: 'Category 2' }
      ]

      initializeMocks(mockSubjects, mockSubjects.length)

      const res = await subjectService.getSubjects(0, 10)

      expect(res).toEqual({
        items: mockSubjects,
        count: mockSubjects.length
      })
      expect(Subject.find).toHaveBeenCalled()
      expect(Subject.countDocuments).toHaveBeenCalled()
    })

    it('should return an empty array and zero count when no subjects exist', async () => {
      initializeMocks([], 0)

      const res = await subjectService.getSubjects(0, 10)

      expect(res).toEqual({ items: [], count: 0 })
      expect(Subject.find).toHaveBeenCalled()
      expect(Subject.countDocuments).toHaveBeenCalled()
    })

    it('should throw an error when the database operation fails', async () => {
      Subject.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error('Database Error'))
      })

      await expect(subjectService.getSubjects(0, 10)).rejects.toThrow('Database Error')
      expect(Subject.find).toHaveBeenCalled()
    })
  })
})
