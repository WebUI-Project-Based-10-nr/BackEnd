const Attachment = require('~/models/attachment')
const { createForbiddenError, createNotFoundError, createServerError } = require('~/utils/errorsHelper')
const path = require('path')
const fs = require('fs')

class AttachmentService {
  static async deleteFile(filePath) {
    try {
      await fs.promises.unlink(filePath)
    } catch (e) {
      throw createServerError()
    }
  }

  async getAttachments(match, sort, skip = 0, limit = 10) {
    const items = await Attachment.find(match)
      .collation({ locale: 'en', strength: 1 })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec()

    const count = await Attachment.countDocuments(match)

    return { items, count }
  }

  async getAttachmentById(attachmentId, author) {
    const attachment = await Attachment.findById(attachmentId)

    if (!attachment) {
      throw createNotFoundError()
    }

    if (attachment.author.toString() !== author) {
      throw createForbiddenError()
    }

    const filePath = path.join(__dirname, '..', '..', attachment.path)

    if (!fs.existsSync(filePath)) {
      throw createNotFoundError()
    }

    return filePath
  }

  async createAttachment(author, file) {
    const { originalname, path, mimetype, size } = file
    return await Attachment.create({
      author,
      name: originalname,
      path,
      mimetype,
      size
    })
  }

  async deleteAttachment(attachmentId, author) {
    const attachment = await Attachment.findById(attachmentId)

    if (!attachment) {
      throw createNotFoundError()
    }

    if (attachment.author.toString() !== author) {
      throw createForbiddenError()
    }

    const filePath = path.join(__dirname, '..', '..', attachment.path)
    await AttachmentService.deleteFile(filePath)

    await attachment.remove()
  }

  async updateAttachment(attachmentId, author, updateData) {
    const attachment = await Attachment.findById(attachmentId)

    if (!attachment) {
      throw createNotFoundError()
    }

    if (attachment.author.toString() !== author) {
      throw createForbiddenError()
    }

    const allowedUpdates = ['name', 'category', 'description']
    const updates = {}

    for (const key in updateData) {
      if (allowedUpdates.includes(key)) {
        updates[key] = updateData[key]
      }
    }

    Object.assign(attachment, updates)
    await attachment.save()

    return attachment
  }
}

module.exports = new AttachmentService()
