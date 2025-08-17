import {getCategories} from "@/features/categories/actions";
import {CreateSkillForm} from "@/features/skills/components/create-skill-form";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";

const CreateSkillPage = async () => {
	
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ['categories'],
		queryFn: getCategories,
	})
	
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className='flex items-center justify-center flex-1'>
				<CreateSkillForm/>
			</div>
		</HydrationBoundary>
	)
}
export default CreateSkillPage
