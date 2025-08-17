import {useMutation} from '@tanstack/react-query'
import {createSkill} from './actions'
import {CreateSkillFormSchema} from './schemas'

export function useCreateSkillMutation() {
	return useMutation({
		mutationFn: async (values: CreateSkillFormSchema) => {
			return await createSkill(values)
		}
	})
}