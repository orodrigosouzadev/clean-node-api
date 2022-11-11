import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  saveSurveyResultParams: SaveSurveyResultRepository.Params

  async save (data: SaveSurveyResultRepository.Params): Promise<void> {
    this.saveSurveyResultParams = data
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  result = mockSurveyResultModel()
  surveyId: string
  accountId: string

  async loadBySurveyId (surveyId: string, accountId: string): Promise<LoadSurveyResultRepository.Result> {
    this.surveyId = surveyId
    this.accountId = accountId
    return Promise.resolve(this.result)
  }
}
