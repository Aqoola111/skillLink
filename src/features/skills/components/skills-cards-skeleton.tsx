import {Skeleton} from "@/components/ui/skeleton";
import {SkillsContainer} from "@/features/skills/components/skills-container";

export const SkillsCardsSkeleton = () => {
	return (
		<SkillsContainer>
			{Array.from({length: 10}).map((_, index) => (
				<Skeleton key={index} className="w-[240px] h-[240px]"/>
			))}
		</SkillsContainer>
	)
};