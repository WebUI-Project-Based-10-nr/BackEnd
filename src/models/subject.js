const { Schema, model } = require('mongoose')
const { FIELD_CANNOT_BE_EMPTY } = require('~/consts/errors')
const { CATEGORY, SUBJECT } = require('~/consts/models')

const subjectSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, FIELD_CANNOT_BE_EMPTY('name')]
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: CATEGORY,
      required: [true, FIELD_CANNOT_BE_EMPTY('category')]
    }
  },
  { timestamps: true, versionKey: false }
)

subjectSchema.index({ name: 1 }, { unique: true })

module.exports = model(SUBJECT, subjectSchema)
