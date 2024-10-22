const getMatchOptions = require('~/utils/getMatchOptions')
const subjectService = require('~/services/subject')

const getNamesByCategoryId = async (req, res) => {
  const { id: category } = req.params

  const match = getMatchOptions({ category })

  const names = await subjectService.getNamesByCategoryId(match)

  res.status(200).json(names)
}

module.exports = {
  getNamesByCategoryId
}
