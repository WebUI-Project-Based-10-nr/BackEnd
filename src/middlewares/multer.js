const multer = require('multer')
const path = require('path')

function createUploadMiddleware(storageType) {
  let storage

  if (storageType === 'memory') {
    storage = multer.memoryStorage()
  } else if (storageType === 'disk') {
    storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/')
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
      }
    })
  } else {
    throw new Error('Invalid storage type. Use "memory" or "disk".')
  }

  return multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024,
      fieldNameSize: 100
    }
  })
}

module.exports = createUploadMiddleware
