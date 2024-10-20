const getCategoriesOptions = require('~/utils/getCategoriesOption')
const getMatchOptions = require('~/utils/getMatchOptions')
const getSortOptions = require('~/utils/getSortOptions')
const { lessonService } = require('~/services/lesson')

class LessonController {
  getLessons(req, res) {
    const { title, sort, skip = 0, limit = 10, categories } = req.query
    let categoriesOptions

    if (Array.isArray(categories)) {
      categoriesOptions = getCategoriesOptions(categories)
    } else if (categories) {
      categoriesOptions = [categories]
    }

    const match = getMatchOptions({
      title,
      categoryIDs: categoriesOptions
    }) // Type Match = {title: string | string[], categoryIDs: string[]}

    const sortOptions = getSortOptions(sort)
    try {
      const lessons = lessonService.getLessons(match, sortOptions, +skip, +limit)
      res.status(200).json(lessons)
    } catch (e) {
      console.error(e.message)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  getLessonById(req, res) {
    const { lessonId } = req.params

    try {
      const lesson = lessonService.getLessonById(+lessonId)
      res.status(200).json(lesson)
    } catch (e) {
      console.error(e.message)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  createLesson(req, res) {
    const { id: author } = req.user
    const { title, description, category } = req.body

    try {
      const newLesson = lessonService.createLesson({ author, title, description, category })
      res.status(201).json(newLesson)
    } catch (e) {
      console.error(e.message)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  deleteLesson(req, res) {
    const userId = req.user.id
    const { id } = req.params

    try {
      const deleteLesson = lessonService.deleteLesson(+id, userId)
      res.status(200).json(deleteLesson)
    } catch (e) {
      console.error(e.message)
      res.status(500).json(e)
    }
  }

  updateLesson(req, res) {
    const { id } = req.params
    const { id: currentUserId } = req.user
    const data = req.body

    const updatedLesson = lessonService.updateLesson(+id, currentUserId, data)
    res.status(200).json(updatedLesson)
  }
}

module.exports = new LessonController()
