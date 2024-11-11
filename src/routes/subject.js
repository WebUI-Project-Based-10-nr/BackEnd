const router = require('express').Router({ mergeParams: true })
const Subject = require('~/models/subject')
const subjectController = require('~/controllers/subject')

const asyncWrapper = require('~/middlewares/asyncWrapper')
const isEntityValid = require('~/middlewares/entityValidation')
const { authMiddleware } = require('~/middlewares/auth')

const params = [{ model: Subject, idName: 'id' }]

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

/**
 * @swagger
 * /subjects/{id}:
 *   get:
 *     summary: Find subject by ID
 *     description: Finds and returns a subject with the specified ID.
 *     tags:
 *       - subject
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the subject that needs to be fetched
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *             example:
 *               _id: 66bdcc18f0d7edf34088ed3e
 *               name: Meditation
 *               category: 66bdcb00f0d7edf34088ed23
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               status: 400
 *               code: INVALID_ID
 *               message: ID is invalid.
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: 401
 *               code: UNAUTHORIZED
 *               message: The requested URL requires user authorization.
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               code: DOCUMENT_NOT_FOUND
 *               message: Subject with the specified id was not found.
 */
router.get('/:id', isEntityValid({ params }), asyncWrapper(subjectController.getSubjectById))

module.exports = router
