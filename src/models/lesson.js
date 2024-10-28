const { Schema, model } = require('mongoose')
const { LESSON, USER, RESOURCES_CATEGORY, ATTACHMENT } = require('~/consts/models')
const { FIELD_CANNOT_BE_EMPTY, FIELD_CANNOT_BE_LONGER, FIELD_CANNOT_BE_SHORTER } = require('~/consts/errors')

const lessonSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: USER,
      required: [true, FIELD_CANNOT_BE_EMPTY('author')]
    },
    title: {
      type: String,
      required: [true, FIELD_CANNOT_BE_EMPTY('title')],
      minLength: [1, FIELD_CANNOT_BE_SHORTER('title', 1)],
      maxLength: [100, FIELD_CANNOT_BE_LONGER('title', 100)]
    },
    description: {
      type: String,
      required: [true, FIELD_CANNOT_BE_EMPTY('description')],
      minLength: [1, FIELD_CANNOT_BE_SHORTER('description', 1)],
      maxLength: [100, FIELD_CANNOT_BE_LONGER('description', 100)]
    },
    text: {
      type: String,
      required: [true, FIELD_CANNOT_BE_EMPTY('text')],
      minLength: [1, FIELD_CANNOT_BE_SHORTER('text', 1)],
      maxLength: [100, FIELD_CANNOT_BE_LONGER('text', 100)]
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: RESOURCES_CATEGORY,
      default: null
    },
    attachments: {
      type: [Schema.Types.ObjectId],
      ref: ATTACHMENT,
      default: null
    }
  },
  { timestamps: true, versionKey: false }
)

module.exports = model(LESSON, lessonSchema)
