const { getNamesByCategoryId, getSubjectById, getSubjects } = require('~/controllers/subject')
const subjectService = require('~/services/subject')
const getMatchOptions = require('~/utils/getMatchOptions')
const parseQueryInt = require('~/utils/parseQueryInt')

jest.mock('~/services/subject')
jest.mock('~/utils/getMatchOptions')
jest.mock('~/utils/parseQueryInt')

describe('Subject controller', () => {
  const mockReqRes = (params = {}, query = {}) => {
    const req = { params, query }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    return { req, res }
  }

  describe('GET /categories/{id}/subjects/names', () => {
    it('should return 400 if category ID is missing', async () => {
      const { req, res } = mockReqRes()

      await getNamesByCategoryId(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'Category ID is required' })
    })

    it('should return 200 with names if category ID is valid', async () => {
      const { req, res } = mockReqRes({ id: 'validCategoryId' })
      const mockMatchOptions = { category: 'validCategoryId' }
      const mockNames = ['subject1', 'subject2']

      getMatchOptions.mockReturnValue(mockMatchOptions)
      subjectService.getNamesByCategoryId.mockResolvedValue(mockNames)

      await getNamesByCategoryId(req, res)

      expect(getMatchOptions).toHaveBeenCalledWith({ category: 'validCategoryId' })
      expect(subjectService.getNamesByCategoryId).toHaveBeenCalledWith(mockMatchOptions)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockNames)
    })
  })

  describe('GET /subjects/:id', () => {
    const mockSubject = { _id: 'mockSubjectId', name: 'English', category: 'mockCategoryId' }

    it('should return 200 with subject if subject ID is valid', async () => {
      const { req, res } = mockReqRes({ id: mockSubject._id })

      subjectService.getSubjectById.mockResolvedValueOnce(mockSubject)

      await getSubjectById(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: expect.any(String),
          name: mockSubject.name,
          category: mockSubject.category
        })
      )
    })
  })

  describe('GET /subjects', () => {
    it('should return 200 with subjects and count if pagination is valid', async () => {
      const { req, res } = mockReqRes({}, { skip: '0', limit: '10' })
      const mockData = { items: [{ name: 'Math' }, { name: 'Science' }], count: 2 }

      parseQueryInt.mockImplementation((value, defaultValue) => parseInt(value, 10) || defaultValue)
      subjectService.getSubjects.mockResolvedValue(mockData)

      await getSubjects(req, res)

      expect(subjectService.getSubjects).toHaveBeenCalledWith(0, 10)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockData)
    })
  })
})
