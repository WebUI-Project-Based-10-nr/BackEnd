const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')
const validationMiddleware = require('~/middlewares/validation')
const langMiddleware = require('~/middlewares/appLanguage')

const authController = require('~/controllers/auth')
const signupValidationSchema = require('~/validation/schemas/signup')
const googleAuthValidationSchema = require('~/validation/schemas/googleAuth')
const { loginValidationSchema } = require('~/validation/schemas/login')
const resetPasswordValidationSchema = require('~/validation/schemas/resetPassword')
const forgotPasswordValidationSchema = require('~/validation/schemas/forgotPassword')

router.post(
  '/signup',
  validationMiddleware(signupValidationSchema),
  langMiddleware,
  asyncWrapper(authController.signup)
)

/**
 * @swagger
 * /auth/google-auth:
 *   post:
 *     summary: Authenticate with Google OAuth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: object
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Google OAuth successful
 */
router.post(
  '/google-auth',
  validationMiddleware(googleAuthValidationSchema),
  langMiddleware,
  asyncWrapper(authController.googleAuth)
)

router.post('/login', validationMiddleware(loginValidationSchema), asyncWrapper(authController.login))
router.post('/logout', asyncWrapper(authController.logout))
router.get('/refresh', asyncWrapper(authController.refreshAccessToken))
router.post(
  '/forgot-password',
  validationMiddleware(forgotPasswordValidationSchema),
  langMiddleware,
  asyncWrapper(authController.sendResetPasswordEmail)
)
router.patch(
  '/reset-password/:token',
  validationMiddleware(resetPasswordValidationSchema),
  langMiddleware,
  asyncWrapper(authController.updatePassword)
)

module.exports = router
