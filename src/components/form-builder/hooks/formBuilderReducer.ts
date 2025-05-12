import { FormBuilderState, FormBuilderAction } from './formBuilderState'
import type { FormFieldDefinition } from '../types'

export const initialState = (props: {
  initialFields?: FormFieldDefinition[]
  initialName: string
  initialDescription: string
  initialVersion: number
}): FormBuilderState => ({
  fields: props.initialFields || [],
  formName: props.initialName,
  formDescription: props.initialDescription,
  version: props.initialVersion,
  selectedFieldId: null,
  dragOverIndex: null,
  isPreviewMode: false,
})

export function formBuilderReducer(
  state: FormBuilderState,
  action: FormBuilderAction
): FormBuilderState {
  switch (action.type) {
    case 'SET_FIELDS':
      return { ...state, fields: action.fields }
    case 'SET_NAME':
      return { ...state, formName: action.name }
    case 'SET_DESCRIPTION':
      return { ...state, formDescription: action.description }
    case 'SET_VERSION':
      return { ...state, version: action.version }
    case 'SELECT_FIELD':
      return { ...state, selectedFieldId: action.fieldId }
    case 'ADD_FIELD': {
      const target = action.atIndex ?? state.fields.length
      return {
        ...state,
        fields: [
          ...state.fields.slice(0, target),
          action.field,
          ...state.fields.slice(target),
        ],
      }
    }
    case 'REMOVE_FIELD':
      return {
        ...state,
        fields: state.fields.filter(f => f.id !== action.fieldId),
        selectedFieldId:
          state.selectedFieldId === action.fieldId ? null : state.selectedFieldId,
      }
    case 'UPDATE_FIELD':
      return {
        ...state,
        fields: state.fields.map(f =>
          f.id === action.field.id ? action.field : f
        ),
        selectedFieldId: action.field.id,
      }
    case 'CHANGE_PROPERTY':
      return {
        ...state,
        fields: state.fields.map(f =>
          f.id === action.fieldId
            ? { ...f, [action.propertyKey]: action.value }
            : f
        ),
      }
    case 'SET_DRAG_OVER':
      return { ...state, dragOverIndex: action.index }
    case 'DRAG_END':
      return { ...state, dragOverIndex: null }
    case 'TOGGLE_PREVIEW':
      return { ...state, isPreviewMode: action.on }
    default:
      return state
  }
} 