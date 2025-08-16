import {auth} from "@/auth";
import {getSkillByOwnerId} from "@/features/skills/actions";
import {SkillsCardsSkeleton} from "@/features/skills/components/skills-cards-skeleton";
import {UserSkillsCards} from "@/features/skills/components/user-skills-cards";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {redirect} from "next/navigation";
import {Suspense} from "react";

const Page = async () => {
	const queryClient = new QueryClient();
	const session = await auth();
	
	if (!session?.user) {
		redirect('/skills')
	}
	
	await queryClient.prefetchQuery({
		queryKey: ['skills', session.user.id],
		queryFn: () => getSkillByOwnerId(session.user.id, true),
	})
	
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense fallback={<SkillsCardsSkeleton/>}>
				<UserSkillsCards/>
			</Suspense>
		</HydrationBoundary>
	)
}
export default Page
