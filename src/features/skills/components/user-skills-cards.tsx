'use client'
import {getSkillByOwnerId} from "@/features/skills/actions";
import {SkillCard} from "@/features/skills/components/skill-card";
import {SkillsContainer} from "@/features/skills/components/skills-container";
import {useQuery} from "@tanstack/react-query";
import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";

export const UserSkillsCards = () => {
	const {data: session, status} = useSession();
	
	if (status !== 'authenticated' || !session?.user) {
		redirect('/skills')
	}
	
	const data = useQuery({
		queryKey: ['skills', session.user.id],
		queryFn: () => getSkillByOwnerId(session.user.id, true),
		enabled: !!session?.user.id,
	})
	
	return (
		<SkillsContainer>
			{data.data?.map((item) => (
				<SkillCard skill={item} key={item.id}/>
			))}
		</SkillsContainer>
	)
};