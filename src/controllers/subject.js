const getMatchOptions = require('~/utils/getMatchOptions')
const subjectService = require('~/services/subject')
const parseQueryInt = require('~/utils/parseQueryInt')

const getSubjectById = async (req, res) => {
  const { id } = req.params

  const subject = await subjectService.getSubjectById(id)

  res.status(200).json(subject)
}

const getNamesByCategoryId = async (req, res) => {
  const { id: category } = req.params

  if (!category) {
    return res.status(400).json({ error: 'Category ID is required' })
  }

  const match = getMatchOptions({ category })

  const names = await subjectService.getNamesByCategoryId(match)

  res.status(200).json(names)
}

const getSubjects = async (req, res) => {
  const skip = parseQueryInt(req.query.skip, 0)
  const limit = parseQueryInt(req.query.limit, 0)

  const subjects = await subjectService.getSubjects(parseInt(skip), parseInt(limit))

  res.status(200).json(subjects)
}

module.exports = {
  getSubjectById,
  getNamesByCategoryId,
  getSubjects
}
