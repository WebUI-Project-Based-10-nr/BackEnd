const router = require('express').Router()

const idValidation = require('~/middlewares/idValidation')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const { restrictTo, authMiddleware } = require('~/middlewares/auth')
const isEntityValid = require('~/middlewares/entityValidation')

const userController = require('~/controllers/user')
const User = require('~/models/user')
const {
  roles: { ADMIN }
} = require('~/consts/auth')

const params = [{ model: User, idName: 'id' }]

router.use(authMiddleware)

router.param('id', idValidation)

/**
 * @swagger
 * /users/{id}:
 *  get:
 *    tags:
 *      - user
 *    summary: Get user by ID
 *    description: ''
 *    operationId: getUserById
 *    parameters:
 *      - name: id
 *        in: path
 *        description: 'The ID that needs to be fetched. Use user1 for testing. '
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: successful operation
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                name:
 *                  type: string
 *          application/xml:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                name:
 *                   type: string
 *      '401':
 *        description: Requires user authorization
 *      '404':
 *        description: User not found
 */
router.get('/', asyncWrapper(userController.getUsers))
router.get('/:id', isEntityValid({ params }), asyncWrapper(userController.getUserById))
router.patch('/:id', isEntityValid({ params }), asyncWrapper(userController.updateUser))

router.use(restrictTo(ADMIN))
router.patch('/:id/change-status', isEntityValid({ params }), asyncWrapper(userController.updateStatus))
router.delete('/:id', isEntityValid({ params }), asyncWrapper(userController.deleteUser))

module.exports = router
