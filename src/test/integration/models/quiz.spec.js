const Quiz = require('~/models/quiz')
const dbHandler = require('~/test/dbHandler')
const {
  enums: { RESOURCES_TYPES_ENUM }
} = require('~/consts/validation')

describe.only('Quiz', () => {
  beforeAll(async () => {
    await dbHandler.connect()
  })
  beforeEach(async () => {
    await Quiz.deleteMany()
    jest.clearAllMocks()
  })
  afterAll(async () => await dbHandler.closeDatabase())

  it('title is mandatory', async () => {
    await expect(
      Quiz.create({
        description: 'A challenging quiz on geography',
        items: [],
        author: 'someAuthorId'
      })
    ).rejects.toThrow('The title field cannot be empty.')
  })

  it('title min length is set to 1', async () => {
    await expect(
      Quiz.create({
        title: '',
        description: 'A challenging quiz on geography',
        items: [],
        author: 'someAuthorId'
      })
    ).rejects.toThrow('The title field cannot be empty.')
  })

  it('title max length is set to 100', async () => {
    await expect(
      Quiz.create({
        title: 'A'.repeat(101),
        description: 'A challenging quiz on geography',
        items: [],
        author: 'someAuthorId'
      })
    ).rejects.toThrow('Title cannot be longer than 100 symbol.')
  })

  it('items are mandatory', async () => {
    await expect(
      Quiz.create({
        title: 'Geography Quiz',
        description: 'A challenging quiz on geography',
        author: 'someAuthorId'
      })
    ).rejects.toThrow('The items field cannot be empty.')
  })

  it('author is mandatory', async () => {
    await expect(
      Quiz.create({
        title: 'Geography Quiz',
        description: 'A challenging quiz on geography',
        items: ['60d21b4667d0d8992e610c85', '60d21b4667d0d8992e610c86']
      })
    ).rejects.toThrow('The author field cannot be empty.')
  })

  it('category can be empty', async () => {
    const quiz = await Quiz.create({
      title: 'Geography Quiz',
      description: 'A challenging quiz on geography',
      items: ['60d21b4667d0d8992e610c85', '60d21b4667d0d8992e610c86'],
      author: 'someAuthorId'
    })

    expect(quiz).toHaveProperty('category', undefined)
  })

  it('resourceType has a default value', async () => {
    const quiz = await Quiz.create({
      title: 'Geography Quiz',
      description: 'A challenging quiz on geography',
      items: ['60d21b4667d0d8992e610c85', '60d21b4667d0d8992e610c86'],
      author: 'someAuthorId'
    })

    expect(quiz.resourceType).toBe(RESOURCES_TYPES_ENUM[3])
  })

  it('resourceType must be one of the allowed values', async () => {
    const invalidResourceType = 'invalidType'
    await expect(
      Quiz.create({
        title: 'Geography Quiz',
        description: 'A challenging quiz on geography',
        items: ['60d21b4667d0d8992e610c85', '60d21b4667d0d8992e610c86'],
        author: 'someAuthorId',
        resourceType: invalidResourceType
      })
    ).rejects.toThrow('Resource type can be either of these: lessons,attachments,questions,quizzes')
  })

  it('description is trimmed on save', async () => {
    const description = '  A challenging quiz on geography  '
    const quiz = await Quiz.create({
      title: 'Geography Quiz',
      description: description,
      items: ['60d21b4667d0d8992e610c85', '60d21b4667d0d8992e610c86'],
      author: 'someAuthorId'
    })

    expect(quiz.description).toBe('A challenging quiz on geography')
  })

  it('category is optional but can be set', async () => {
    const categoryId = '60d21b4667d0d8992e610c84'
    const quiz = await Quiz.create({
      title: 'Geography Quiz',
      description: 'A challenging quiz on geography',
      items: ['60d21b4667d0d8992e610c85', '60d21b4667d0d8992e610c86'],
      author: 'someAuthorId',
      category: categoryId
    })

    expect(quiz.category.toString()).toEqual(categoryId)
  })
})
