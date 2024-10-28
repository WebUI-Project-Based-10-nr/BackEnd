const router = require('express').Router({ mergeParams: true })

const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware } = require('~/middlewares/auth')

const subjectController = require('~/controllers/subject')

router.use(authMiddleware)

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
