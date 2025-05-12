import { getDefaultFieldDefinition } from '../fields'
import type { FormFieldDefinition } from '../types'
import { mapToInputSchema } from '@/utils/fieldMapper'

let fieldIdCounter = 1

/**
 * Creates a new form field with a unique ID and default properties
 * @param type - The type of field to create (e.g. 'ShortText', 'Email', etc.)
 * @param label - Optional label for the field. If not provided, will use a default based on the type
 * @returns A new FormFieldDefinition with default properties and a unique ID
 */
export function makeNewField(
  type: FormFieldDefinition['type'],
  label?: string
): FormFieldDefinition {
  const id = `${type.toLowerCase().replace(/\s+/g, '_')}_new_${fieldIdCounter++}`
  return getDefaultFieldDefinition(type, id, label || `${type} Field`)
}

/**
 * Maps form field definitions to the server-side schema format
 * @param fields - Array of form field definitions to convert
 * @returns Array of fields in the server-side schema format
 */
export function mapFieldsForServer(fields: FormFieldDefinition[]) {
  return fields.map((field, index) => mapToInputSchema(field, index))
}

/**
 * Calculates the index where a dragged field should be dropped in the form
 * @param event - The drag event containing mouse position information
 * @param container - The container element containing the field items
 * @param count - The total number of fields in the form
 * @returns A number between 0 and count (inclusive) representing where the field should be dropped
 *          0 means before the first field, count means after the last field
 */
export function calculateDropIndex(
  event: React.DragEvent<Element>,
  container: HTMLDivElement | null,
  count: number
): number {
  if (!container) return count

  const fieldItems = Array.from(container.querySelectorAll('.field-item')) as HTMLElement[]
  const mouseY = event.clientY

  if (fieldItems.length === 0) return 0

  for (let i = 0; i < fieldItems.length; i++) {
    const item = fieldItems[i]
    const rect = item.getBoundingClientRect()
    const itemMiddle = rect.top + rect.height / 2

    if (i === 0 && mouseY < itemMiddle) return 0

    if (mouseY > itemMiddle) {
      if (i === fieldItems.length - 1 || 
          mouseY < fieldItems[i + 1].getBoundingClientRect().top + fieldItems[i + 1].getBoundingClientRect().height / 2) {
        return i
      }
    }
  }

  return count
} 