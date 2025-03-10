import {
  TeacherModularResponseFragment,
  StudentModularResponseFragment,
  TeacherCreateResponseInput,
} from '@lambda-feedback-segp-sandbox/graphql-api/api/graphql'
import React from 'react'
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

/**
 * Abstract class representing a response area component with various configuration and response handling methods.
 */
export abstract class ResponseAreaTub {
  /** The response type identifier. */
  readonly responseType?: string

  /** Whether LaTeX can be toggled in statistics. */
  readonly canToggleLatexInStats: boolean = false

  /** Whether pre-response text is delegated. */
  readonly delegatePreResponseText: boolean = true

  /** Whether post-response text is delegated. */
  readonly delegatePostResponseText: boolean = true

  /** Whether live preview is delegated. */
  readonly delegateLivePreview: boolean = true

  /** Whether feedback is delegated. */
  readonly delegateFeedback: boolean = true

  /** Whether check functionality is delegated. */
  readonly delegateCheck: boolean = true

  /** Whether error messages are delegated. */
  readonly delegateErrorMessage: boolean = true

  /** Whether to display in a flex container. */
  readonly displayInFlexContainer: boolean = true

  /** Whether to display wide input. */
  readonly displayWideInput: boolean = false

  /** Whether to always display in a column. */
  readonly displayAlwaysInColumn: boolean = false

  /** Schema for validating the configuration. */
  readonly configSchema?: ZodSchema

  /** The parsed configuration object. */
  protected _config?: JsonNestedSchema
  get config(): JsonNestedSchema | undefined {
    return this._config
  }

  /** Schema for validating the answer. */
  abstract readonly answerSchema: ZodSchema

  /** The extracted answer data. */
  protected _answer?: any
  get answer(): any {
    return this._answer
  }

  constructor() {}

  /** Extracts and validates the configuration from the provided data. */
  protected extractConfig = (provided: any): void => {
    if (!this.configSchema) return

    const parsedConfig = this.configSchema.safeParse(provided)
    if (!parsedConfig.success) throw new Error('Could not extract config')

    this._config = parsedConfig.data
  }

  /** Extracts and validates the answer from the provided data. */
  protected extractAnswer = (provided: any): void => {
    if (!this.answerSchema) throw new Error('Not implemented')

    const parsedAnswer = this.answerSchema.safeParse(provided)
    if (!parsedAnswer.success) throw new Error('Could not extract answer')

    this._answer = parsedAnswer.data
  }

  /** Initializes the response area with default values. */
  initWithDefault = (): void => {}

  /**
   * Initializes the response area with a given response.
   * @param response - The modular response schema object.
   */
  initWithResponse = (response: IModularResponseSchema): void => {
    this.extractConfig(response.config)
    this.extractAnswer(response.answer)
  }

  /**
   * Initializes the response area using a student fragment.
   * @param studentFragment - The student modular response fragment.
   */
  initWithStudentFragment = (
    studentFragment: StudentModularResponseFragment,
  ): void => {
    this.extractConfig(studentFragment.config)
  }

  /**
   * Initializes the response area using a teacher fragment.
   * @param teacherFragment - The teacher modular response fragment.
   */
  initWithTeacherFragment = (
    teacherFragment: TeacherModularResponseFragment,
  ): void => {
    this.extractConfig(teacherFragment.config)
    this.extractAnswer(teacherFragment.answer)
  }

  /**
   * Sets the answer for the response area.
   * @param answer - The answer schema.
   */
  setAnswer = (answer?: IResponseAreaAnswerSchema) => {
    this.extractAnswer(answer)
  }

  /** Converts the response area into a student fragment. */
  toStudentFragment = (): StudentModularResponseFragment => {
    if (!this.responseType) throw new Error('Response type missing')

    return {
      __typename: 'StudentModularResponse',
      responseType: this.responseType,
      config: this.config,
    }
  }

  /** Converts the response area into a teacher fragment. */
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

  /** Converts the response area into a modular response schema. */
  toResponse = (): IModularResponseSchema => {
    if (!this.responseType) throw new Error('Response type missing')
    if (this.answer === undefined) throw new Error('Answer missing')

    return {
      responseType: this.responseType,
      config: this.config,
      answer: this.answer,
    }
  }

  /** Converts the response area into a response mutation input for a teacher. */
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

  /** Component for rendering the response area input. */
  InputComponent: React.FC<BaseResponseAreaProps> = props => {
    throw new Error('Not implemented')
  }

  /** Component for rendering the response area wizard. */
  WizardComponent: React.FC<BaseResponseAreaWizardProps> = props => {
    throw new Error('Not implemented')
  }
}

export function initialiseTub(
  tub: ResponseAreaTub,
  response: Record<string, unknown> | undefined,
  displayMode: 'normal' | 'peek',
) {
  if (response === undefined || displayMode === 'peek') {
    tub.initWithDefault()
  } else if (
    '__typename' in response &&
    response.__typename === 'TeacherModularResponse'
  ) {
    tub.initWithTeacherFragment(response as TeacherModularResponseFragment)
  } else if (
    '__typename' in response &&
    response.__typename === 'StudentModularResponse'
  ) {
    tub.initWithStudentFragment(response as StudentModularResponseFragment)
  } else {
    tub.initWithResponse(response as IModularResponseSchema)
  }
}
