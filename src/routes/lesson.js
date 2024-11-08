const router = require('express').Router()
const { authMiddleware } = require('~/middlewares/auth')
const isEntityValid = require('~/middlewares/entityValidation')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const Lesson = require('~/models/lesson')
const lessonController = require('../controllers/lesson')

const params = [{ model: Lesson, idName: 'id' }]

router.use(authMiddleware)
router.get('/', asyncWrapper(lessonController.getLessons))

/**
 * @swagger
 * /lessons:
 *   get:
 *     summary: Finds and returns an array with a list of lessons created by an authenticated user
 *     tags:
 *       - lesson
 *     parameters:
 *       - name: skip
 *         in: query
 *         description: Number of skipped items for pagination
 *         schema:
 *           type: integer
 *           default: 0
 *       - name: limit
 *         in: query
 *         description: Number of items per page for pagination
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: title
 *         in: query
 *         description: Lesson title for filtering by title
 *         schema:
 *           type: string
 *       - name: sort
 *         in: query
 *         description: JSON string representing sort options
 *         schema:
 *           type: string
 *       - name: categories
 *         in: query
 *         description: Filter lessons by category IDs. Accepts a single ID or an array of IDs
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *             example:
 *               - _id: "66bd1977da1a3f609fe9a1af"
 *                 title: "test"
 *                 author: "Some author"
 *                 description: "Test desccription"
 *                 text: "Test text"
 *                 category: "66bd19abda1a3f609fe9a1b2"
 *                 attachments: [671fb49b3012646f0832a3f3, 671fb49b3012646f0832a3f2]
 *
 */

router.get('/:id', isEntityValid(params), asyncWrapper(lessonController.getLessonById))
router.post('/', asyncWrapper(lessonController.createLesson))
router.delete('/:id', isEntityValid(params), asyncWrapper(lessonController.deleteLesson))
router.patch('/:id', isEntityValid(params), asyncWrapper(lessonController.updateLesson))

module.exports = router
