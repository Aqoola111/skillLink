import {useMutation} from '@tanstack/react-query'
import {createSkill} from './actions'
import {CreateSkillFormSchema} from './schemas'

export function useCreateSkillMutation() {
	return useMutation({
		mutationFn: async (values: CreateSkillFormSchema) => {
			console.log(typeof values.price)
			return await createSkill(values)
		}
	})
}