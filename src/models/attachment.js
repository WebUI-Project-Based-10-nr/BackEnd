const { Schema, model } = require('mongoose')
const { ATTACHMENT, USER, RESOURCES_CATEGORY } = require('~/consts/models')
const { FIELD_CANNOT_BE_EMPTY, FIELD_CANNOT_BE_SHORTER, FIELD_CANNOT_BE_LONGER } = require('~/consts/errors')

const attachmentSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: USER,
      required: [true, FIELD_CANNOT_BE_EMPTY('author')]
    },
    name: {
      type: String,
      required: [true, FIELD_CANNOT_BE_EMPTY('name')],
      minLength: [1, FIELD_CANNOT_BE_SHORTER('name', 1)],
      maxLength: [50, FIELD_CANNOT_BE_LONGER('name', 50)]
    },
    path: {
      type: String,
      required: [true, FIELD_CANNOT_BE_EMPTY('path')]
    },
    size: {
      type: Number,
      required: [true, FIELD_CANNOT_BE_EMPTY('size')]
    },
    mimetype: {
      type: String,
      required: [true, FIELD_CANNOT_BE_EMPTY('mimeType')]
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: RESOURCES_CATEGORY
    },
    description: {
      type: String,
      minLength: [1, FIELD_CANNOT_BE_SHORTER('description', 1)],
      maxLength: [200, FIELD_CANNOT_BE_LONGER('description', 200)]
    }
  },
  { timestamps: true, versionKey: false }
)

module.exports = model(ATTACHMENT, attachmentSchema)
