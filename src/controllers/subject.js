const getMatchOptions = require('~/utils/getMatchOptions')
const subjectService = require('~/services/subject')

const getNamesByCategoryId = async (req, res) => {
  const { id: category } = req.params

  if (!category) {
    return res.status(400).json({ error: 'Category ID is required' })
  }

  const match = getMatchOptions({ category })

  const names = await subjectService.getNamesByCategoryId(match)

  res.status(200).json(names)
}

const deleteSubject = async (req, res) => {
  const { id, categoryId } = req.params
  try {
    const result = await subjectService.deleteSubjectById(categoryId, id)
    res.status(200).json(result)
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: 'Subject not found' })
    }
    if (error.statusCode === 403) {
      return res.status(403).json({ message: 'Unauthorized' })
    }
    res.status(500).json({ message: 'Failed to delete subject' })
  }
}

module.exports = {
  getNamesByCategoryId,
  deleteSubject
}
