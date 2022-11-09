import { LoadSurveyResultController } from '@/presentation/controllers'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { throwError } from '@/tests/domain/mocks'
import { LoadSurveyByIdSpy, LoadSurveyResultSpy } from '@/tests/presentation/mocks'
import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'

const mockRequest = (): LoadSurveyResultController.Request => ({
  accountId: faker.datatype.uuid(),
  surveyId: faker.datatype.uuid()
})

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdSpy: LoadSurveyByIdSpy
  loadSurveyResultSpy: LoadSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy()
  const loadSurveyResultSpy = new LoadSurveyResultSpy()
  const sut = new LoadSurveyResultController(loadSurveyByIdSpy, loadSurveyResultSpy)
  return {
    sut,
    loadSurveyByIdSpy,
    loadSurveyResultSpy
  }
}

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSurveyByIdSpy.id).toBe(request.surveyId)
  })

  test('should returns 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    loadSurveyByIdSpy.surveyModel = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('should returns 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    jest.spyOn(loadSurveyByIdSpy, 'loadById').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSurveyResultSpy.surveyId).toBe(request.surveyId)
    expect(loadSurveyResultSpy.accountId).toBe(request.accountId)
  })

  test('should returns 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    jest.spyOn(loadSurveyResultSpy, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should returns 200 on success', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(loadSurveyResultSpy.surveyResultModel))
  })
})
