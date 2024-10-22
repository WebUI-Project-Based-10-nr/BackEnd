const router = require('express').Router()
const asyncWrapper = require('~/middlewares/asyncWrapper')
const categoryController = require('~/controllers/category')
const isEntityValid = require('~/middlewares/entityValidation')
const Category = require('~/models/category')
const subjectRouter = require('~/routes/subject')

const params = [{ model: Category, idName: 'id' }]

router.use('/:id?/subjects', isEntityValid({ params }), subjectRouter)
router.get('/names', asyncWrapper(categoryController.getCategoriesNames))

module.exports = router
