const router = require('express').Router({ mergeParams: true })

const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware } = require('~/middlewares/auth')

const subjectController = require('~/controllers/subject')

router.use(authMiddleware)

/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: Finds and returns an array with a list of subjects
 *     tags:
 *       - subject
 *     parameters:
 *       - name: skip
 *         in: query
 *         description: Number of skipped items
 *       - name: limit
 *         in: query
 *         description: Limit of items
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of all items was successfully received.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   category:
 *                     type: string
 *             example:
 *               - _id: "66bd1a02da1a3f609fe9a1ba"
 *                 name: "English"
 *                 category: "66bd1977da1a3f609fe9a1af"
 *               - _id: "66bdcb75f0d7edf34088ed2a"
 *                 name: "Maths"
 *                 category: "66bd19abda1a3f609fe9a1b2"
 *               - _id: "66bd1a35da1a3f609fe9a1c2"
 *                 name: "Computer science"
 *                 category: "66bd19cdda1a3f609fe9a1b5"
 *       500:
 *         description: "Server error."
 *         content:
 *           application/json:
 *             example:
 *               status: 500
 *               message: "Internal server error."
 */

router.get('/', asyncWrapper(subjectController.getSubjects))

/**
 * @swagger
 * /categories/{id}/subjects/names:
 *   get:
 *     summary: Retrieve the names of subjects for a specified category ID
 *     tags:
 *       - category
 *       - subject
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the category.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of subjects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *             example:
 *               - _id: "66bd1a02da1a3f609fe9a1ba"
 *                 name: "English"
 *               - _id: "66bdcb75f0d7edf34088ed2a"
 *                 name: "Polish"
 *       400:
 *         description: Category ID is required.
 *         content:
 *           application/json:
 *             example:
 *               status: 400
 *               message: "Category ID is required."
 */
router.get('/names', asyncWrapper(subjectController.getNamesByCategoryId))

module.exports = router
