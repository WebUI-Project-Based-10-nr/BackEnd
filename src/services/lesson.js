const Lesson = require('~/models/lesson')
const { createForbiddenError, createNotFoundError } = require('~/utils/errorsHelper')

class LessonService {
  async getLessons(match, sort, skip = 0, limit = 10) {
    const items = await Lesson.find(match)
      .collation({ locale: 'en', strength: 1 })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec()

    const totalCount = await Lesson.countDocuments(match)

    return { items, count: totalCount }
  }

  async getLessonById(author, lessonId) {
    const lesson = await Lesson.findById(lessonId)

    if (!lesson) {
      throw createNotFoundError()
    }

    if (lesson.author.toString() !== author) {
      throw createForbiddenError()
    }

    return lesson
  }

  async createLesson(author, title, description, category, text, attachments) {
    return await Lesson.create({
      author,
      title,
      description,
      text,
      category,
      attachments
    })
  }

  async deleteLesson(author, lessonId) {
    const lesson = await Lesson.findById(lessonId)

    if (!lesson) {
      throw createNotFoundError()
    }
    if (lesson.author.toString() !== author) {
      throw createForbiddenError()
    }

    await lesson.remove()
  }

  async updateLesson(author, lessonId, data) {
    const lesson = await Lesson.findById(lessonId)

    if (!lesson) {
      throw createNotFoundError()
    }

    if (lesson.author.toString() !== author) {
      throw createForbiddenError()
    }

    const allowedUpdates = ['title', 'description', 'text', 'category']

    for (const key of allowedUpdates) {
      if (key in data) {
        lesson[key] = data[key]
      }
    }

    if (Array.isArray(data.attachments)) {
      const uniqueAttachments = new Set([
        ...lesson.attachments.map((attachment) => attachment.toString()),
        ...data.attachments
      ])
      lesson.attachments = Array.from(uniqueAttachments)
    }

    await lesson.save()
    return lesson
  }
}

module.exports = { lessonService: new LessonService() }
