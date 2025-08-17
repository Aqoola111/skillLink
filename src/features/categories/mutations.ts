import {getCategories} from "@/features/categories/actions";
import {useMutation} from "@tanstack/react-query";

export const useGetCategories = () => {
	return useMutation({
		mutationFn: async () => {
			return getCategories()
		}
	})
}

