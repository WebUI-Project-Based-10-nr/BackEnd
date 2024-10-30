const { Schema, model } = require('mongoose')
const { FIELD_CANNOT_BE_EMPTY } = require('~/consts/errors')
const { CATEGORY } = require('~/consts/models')

const categorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, FIELD_CANNOT_BE_EMPTY('name')]
  },
  appearance: {
    icon: {
      type: String,
      default: 'https://www.svgrepo.com/show/532031/cloud-fog.svg'
    },
    color: {
      type: String,
      default: '#66C42C'
    }
  }
})

module.exports = model(CATEGORY, categorySchema)
