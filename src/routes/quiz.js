const router = require('express').Router()
const { authMiddleware } = require('~/middlewares/auth')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const quizController = require('../controllers/quiz')

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
