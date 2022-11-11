import { DbLoadSurveys } from '@/data/usecases/db-load-surveys'
import { LoadSurveysRepositorySpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositorySpy: LoadSurveysRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy()
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy)
  return {
    sut,
    loadSurveysRepositorySpy
  }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    const accountId = faker.datatype.uuid()
    await sut.load(accountId)
    expect(loadSurveysRepositorySpy.accountId).toBe(accountId)
  })

  test('should return a list of Surveys on success', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    const surveys = await sut.load(faker.datatype.uuid())
    expect(surveys).toEqual(loadSurveysRepositorySpy.result)
  })

  test('should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    jest.spyOn(loadSurveysRepositorySpy, 'loadAll').mockImplementationOnce(throwError)
    const promise = sut.load(faker.datatype.uuid())
    await expect(promise).rejects.toThrow()
  })
})
