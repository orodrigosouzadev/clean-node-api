import { loginPath, signUpPath, surveyPath, surveyResultPath } from './paths'
import { badRequest, forbidden, notFound, serverError, unauthorized } from './components'
import { accountSchema, addSurveyParamsSchema, apiKeyAuthSchema, errorSchema, loginParamsSchema, saveSurveyResultParamsSchema, signUpParamsSchema, surveyAnswerSchema, surveySchema, surveysSchema, surveyResultSchema } from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Rodrigo Souza DEV - Clean Node API',
    description: 'API desenvolvida no curso do Mango para realizar enquetes entre programadores',
    version: '1.0.0'
  },
  license: {
    name: 'MIT',
    url: 'https://opensource.org/licenses/MIT'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }, {
    name: 'Enquete'
  }],
  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': surveyPath,
    '/surveys/{surveyId}/results': surveyResultPath
  },
  schemas: {
    account: accountSchema,
    addSurveyParams: addSurveyParamsSchema,
    loginParams: loginParamsSchema,
    error: errorSchema,
    signUpParams: signUpParamsSchema,
    surveyAnswer: surveyAnswerSchema,
    survey: surveySchema,
    surveys: surveysSchema,
    saveSurveyResultParams: saveSurveyResultParamsSchema,
    surveyResult: surveyResultSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    forbidden,
    notFound,
    serverError,
    unauthorized
  }
}
