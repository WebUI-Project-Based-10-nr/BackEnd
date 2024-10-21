const description = 'Blah-blah-blah-blah-blah-blah-blah-Blah-blah-blah'

module.exports = [
  {
    _id: 1,
    author: '6707dcb29e254368b86fc1ba',
    title: 'Algebra Basics',
    description,
    text: description,
    category: { _id: 1, name: 'Math' },
    attachments: [1],
    lastUpdates: new Date().toISOString()
  },
  {
    _id: 2,
    author: '6707dcb29e254368b86fc1ba',
    title: 'Introduction to Biology',
    description,
    text: description,
    category: { _id: 2, name: 'Science' },
    attachments: [2],
    lastUpdates: new Date().toISOString()
  },
  {
    _id: 3,
    author: '6707dcb29e254368b86fc1ba',
    title: 'Advanced Geometry',
    description,
    text: description,
    category: { _id: 1, name: 'Math' },
    attachments: [3],
    lastUpdates: new Date().toISOString()
  },
  {
    _id: 4,
    author: '6707dcb29e254368b86fc1ba',
    title: 'World War II',
    description,
    text: description,
    category: { _id: 3, name: 'History' },
    attachments: [4, 2],
    lastUpdates: new Date().toISOString()
  },
  {
    _id: 5,
    author: '6707dcb29e254368b86fc1ba',
    title: 'Physics',
    description,
    text: description,
    category: { _id: 2, name: 'Science' },
    attachments: [5],
    lastUpdates: new Date().toISOString()
  }
]
