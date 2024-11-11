const categoryService = require('~/services/category')
const { getCategoriesNames, getCategoryById } = require('~/controllers/category')

jest.mock('~/services/category')

describe('GET /categories/names', () => {
  let res

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
  })

  it('should return 200 and a list of category names', async () => {
    const mockCategoryNames = ['Category 1', 'Category 2', 'Category 3']

    categoryService.getCategoriesNames.mockResolvedValue(mockCategoryNames)

    await getCategoriesNames({}, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(mockCategoryNames)
  })
})

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
