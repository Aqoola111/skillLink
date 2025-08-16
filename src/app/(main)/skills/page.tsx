import {getInfiniteSkills} from "@/features/skills/actions";
import AllSkillsCards from "@/features/skills/components/all-skills-cards";
import {SkillsCardsSkeleton} from "@/features/skills/components/skills-cards-skeleton";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {Suspense} from "react";

const SkillsPage = async () => {
	const queryClient = new QueryClient();
	await queryClient.prefetchInfiniteQuery({
		queryKey: ["skills"],
		queryFn: ({pageParam}) => getInfiniteSkills(pageParam),
		initialPageParam: undefined,
	})
	
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense fallback={<SkillsCardsSkeleton/>}>
				<AllSkillsCards/>
			</Suspense>
		</HydrationBoundary>
	)
}
export default SkillsPage
