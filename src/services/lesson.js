const { createForbiddenError, createNotFoundError } = require('~/utils/errorsHelper')
const description = 'Blah-blah-blah-blah-blah-blah-blah-Blah-blah-blah'
let lessons = [
  {
    author: '6707dcb29e254368b86fc1ba',
    _id: 1,
    title: 'Algebra Basics',
    description,
    category: { _id: 1, name: 'Math' }
  },
  {
    author: '6707dcb29e254368b86fc1ba',
    _id: 2,
    title: 'Introduction to Biology',
    description,
    category: { _id: 2, name: 'Science' }
  },
  {
    author: '6707dcb29e254368b86fc1ba',
    _id: 3,
    title: 'Advanced Geometry',
    description,
    category: { _id: 1, name: 'Math' }
  },
  {
    author: '6707dcb29e254368b86fc1ba',
    _id: 4,
    title: 'World War II',
    description,
    category: { _id: 3, name: 'History' }
  },
  { author: '6707dcb29e254368b86fc1ba', _id: 5, title: 'Physics', description, category: { _id: 2, name: 'Science' } }
]

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

  getLessonById(id) {
    return lessons.filter((item) => item._id === id)
  }

  createLesson(lessonData) {
    const lastLesson = lessons[lessons.length - 1]
    const newLesson = {
      _id: lastLesson ? lastLesson._id + 1 : 1,
      ...lessonData
    }

    lessons.push(newLesson)
    console.log(lessons)
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

    const updatedLesson = { ...lesson, ...data, _id: lesson._id, author: lesson.author }

    lessons = lessons.map((item) => (item._id === lessonId ? updatedLesson : item))
    return updatedLesson
  }
}

module.exports = { lessonService: new LessonService() }
