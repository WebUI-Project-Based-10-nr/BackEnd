const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware } = require('~/middlewares/auth')
const isEntityValid = require('~/middlewares/entityValidation')

const categoryController = require('~/controllers/category')
const subjectRouter = require('~/routes/subject')

const Category = require('~/models/category')

const params = [{ model: Category, idName: 'id' }]

router.use(authMiddleware)

router.use('/:id/subjects', isEntityValid({ params }), subjectRouter)

/**
 * @swagger
 * /categories/names:
 *   get:
 *     summary: Finds and returns an array with a list of categories
 *     tags:
 *       - category
 *     responses:
 *       200:
 *         description: OK
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
 *               - _id: "66bdcae3f0d7edf34088ed1d"
 *                 name: "Time Management"
 *               - _id: "66bd1977da1a3f609fe9a1af"
 *                 name: "Language"
 */
router.get('/names', asyncWrapper(categoryController.getCategoriesNames))

module.exports = router
