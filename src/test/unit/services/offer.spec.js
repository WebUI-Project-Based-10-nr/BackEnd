const Offer = require('~/models/offer')
const offerService = require('~/services/offer')
const filterAllowedFields = require('~/utils/filterAllowedFields')
const { allowedOfferFieldsForUpdate } = require('~/validation/services/offer')

jest.mock('~/models/offer')
jest.mock('~/utils/filterAllowedFields')

describe('Offer service', () => {
  const mockOfferId = '123'
  const mockData = { title: 'New Offer', price: 100 }
  const mockCurrentUserId = 'userId'
  const author = 'authorId'
  const authorRole = 'teacher'

  let mockOffer

  beforeEach(() => {
    mockOffer = {
      _id: mockOfferId,
      price: 200,
      title: 'Updated Offer',
      author: { FAQ: { teacher: 'Some FAQ' } },
      authorRole: 'teacher',
      save: jest.fn(),
      validate: jest.fn()
    }
  })

  function setupMockOfferWithExec(offer) {
    Offer.findById.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(offer)
    })
  }

  it('should create a new offer', async () => {
    Offer.create.mockResolvedValue(mockData)

    const result = await offerService.createOffer(author, authorRole, mockData)

    expect(Offer.create).toHaveBeenCalledWith({ ...mockData, author, authorRole })
    expect(result).toEqual(mockData)
  })

  it('should get all offers', async () => {
    const pipeline = [{ $match: { status: 'active' } }]
    const mockOffers = [{ title: 'offer 1' }, { title: 'offer 2' }]

    Offer.aggregate.mockResolvedValue(mockOffers)

    const result = await offerService.getOffers(pipeline)

    expect(result).toEqual(mockOffers)
    expect(Offer.aggregate).toHaveBeenCalledWith(pipeline)
  })

  it('should get an offer by ID', async () => {
    setupMockOfferWithExec(mockOffer)

    const result = await offerService.getOfferById(mockOfferId)

    expect(Offer.findById).toHaveBeenCalledWith(mockOfferId)
    expect(result.author.FAQ).toEqual('Some FAQ')
  })

  it('should throw "Document not found" for nonexistent offer', async () => {
    setupMockOfferWithExec(null)

    await expect(offerService.getOfferById(mockOfferId)).rejects.toThrow('Document not found')
    expect(Offer.findById).toHaveBeenCalledWith(mockOfferId)
  })

  it('should handle offer with missing FAQ for author role', async () => {
    const mockOfferWithNoFAQ = { ...mockOffer, author: { FAQ: {} } }
    setupMockOfferWithExec(mockOfferWithNoFAQ)

    const result = await offerService.getOfferById(mockOfferId)

    expect(result.author.FAQ).toBeUndefined()
  })

  it('should delete offer by ID', async () => {
    Offer.findByIdAndRemove.mockReturnValue({ exec: jest.fn().mockResolvedValue(true) })

    await offerService.deleteOffer(mockOfferId)

    expect(Offer.findByIdAndRemove).toHaveBeenCalledWith(mockOfferId)
  })

  it('should update an offer', async () => {
    Offer.findById.mockResolvedValue(mockOffer)
    filterAllowedFields.mockReturnValue({ price: 200, title: 'Updated Offer' })

    await offerService.updateOffer(mockOfferId, mockCurrentUserId, mockData)

    expect(Offer.findById).toHaveBeenCalledWith(mockOfferId)
    expect(filterAllowedFields).toHaveBeenCalledWith(mockData, allowedOfferFieldsForUpdate)
    expect(mockOffer.price).toBe(200)
    expect(mockOffer.title).toBe('Updated Offer')
    expect(mockOffer.validate).toHaveBeenCalled()
    expect(mockOffer.save).toHaveBeenCalled()
  })
})
