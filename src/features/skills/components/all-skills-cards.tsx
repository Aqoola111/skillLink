'use client'

import {getInfiniteSkills} from "@/features/skills/actions";
import {SkillsContainer} from "@/features/skills/components/skills-container";
import {useInfiniteQuery} from "@tanstack/react-query";

const AllSkillsCards = () => {
	
	const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery({
		queryKey: ["skills"],
		queryFn: ({pageParam}) => getInfiniteSkills(pageParam),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage) => lastPage.nextCursor
	})
	
	
	return (
		<SkillsContainer>
			SKILLS
		</SkillsContainer>
	)
}
export default AllSkillsCards
