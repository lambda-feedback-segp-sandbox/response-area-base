import {
  StandardSubmissionFragment,
  Scalars,
} from '@lambda-feedback/graphql-api/api/graphql'

import {
  IModularResponseSchema,
  IResponseAreaAnswerSchema,
} from '../schemas/question-form.schema'

/**
 * Represents a subset of feedback properties from StandardSubmissionFragment.
 */
export type PickedFeedback = Pick<
  StandardSubmissionFragment,
  'isCorrect' | 'isError' | 'feedback' | 'matchedCase'
> | null

/**
 * Defines the properties required for a response area component.
 */
export interface BaseResponseAreaProps {
  /** Function to handle response submission. */
  handleSubmit?: () => void

  /** Function to handle draft save functionality. */
  handleDraftSave?: () => void

  /** Configuration object for the response area. */
  config?: object

  /** The answer provided in the response area. */
  answer?: IModularResponseSchema['answer']

  /** The mode in which the response area is displayed. */
  displayMode?: 'normal' | 'peek'

  /**
   * Handles changes in the response.
   * @param val - The new answer value.
   * @param additionalParams - Optional additional parameters.
   */
  handleChange: (
    val: IModularResponseSchema['answer'],
    additionalParams?: Record<string, any>,
  ) => void

  /**
   * Handles submission preview.
   * @param submission - The JSON submission object.
   * @param additionalParams - Optional additional parameters.
   */
  previewSubmit?: (
    submission: Scalars['JSON'],
    additionalParams?: Record<string, any>,
  ) => void

  /** Unique identifier for the response area. */
  responseAreaId?: string

  /** Universal identifier for the response area. */
  universalResponseAreaId?: string

  /** Indicates if preview functionality is available. */
  hasPreview?: boolean

  /** Indicates if the response area is in teacher mode. */
  isTeacherMode?: boolean

  /** Text displayed before the response area. */
  preResponseText?: string | null

  /** Text displayed after the response area. */
  postResponseText?: string | null

  /** Indicates if the check operation is loading. */
  checkIsLoading?: boolean

  /** Feedback information for the response area. */
  feedback?: PickedFeedback

  /** A typesafe error message if any errors occur. */
  typesafeErrorMessage?: string
}

/**
 * Defines the properties required for the response area wizard component.
 */
export interface BaseResponseAreaWizardProps {
  /**
   * Handles changes in the wizard response area.
   * @param val - The new response schema value.
   */
  handleChange: (val: IModularResponseSchema) => void

  /** Function to set whether saving is allowed. */
  setAllowSave: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * Extends BaseResponseAreaWizardProps to include additional configuration and answer details.
 */
export interface FullResponseAreaWizardProps
  extends BaseResponseAreaWizardProps {
  /** Configuration object for the wizard response area. */
  config: object

  /** The answer schema for the wizard response area. */
  answer: IResponseAreaAnswerSchema
}
