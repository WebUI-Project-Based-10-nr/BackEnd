const router = require('express').Router()
const { authMiddleware } = require('~/middlewares/auth')
const isEntityValid = require('~/middlewares/entityValidation')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const quizController = require('~/controllers/quiz')
const Quiz = require('~/models/quiz')

router.use(authMiddleware)
const params = [{ model: Quiz, idName: 'id' }]

router.get('/:id', isEntityValid(params), asyncWrapper(quizController.getQuizById))
/**
 * @swagger
 * /quizzes/{id}:
 *   get:
 *     summary: Retrieves a quiz by its ID
 *     tags:
 *       - "quiz"
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the quiz to retrieve
 *         required: true
 *         schema:
 *           type: string
 *           example: "66bd11d60bc87a2c7133bd9d"
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *             example:
 *               _id: "66bd1977da1a3f609fe9a1af"
 *               title: "First Quiz"
 *               description: "Quiz description"
 *               items: ["66bd1977da1a3f609fe9a1af", "66bd1977da1a3f609fe9a2fd"]
 *               author: "670d3b3084006895f7ef2884"
 *               category: "66bd19abda1a3f609fe9a1b2"
 *               resourceType: "quizzes"
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Internal server error
 */
module.exports = router
