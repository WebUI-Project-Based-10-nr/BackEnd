const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware, restrictTo } = require('~/middlewares/auth')
const isEntityValid = require('~/middlewares/entityValidation')
const validateCategoryData = require('~/middlewares/categoryValidation')

const categoryController = require('~/controllers/category')
const subjectRouter = require('~/routes/subject')

const Category = require('~/models/category')

const params = [{ model: Category, idName: 'id' }]

router.use(authMiddleware)
const {
  roles: { ADMIN }
} = require('~/consts/auth')


/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Finds and returns an array with a list of categories data
 *     tags:
 *       - category
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
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *             example:
 *               - _id: "66bd1977da1a3f609fe9a1af"
 *                 name: "Language"
 *                 appearance: {
 *                      icon: "Language",
 *                      color: "79b25f"
 *                 }
 *
 */

router.get('/', asyncWrapper(categoryController.getCategories))
router.get('/:id/subjects', isEntityValid({ params }), subjectRouter)

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

/**
 * @swagger
 * /categories/:
 *   post:
 *     summary: Creates a new category
 *     tags:
 *       - category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Time Management"
 *               appearance:
 *                 type: string
 *                 example: "light"
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "66bdcae3f0d7edf34088ed1d"
 *                 name:
 *                   type: string
 *                   example: "Time Management"
 *                 appearance:
 *                   type: string
 *                   example: "light"
 *       400:
 *         description: Invalid data provided
 *       403:
 *         description: Forbidden - You do not have permission to perform this action
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "FORBIDDEN"
 *                 message:
 *                   type: string
 *                   example: "You do not have permission to perform this action."
 *                 status:
 *                   type: integer
 *                   example: 403
 */
router.use(restrictTo(ADMIN))
router.post('/', validateCategoryData, asyncWrapper(categoryController.addCategory));

module.exports = router
