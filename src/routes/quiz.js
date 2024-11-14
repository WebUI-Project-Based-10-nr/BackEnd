const router = require('express').Router()
const Quiz = require('~/models/quiz')
const { authMiddleware, restrictTo } = require('~/middlewares/auth')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const quizController = require('../controllers/quiz')

const {
  roles: { TUTOR }
} = require('~/consts/auth')
const isEntityValid = require('~/middlewares/entityValidation')
const params = [{ model: Quiz, idName: 'id' }]

router.use(authMiddleware)
router.get('/', asyncWrapper(quizController.getQuizzes))

/**
 * @swagger
 * /quizzes:
 *   get:
 *     summary: Finds and returns an array with a list of quizzes created by an authenticated user
 *     tags:
 *       - quiz
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
 *         description: Quiz title for filtering by title
 *         schema:
 *           type: string
 *       - name: sort
 *         in: query
 *         description: JSON string representing sort options
 *         schema:
 *           type: string
 *       - name: categories
 *         in: query
 *         description: Filter quizzes by category IDs. Accepts a single ID or an array of IDs
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
 *               $ref: '#/components/schemas/Quiz'
 *
 */

router.use(restrictTo(TUTOR))
router.patch('/:id', isEntityValid({ params }), asyncWrapper(quizController.updateQuiz))

/**
 * @swagger
 * /quizzes/{id}:
 *   patch:
 *     summary: Update an existing quiz by an authenticated user
 *     description: Update an existing quiz by ID
 *     tags:
 *       - quiz
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quiz'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/Quiz'
 *         required: true
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *           application/xml:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: Quiz not found
 *
 */

module.exports = router
