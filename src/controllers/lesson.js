const getCategoriesOptions = require('~/utils/getCategoriesOption')
const getMatchOptions = require('~/utils/getMatchOptions')
const getSortOptions = require('~/utils/getSortOptions')
const { lessonService } = require('~/services/lesson')
const isObjectIdValid = require('~/utils/objectIdValidation')

class LessonController {
  async getLessons(req, res) {
    const author = req.user.id
    const { title, sort, skip = 0, limit = 10, categories } = req.query

    let categoriesOptions

    if (Array.isArray(categories)) {
      categoriesOptions = getCategoriesOptions(categories)
    } else if (categories) {
      categoriesOptions = [categories]
    }

    const match = getMatchOptions({
      author,
      title,
      categoryIDs: categoriesOptions
    })

    const sortOptions = getSortOptions(sort)

    const lessons = await lessonService.getLessons(match, sortOptions, +skip, +limit)
    res.json(lessons)
  }

  async getLessonById(req, res) {
    const lessonId = req.params.id
    const author = req.user.id

    isObjectIdValid(lessonId)

    const lesson = await lessonService.getLessonById(author, lessonId)
    res.json(lesson)
  }

  async createLesson(req, res) {
    const author = req.user.id
    const { title, description, category, attachments, text } = req.body

    const newLesson = await lessonService.createLesson(author, title, description, category, text, attachments)
    res.status(201).json(newLesson)
  }

  async deleteLesson(req, res) {
    const author = req.user.id
    const lessonId = req.params.id

    isObjectIdValid(lessonId)

    await lessonService.deleteLesson(author, lessonId)
    return res.json({ message: 'Item successfully deleted' })
  }

  async updateLesson(req, res) {
    const author = req.user.id
    const lessonId = req.params.id
    const data = req.body

    isObjectIdValid(lessonId)

    const updatedLesson = await lessonService.updateLesson(author, lessonId, data)
    res.status(200).json(updatedLesson)
  }
}

module.exports = new LessonController()
