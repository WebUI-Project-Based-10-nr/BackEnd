const { Schema, model } = require('mongoose')

const {
  enums: { MAIN_ROLE_ENUM, SPOKEN_LANG_ENUM, PROFICIENCY_LEVEL_ENUM, OFFER_STATUS_ENUM }
} = require('~/consts/validation')
const { USER, OFFER } = require('~/consts/models')
const { ENUM_CAN_BE_ONE_OF, FIELD_CANNOT_BE_EMPTY } = require('~/consts/errors')
const refs = require('~/consts/models')

const offerSchema = new Schema(
  {
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [1, 'Price must be at least 1']
    },
    proficiencyLevel: {
      type: String,
      required: [true, 'proficiency level is required'],
      enum: {
        values: PROFICIENCY_LEVEL_ENUM,
        message: ENUM_CAN_BE_ONE_OF('proficiency level', PROFICIENCY_LEVEL_ENUM)
      }
    },
    title: {
      type: String,
      required: [true, 'title is required'],
      minLength: [1, 'Title must be at least 1 character'],
      maxLength: [100, 'Title must be less than 100 characters'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'description is required'],
      minLength: [1, 'Title must be at least 1 character'],
      maxLength: [100, 'Title must be less than 100 characters'],
      trim: true
    },
    languages: {
      type: [String],
      required: [true, 'languages is required'],
      enum: {
        values: SPOKEN_LANG_ENUM,
        message: ENUM_CAN_BE_ONE_OF('language', SPOKEN_LANG_ENUM)
      }
    },
    authorRole: {
      type: String,
      required: [true, 'authorRole is required'],
      enum: {
        values: MAIN_ROLE_ENUM,
        message: ENUM_CAN_BE_ONE_OF('author role', MAIN_ROLE_ENUM)
      }
    },
    author: {
      type: Schema.Types.ObjectId,
      required: [true, 'author is required'],
      ref: USER
    },
    status: {
      type: String,
      enum: {
        values: OFFER_STATUS_ENUM,
        message: ENUM_CAN_BE_ONE_OF('offer status', OFFER_STATUS_ENUM)
      },
      default: OFFER_STATUS_ENUM[0]
    },
    FAQ: {
      type: [
        {
          question: {
            type: String,
            required: [true, 'Question is required']
          },
          answer: {
            type: String,
            required: [true, 'Answer is required']
          }
        }
      ]
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: refs.SUBJECT,
      required: [true, FIELD_CANNOT_BE_EMPTY('subject')]
    },
    category: {
      type: String,
      required: [true, 'category is required']
    }
  },
  {
    timestamps: true,
    versionKey: false,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

module.exports = model(OFFER, offerSchema)
