import type { FormFieldDefinition } from '../types'

export interface FormBuilderState {
  fields: FormFieldDefinition[]
  formName: string
  formDescription: string
  version: number
  selectedFieldId: string | null
  dragOverIndex: number | null
  isPreviewMode: boolean
}

export type FormBuilderAction =
  | { type: 'SET_FIELDS'; fields: FormFieldDefinition[] }
  | { type: 'SET_NAME'; name: string }
  | { type: 'SET_DESCRIPTION'; description: string }
  | { type: 'SET_VERSION'; version: number }
  | { type: 'SELECT_FIELD'; fieldId: string | null }
  | { type: 'ADD_FIELD'; field: FormFieldDefinition; atIndex?: number }
  | { type: 'REMOVE_FIELD'; fieldId: string }
  | { type: 'UPDATE_FIELD'; field: FormFieldDefinition }
  | { type: 'SET_DRAG_OVER'; index: number | null }
  | { type: 'DRAG_END' }
  | { type: 'TOGGLE_PREVIEW'; on: boolean }
  | { type: 'CHANGE_PROPERTY'; fieldId: string; propertyKey: string; value: unknown } 