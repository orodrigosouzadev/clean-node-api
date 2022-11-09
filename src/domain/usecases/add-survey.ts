export interface AddSurvey {
  add (data: AddSurvey.Params): Promise<void>
}

export namespace AddSurvey {
  type SurveyAnswerModel = {
    image?: string
    answer: string
  }

  export type Params = {
    question: string
    answers: SurveyAnswerModel[]
    date: Date
    didAnswer?: boolean
  }
}
