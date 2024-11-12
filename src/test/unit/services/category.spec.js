const Category = require('~/models/category')
const categoryService = require('~/services/category')

jest.mock('~/models/category')

describe('Category Service', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  function setupMockCategoriesWithExec(categories) {
    Category.find.mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(categories)
    })
  }

  function setupMockCount(categories) {
    Category.countDocuments.mockResolvedValue(categories)
  }

  describe('getCategories', () => {
    it('should return the correct items and count when categories exist', async () => {
      const mockCategories = [
        { _id: '1', name: 'Category 1' },
        { _id: '2', name: 'Category 2' }
      ]
      const mockCount = mockCategories.length

      setupMockCategoriesWithExec(mockCategories)
      setupMockCount(mockCount)

      const result = await categoryService.getCategories(0, 10)

      expect(result).toEqual({
        items: mockCategories,
        count: mockCount
      })

      expect(Category.find).toHaveBeenCalled()
      expect(Category.countDocuments).toHaveBeenCalled()
    })

    it('should return an empty array and zero count when no categories exist', async () => {
      const mockCount = 0
      setupMockCategoriesWithExec([])
      setupMockCount(mockCount)

      const result = await categoryService.getCategories(0, 10)

      expect(result).toEqual({ items: [], count: mockCount })
      expect(Category.find).toHaveBeenCalled()
      expect(Category.countDocuments).toHaveBeenCalled()
    })

    it('should handle errors thrown by the database ', async () => {
      const errorMessage = 'Database error'

      Category.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error(errorMessage))
      })

      await expect(categoryService.getCategories(0, 10)).rejects.toThrow(errorMessage)
      expect(Category.find).toHaveBeenCalled()
    })
  })

  describe('getCategoryById', () => {
    it('should return the correct category when one exist', async () => {
      const mockCategory = { _id: '1', name: 'Category 1' }
      Category.findById.mockResolvedValue(mockCategory)

      setupMockCategoriesWithExec(mockCategory)

      const result = await categoryService.getCategoryById('1')

      expect(Category.findById).toHaveBeenCalledWith('1')
      expect(result).toEqual(mockCategory)
    })

    it('should throw a not found error when category does not exist', async () => {
      const notFoundError = new Error('Not Found')
      Category.findById.mockRejectedValue(notFoundError)

      await expect(categoryService.getCategoryById('1')).rejects.toThrow('Not Found')
      expect(Category.findById).toHaveBeenCalledWith('1')
    })
  })
})
