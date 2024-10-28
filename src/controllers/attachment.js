const attachmentService = require('~/services/attachment')
const { createBadRequestError, createServerError } = require('~/utils/errorsHelper')
const getCategoriesOptions = require('~/utils/getCategoriesOption')
const getMatchOptions = require('~/utils/getMatchOptions')
const getSortOptions = require('~/utils/getSortOptions')
const { Types } = require('mongoose')

class Attachment {
  static isObjectIdValid(id) {
    if (!Types.ObjectId.isValid(id)) {
      throw createBadRequestError()
    }
  }

  async getAttachments(req, res) {
    const author = req.user.id
    const { name, sort, skip, limit, categories } = req.query

    let categoriesOptions

    if (Array.isArray(categories)) {
      categoriesOptions = getCategoriesOptions(categories)
    } else if (categories) {
      categoriesOptions = [categories]
    }

    const match = getMatchOptions({
      author,
      name,
      category: categoriesOptions
    })

    const sortOptions = getSortOptions(sort)

    const attachments = await attachmentService.getAttachments(match, sortOptions, parseInt(skip), parseInt(limit))

    res.json(attachments)
  }

  async getAttachmentById(req, res) {
    const author = req.user.id
    const attachmentId = req.params.id

    Attachment.isObjectIdValid(attachmentId)

    const filePath = await attachmentService.getAttachmentById(attachmentId, author)
    res.sendFile(filePath, (err) => {
      if (err) {
        throw createServerError()
      }
    })
  }

  async createAttachment(req, res) {
    const file = req.file
    const author = req.user.id

    if (!file) {
      throw createBadRequestError()
    }

    const attachment = await attachmentService.createAttachment(author, file)
    return res.status(201).json(attachment)
  }

  async deleteAttachment(req, res) {
    const author = req.user.id
    const attachmentId = req.params.id

    Attachment.isObjectIdValid(attachmentId)

    await attachmentService.deleteAttachment(attachmentId, author)

    return res.status(200).json({ message: 'Item successfully deleted' })
  }

  async updateAttachment(req, res) {
    const author = req.user.id
    const attachmentId = req.params.id
    const updateData = req.body

    Attachment.isObjectIdValid(attachmentId)

    const updatedAttachment = await attachmentService.updateAttachment(attachmentId, author, updateData)
    return res.status(200).json(updatedAttachment)
  }
}

module.exports = new Attachment()
