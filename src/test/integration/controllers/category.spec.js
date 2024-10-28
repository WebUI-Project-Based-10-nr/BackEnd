const categoryService = require('~/services/category')
const { getCategoriesNames } = require('~/controllers/category')

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
