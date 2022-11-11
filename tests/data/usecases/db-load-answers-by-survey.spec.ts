import { DbLoadAnswersBySurvey } from '@/data/usecases'
import { LoadAnswersBySurveyIdRepositorySpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadAnswersBySurveyIdRepositorySpy: LoadAnswersBySurveyIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyIdRepositorySpy = new LoadAnswersBySurveyIdRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyIdRepositorySpy)
  return {
    sut,
    loadAnswersBySurveyIdRepositorySpy
  }
}

let surveyId: string

describe('DbLoadSurveyById', () => {
  beforeEach(() => {
    surveyId = faker.datatype.uuid()
  })

  test('should call LoadAnswersBySurveyIdRepository with correct id', async () => {
    const { sut, loadAnswersBySurveyIdRepositorySpy } = makeSut()
    await sut.loadAnswers(surveyId)
    expect(loadAnswersBySurveyIdRepositorySpy.id).toBe(surveyId)
  })

  test('should return answers on success', async () => {
    const { sut, loadAnswersBySurveyIdRepositorySpy } = makeSut()
    const answers = await sut.loadAnswers(surveyId)
    expect(answers).toEqual([
      loadAnswersBySurveyIdRepositorySpy.result[0],
      loadAnswersBySurveyIdRepositorySpy.result[1]
    ])
  })

  test('should return empty array if LoadAnswersBySurveyIdRepository returns []', async () => {
    const { sut, loadAnswersBySurveyIdRepositorySpy } = makeSut()
    loadAnswersBySurveyIdRepositorySpy.result = []
    const answers = await sut.loadAnswers(surveyId)
    expect(answers).toEqual([])
  })

  test('should throw if LoadAnswersBySurveyIdRepository throws', async () => {
    const { sut, loadAnswersBySurveyIdRepositorySpy } = makeSut()
    jest.spyOn(loadAnswersBySurveyIdRepositorySpy, 'loadAnswers').mockImplementationOnce(throwError)
    const promise = sut.loadAnswers(surveyId)
    await expect(promise).rejects.toThrow()
  })
})
