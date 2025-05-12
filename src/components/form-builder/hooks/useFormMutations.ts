import { trpc } from '@/trpc/client'
import { useCallback } from 'react'
import { mapToInputSchema } from '@/utils/fieldMapper'

interface FormMutationPayload {
  id?: string
  name: string
  description: string
  version?: number
  fields: ReturnType<typeof mapToInputSchema>[]
}

export function useFormMutations() {
  const create = trpc.form.create.useMutation({
    onSuccess: (data: { id: string; version?: number }) => {
      alert('Form created successfully! (Simulated)')
      console.log('Created form with ID:', data.id)
    },
    onError: (error: { message: string }) => {
      console.error('Error creating form (Simulated):', error)
      alert(`Error creating form: ${error.message}.`)
    },
  })

  const update = trpc.form.update.useMutation({
    onSuccess: () => {
      alert('Form structure saved successfully! (Simulated)')
    },
    onError: (error: { message: string }) => {
      console.error('Error saving form structure (Simulated):', error)
      alert(`Error saving form structure: ${error.message}.`)
    },
  })

  const save = useCallback(
    (payload: FormMutationPayload) => {
      if (payload.id && payload.version) {
        return update.mutate({ ...payload, id: payload.id, version: payload.version })
      }
      return create.mutate(payload)
    },
    [create, update]
  )

  return { create, update, save }
} 