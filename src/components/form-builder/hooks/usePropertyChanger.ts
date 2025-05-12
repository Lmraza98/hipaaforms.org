// hooks/usePropertyChanger.ts
import { useCallback } from 'react'
import { useFormBuilderContext } from '../components/context'
import type { FormFieldDefinition } from '../types'

/**
 * Returns a callback (key, value) that will:
 *  1) select the passed-in fieldDef
 *  2) apply the property change to it
 * 
 * This ensures that property changes are always applied to the correct field,
 * even in cases where multiple fields might be modified in quick succession.
 */
export function usePropertyChanger<T extends FormFieldDefinition>(fieldDef: T) {
  const { setSelectedFieldDef, handlePropertyChange } = useFormBuilderContext()

  return useCallback(
    <K extends keyof T>(propertyKey: K, value: T[K]) => {
      // 1) make sure this field is the "active" one
      setSelectedFieldDef(fieldDef)
      // 2) then apply your change
      handlePropertyChange(propertyKey as string, value)
    },
    [fieldDef, setSelectedFieldDef, handlePropertyChange]
  )
}
