import {useMutation} from '@tanstack/react-query'
import {createSkill, updateSkill} from './actions'
import {CreateSkillFormSchema, UpdateSkillSchema} from './schemas'

export function useCreateSkillMutation() {
	return useMutation({
		mutationFn: async (values: CreateSkillFormSchema) => {
			return await createSkill(values)
		}
	})
}

export const useUpdateSkillMutation = () => {
	return useMutation({
		mutationFn: async ({values, id}: { values: UpdateSkillSchema; id: string }) => {
			return await updateSkill(id, values)
		}
	})
}