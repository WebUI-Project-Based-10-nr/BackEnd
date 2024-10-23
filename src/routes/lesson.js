const router = require('express').Router()
const { authMiddleware } = require('~/middlewares/auth')
const { createBadRequestError } = require('~/utils/errorsHelper')

const lessonController = require('../controllers/lesson')

const isLessonValid = (req, res, next) => {
  const { title, description, category, text } = req.body

  if (!title || typeof title !== 'string') {
    throw createBadRequestError()
  }
  if (!description || typeof description !== 'string') {
    throw createBadRequestError()
  }
  if (!category || typeof category !== 'object' || !category._id || !category.name) {
    throw createBadRequestError()
  }

  if (!text || typeof text !== 'string') {
    throw createBadRequestError()
  }

  next()
}

router.use(authMiddleware)

router.get('/', lessonController.getLessons)
router.get('/:lessonId', lessonController.getLessonById)
router.post('/', isLessonValid, lessonController.createLesson)
router.delete('/:id', lessonController.deleteLesson)
router.patch('/:id', lessonController.updateLesson)

module.exports = router
