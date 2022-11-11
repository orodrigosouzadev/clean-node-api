import { MongoHelper, SurveyMongoRepository } from '@/infra/db'
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'
import { Collection, ObjectId } from 'mongodb'
import FakeObjectId from 'bson-objectid'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const mockAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())
  return res.insertedId.toHexString()
}

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('SurveyMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })

  describe('add()', () => {
    test('should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add(mockAddSurveyParams())
      const survey = await surveyCollection.countDocuments()
      expect(survey).toBe(1)
    })
  })

  describe('loadAll()', () => {
    test('should load all surveys on success', async () => {
      const accountId = await mockAccountId()
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()]
      const result = await surveyCollection.insertMany(addSurveyModels)
      const survey = await surveyCollection.findOne({ _id: result.insertedIds[0] })
      await surveyResultCollection.insertOne({
        surveyId: survey._id,
        accountId: new ObjectId(accountId),
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyModels[0].question)
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe(addSurveyModels[1].question)
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('should load empty list', async () => {
      const accountId = await mockAccountId()
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys).toBeInstanceOf(Array)
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('should load survey by id on success', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const sut = makeSut()
      const survey = await sut.loadById(res.insertedId.toString())
      expect(survey).toBeTruthy()
    })

    test('should throw if load survey by id throws', async () => {
      const sut = makeSut()
      jest.spyOn(sut, 'loadById').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
      const promise = sut.loadById('any_id')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('checkById()', () => {
    test('should return true if survey exists', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const sut = makeSut()
      const exists = await sut.checkById(res.insertedId.toString())
      expect(exists).toBe(true)
    })

    test('should return false if survey not exists', async () => {
      const sut = makeSut()
      const exists = await sut.checkById(new FakeObjectId().toHexString())
      expect(exists).toBe(false)
    })

    test('should throw if checkById throws', async () => {
      const sut = makeSut()
      jest.spyOn(sut, 'loadById').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
      const promise = sut.loadById('any_id')
      await expect(promise).rejects.toThrow()
    })
  })
})
