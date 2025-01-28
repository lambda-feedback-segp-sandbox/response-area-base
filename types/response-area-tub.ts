import {
  TeacherModularResponseFragment,
  StudentModularResponseFragment,
  TeacherCreateResponseInput,
} from '@lambda-feedback-segp-sandbox/graphql-api/api/graphql'
import { ZodSchema } from 'zod'

import {
  IModularResponseSchema,
  IResponseAreaAnswerSchema,
} from '../schemas/question-form.schema'
import { JsonNestedSchema } from '../utils/json'

import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
} from './base-props.type'

export abstract class ResponseAreaTub {
  public readonly responseType?: string

  public readonly canToggleLatexInStats: boolean = false

  public readonly delegatePreResponseText: boolean = true

  public readonly delegatePostResponseText: boolean = true

  public readonly delegateLivePreview: boolean = true

  public readonly delegateFeedback: boolean = true

  public readonly delegateCheck: boolean = true

  public readonly delegateErrorMessage: boolean = true

  public readonly displayInFlexContainer: boolean = true

  public readonly displayWideInput: boolean = false

  public readonly displayAlwaysInColumn: boolean = false

  protected configSchema?: ZodSchema

  protected config?: JsonNestedSchema

  protected answerSchema?: ZodSchema

  protected answer?: any

  constructor() {}

  protected extractConfig = (provided: any): void => {
    if (!this.configSchema) return

    const parsedConfig = this.configSchema.safeParse(provided)
    if (!parsedConfig.success) throw new Error('Could not extract config')

    this.config = parsedConfig.data
  }

  protected extractAnswer = (provided: any): void => {
    if (!this.answerSchema) throw new Error('Not implemented')

    const parsedAnswer = this.answerSchema.safeParse(provided)
    if (!parsedAnswer.success) throw new Error('Could not extract answer')

    this.answer = parsedAnswer.data
  }

  initWithDefault = (): void => {}

  initWithResponse = (response: IModularResponseSchema): void => {
    this.extractConfig(response.config)

    this.extractAnswer(response.answer)
  }

  initWithStudentFragment = (
    studentFragment: StudentModularResponseFragment,
  ): void => {
    this.extractConfig(studentFragment.config)
  }

  initWithTeacherFragment = (
    teacherFragment: TeacherModularResponseFragment,
  ): void => {
    this.extractConfig(teacherFragment.config)

    this.extractAnswer(teacherFragment.answer)
  }

  setAnswer = (answer?: IResponseAreaAnswerSchema) => {
    this.extractAnswer(answer)
  }

  toStudentFragment = (): StudentModularResponseFragment => {
    if (!this.responseType) throw new Error('Response type missing')

    return {
      __typename: 'StudentModularResponse',
      responseType: this.responseType,
      config: this.config,
    }
  }

  toTeacherFragment = (): TeacherModularResponseFragment => {
    if (!this.responseType) throw new Error('Response type missing')
    if (this.answer === undefined) throw new Error('Answer missing')

    return {
      __typename: 'TeacherModularResponse',
      responseType: this.responseType,
      config: this.config,
      answer: this.answer,
    }
  }

  toResponse = (): IModularResponseSchema => {
    if (!this.responseType) throw new Error('Response type missing')
    if (this.answer === undefined) throw new Error('Answer missing')

    return {
      responseType: this.responseType,
      config: this.config,
      answer: this.answer,
    }
  }

  toResponseMutation = (): TeacherCreateResponseInput => {
    if (!this.responseType) throw new Error('Response type missing')
    if (this.answer === undefined) throw new Error('Answer missing')

    return {
      responseInput: {
        responseType: this.responseType,
        config: this.config,
        answer: this.answer,
      },
    }
  }

  InputComponent: React.FC<BaseResponseAreaProps> = props => {
    throw new Error('Not implemented')
  }

  WizardComponent: React.FC<BaseResponseAreaWizardProps> = props => {
    throw new Error('Not implemented')
  }
}
