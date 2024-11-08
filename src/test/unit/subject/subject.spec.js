const request = require('supertest')
const express = require('express')
const app = express()

const subjectService = {
  deleteSubjectById: jest.fn(),
}

const deleteSubject = async (req, res) => {
  const { id, categoryId } = req.params
  try {
    const result = await subjectService.deleteSubjectById(categoryId, id)
    res.status(200).json({ message: 'Subject successfully deleted' })
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: 'Subject not found' })
    }
    if (error.statusCode === 400) {
      return res.status(400).json({ message: 'Invalid subject ID format' })
    }
    if (error.statusCode === 403) {
      return res.status(403).json({ message: 'Unauthorized' })
    }
    res.status(500).json({ message: 'Failed to delete subject' })
  }
}

const createForbiddenError = () => {
  const error = new Error('Forbidden')
  error.statusCode = 403
  return error
}

const restrictTo = (...roles) => {
  return (req, _, next) => {
    const userHeader = req.headers['user']
    req.user = userHeader ? JSON.parse(userHeader) : null

    if (!req.user || !roles.includes(req.user.role)) {
      return next(createForbiddenError())
    }
    next()
  }
}

app.use(express.json())

app.delete('/categories/:categoryId/subjects/:id', restrictTo('admin'), deleteSubject)

app.use((err, _, res, next) => {
  if (err.statusCode === 403) {
    return res.status(403).json({ message: err.message })
  }
  next(err)
})

// Тести
describe('restrictTo middleware', () => {
  it('should allow access for user with correct role', async () => {
    const res = await request(app)
      .delete('/categories/123/subjects/456')
      .set('Authorization', 'Bearer VALID_ADMIN_TOKEN')
      .set('user', JSON.stringify({ role: 'admin' }))

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Subject successfully deleted')
  })

  it('should deny access for user with incorrect role', async () => {
    const res = await request(app)
      .delete('/categories/123/subjects/456')
      .set('Authorization', 'Bearer VALID_USER_TOKEN')
      .set('user', JSON.stringify({ role: 'user' }))

    expect(res.status).toBe(403)
    expect(res.body.message).toBe('Forbidden')
  })

  it('should deny access if user is not authenticated', async () => {
    const res = await request(app).delete('/categories/123/subjects/456').set('Authorization', 'Bearer INVALID_TOKEN')

    expect(res.status).toBe(403)
    expect(res.body.message).toBe('Forbidden')
  })

  it('should deny access if user has no role', async () => {
    const res = await request(app)
      .delete('/categories/123/subjects/456')
      .set('Authorization', 'Bearer VALID_USER_TOKEN')
      .set('user', '{}')

    expect(res.status).toBe(403)
    expect(res.body.message).toBe('Forbidden')
  })
})

describe('deleteSubject function', () => {
  it('should delete a subject successfully', async () => {
    subjectService.deleteSubjectById.mockResolvedValue({ message: 'Subject successfully deleted' })

    const res = await request(app)
      .delete('/categories/123/subjects/456')
      .set('Authorization', 'Bearer VALID_ADMIN_TOKEN')
      .set('user', JSON.stringify({ role: 'admin' }))

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Subject successfully deleted')
  })

  it('should return 404 if subject is not found', async () => {
    subjectService.deleteSubjectById.mockRejectedValue({ statusCode: 404 })

    const res = await request(app)
      .delete('/categories/123/subjects/456')
      .set('Authorization', 'Bearer VALID_ADMIN_TOKEN')
      .set('user', JSON.stringify({ role: 'admin' }))

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Subject not found')
  })

  it('should return 400 if subject ID is invalid format', async () => {
    subjectService.deleteSubjectById.mockRejectedValue({ statusCode: 400 })

    const res = await request(app)
      .delete('/categories/123/subjects/invalidid')
      .set('Authorization', 'Bearer VALID_ADMIN_TOKEN')
      .set('user', JSON.stringify({ role: 'admin' }))

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Invalid subject ID format')
  })

  it('should return 500 if there is a server error', async () => {
    subjectService.deleteSubjectById.mockRejectedValue(new Error('Internal server error'))

    const res = await request(app)
      .delete('/categories/123/subjects/456')
      .set('Authorization', 'Bearer VALID_ADMIN_TOKEN')
      .set('user', JSON.stringify({ role: 'admin' }))

    expect(res.status).toBe(500)
    expect(res.body.message).toBe('Failed to delete subject')
  })
})
