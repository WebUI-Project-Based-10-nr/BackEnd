const { createForbiddenError, createNotFoundError } = require('~/utils/errorsHelper')
let lessons = require('~/data/lessons')
const attachments = require('~/data/attachments')

class LessonService {
  static matchesStructure(lesson, searchCriteria) {
    const { title, categoryIDs } = searchCriteria

    let lessonTitleMatches
    if (title) {
      if (Array.isArray(title)) {
        lessonTitleMatches = title.some((t) => lesson.title.includes(t))
      } else {
        lessonTitleMatches = lesson.title.includes(title)
      }
    } else {
      lessonTitleMatches = true
    }

    let lessonCategoryIdMatches
    if (categoryIDs) {
      lessonCategoryIdMatches = categoryIDs.some((id) => lesson.category._id.toString() === id)
    } else {
      lessonCategoryIdMatches = true
    }

    return lessonTitleMatches && lessonCategoryIdMatches
  }

  static findMatchingLessons(criteria) {
    return lessons.filter((lesson) => this.matchesStructure(lesson, criteria))
  }

  static getAttachmentsForLesson(lesson, userId) {
    return lesson.attachments
      .map((attId) => attachments.find((att) => att.id === attId))
      .filter((attachment) => attachment && attachment.author === userId)
  }

  getLessons(match, sort, skip, limit) {
    let filteredLessons = LessonService.findMatchingLessons(match)

    const sortKey = Object.keys(sort)[0]
    const sortOrder = sort[sortKey] === 'asc' ? 1 : -1

    if (sortKey) {
      filteredLessons = filteredLessons.sort((a, b) => {
        if (a[sortKey] > b[sortKey]) return sortOrder
        if (a[sortKey] < b[sortKey]) return -sortOrder
        return 0
      })
    }

    const items = filteredLessons.slice(skip, skip + limit)

    const totalCount = filteredLessons.length

    return { items, count: totalCount }
  }

  getLessonById(id, userId) {
    const lesson = lessons.find((item) => item._id === id)

    if (!lesson) {
      throw createNotFoundError()
    }

    return { ...lesson, attachments: LessonService.getAttachmentsForLesson(lesson, userId) }
  }

  createLesson(lessonData) {
    const lastLesson = lessons[lessons.length - 1]
    const newLesson = {
      _id: lastLesson ? lastLesson._id + 1 : 1,
      ...lessonData,
      attachments: lessonData.attachments || [],
      lastUpdates: new Date().toISOString()
    }

    lessons.push(newLesson)
    return newLesson
  }

  deleteLesson(lessonId, userId) {
    const lesson = lessons.find((item) => item._id === lessonId)

    if (!lesson) {
      throw createNotFoundError()
    }

    if (lesson.author !== userId) {
      throw createForbiddenError()
    }

    lessons = lessons.filter((item) => item._id !== lessonId)
    return lesson
  }

  updateLesson(lessonId, userId, data) {
    const lesson = lessons.find((item) => item._id === lessonId)

    if (!lesson) {
      throw createNotFoundError()
    }

    if (lesson.author !== userId) {
      throw createForbiddenError()
    }

    const updatedLesson = {
      ...lesson,
      ...data,
      _id: lesson._id,
      author: lesson.author,
      lastUpdates: new Date().toISOString()
    }

    if (data.attachments) {
      updatedLesson.attachments = [...new Set([...lesson.attachments, ...data.attachments])]
    }

    lessons = lessons.map((item) => (item._id === lessonId ? updatedLesson : item))
    return updatedLesson
  }
}

module.exports = { lessonService: new LessonService() }
