import { LoadSurveyResultController } from '@/presentation/controllers'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { throwError } from '@/tests/domain/mocks'
import { CheckSurveyByIdSpy, LoadSurveyResultSpy } from '@/tests/presentation/mocks'
import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'

const mockRequest = (): LoadSurveyResultController.Request => ({
  accountId: faker.datatype.uuid(),
  surveyId: faker.datatype.uuid()
})

type SutTypes = {
  sut: LoadSurveyResultController
  checkSurveyByIdSpy: CheckSurveyByIdSpy
  loadSurveyResultSpy: LoadSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdSpy = new CheckSurveyByIdSpy()
  const loadSurveyResultSpy = new LoadSurveyResultSpy()
  const sut = new LoadSurveyResultController(checkSurveyByIdSpy, loadSurveyResultSpy)
  return {
    sut,
    checkSurveyByIdSpy,
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

  test('should call CheckSurveyByIdSpy with correct value', async () => {
    const { sut, checkSurveyByIdSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(checkSurveyByIdSpy.id).toBe(request.surveyId)
  })

  test('should returns 403 if CheckSurveyByIdSpy returns null', async () => {
    const { sut, checkSurveyByIdSpy } = makeSut()
    checkSurveyByIdSpy.result = false
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('should returns 500 if CheckSurveyByIdSpy throws', async () => {
    const { sut, checkSurveyByIdSpy } = makeSut()
    jest.spyOn(checkSurveyByIdSpy, 'checkById').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should call CheckSurveyByIdSpy with correct values', async () => {
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
