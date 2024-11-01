const router = require('express').Router()
const { authMiddleware } = require('~/middlewares/auth')
const attachmentController = require('~/controllers/attachment')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const createUploadMiddleware = require('~/middlewares/multer')
const Attachment = require('~/models/attachment')
const isEntityValid = require('~/middlewares/entityValidation')

const params = [{ model: Attachment, idName: 'id' }]

router.use(authMiddleware)
router.get('/', asyncWrapper(attachmentController.getAttachments))
router.get('/:id', isEntityValid(params), asyncWrapper(attachmentController.getAttachmentById))
router.post('/', createUploadMiddleware('disk').single('file'), asyncWrapper(attachmentController.createAttachment))
router.patch('/:id', isEntityValid(params), asyncWrapper(attachmentController.updateAttachment))
router.delete('/:id', isEntityValid(params), asyncWrapper(attachmentController.deleteAttachment))

module.exports = router
