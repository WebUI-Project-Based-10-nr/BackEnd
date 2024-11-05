const { getNamesByCategoryId, getSubjects } = require('~/controllers/subject')
const subjectService = require('~/services/subject')
const getMatchOptions = require('~/utils/getMatchOptions')

jest.mock('~/services/subject')
jest.mock('~/utils/getMatchOptions')

describe('GET /categories/{id}/subjects/names', () => {
  const mockReqRes = (params = {}) => {
    const req = { params }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    return { req, res }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

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

describe('GET /subjects', () => {
  const mockReqRes = () => {
    const req = {}
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    return { req, res }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })
  it.skip('should return a list of subjects', async () => {
    const { req, res } = mockReqRes()
    const mockSubjects = [
      {
        _id: '66bdcc18f0d7edf34088ed3e',
        name: 'Meditation',
        category: '66bdcb00f0d7edf34088ed23'
      },
      {
        _id: '66bdcb8bf0d7edf34088ed2e',
        name: 'German',
        category: '66bd1977da1a3f609fe9a1af'
      }
    ]
    subjectService.getSubjects.mockResolvedValue(mockSubjects)

    await getSubjects(req, res)

    expect(subjectService.getSubjects).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(mockSubjects)
  })
  it.skip('should returns 500 on server error', async () => {
    const { req, res } = mockReqRes()
    subjectService.getSubjects.mockRejectedValue()

    await getSubjects(req, res)

    expect(subjectService.getSubjects).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(500)
  })
})
