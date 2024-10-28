const { Schema, model } = require('mongoose')
const { FIELD_CANNOT_BE_EMPTY } = require('~/consts/errors')
const { CATEGORY } = require('~/consts/models')

const categorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, FIELD_CANNOT_BE_EMPTY('name')]
  }
})

module.exports = model(CATEGORY, categorySchema)
