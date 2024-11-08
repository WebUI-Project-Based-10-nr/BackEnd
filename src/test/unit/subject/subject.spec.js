const request = require('supertest')
const express = require('express')
const app = express()

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
app.delete('/categories/:categoryId/subjects/:id', restrictTo('admin'), (req, res) => {
  res.status(200).send('Subject deleted')
})

app.use((err, _, res, next) => {
  if (err.statusCode === 403) {
    return res.status(403).json({ message: err.message })
  }
  next(err)
})

describe('restrictTo middleware', () => {
  it('should allow access for user with correct role', async () => {
    const res = await request(app)
      .delete('/categories/123/subjects/456')
      .set('Authorization', 'Bearer VALID_ADMIN_TOKEN')
      .set('user', JSON.stringify({ role: 'admin' }))

    expect(res.status).toBe(200)
    expect(res.text).toBe('Subject deleted')
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
