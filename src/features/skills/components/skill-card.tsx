import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {Prisma, Skill} from "@prisma/client";
import {FiEdit2, FiStar, FiTrash2} from "react-icons/fi";

export const skillCardInclude = Prisma.validator<Prisma.SkillInclude>()({
	owner: {
		select: {id: true, name: true, image: true},
	},
	Category: {
		select: {id: true, name: true},
	},
	tags: {
		select: {id: true, name: true},
	},
	_count: {
		select: {reviews: true, bookings: true, tags: true},
	},
});

export type SkillWithRelations = Prisma.SkillGetPayload<{
	include: typeof skillCardInclude;
}>;


interface SkillCardProps {
	skill: SkillWithRelations;
	onEdit?: (skill: Skill) => void;
	onDelete?: (skill: Skill) => void;
}

export const SkillCard = ({skill, onEdit, onDelete}: SkillCardProps) => {
	return (
		<Card className="w-full md:w-[400px] border shadow-sm hover:shadow-md transition-shadow">
			<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
				{
					skill.Category && (
						<Badge>
							{skill.Category.name}
						</Badge>
					)
				}
			</CardHeader>
			<Separator/>
			<CardContent className="pt-4">
				{
					skill.owner ? (
						<div className="text-sm text-muted-foreground flex gap-2">
							<span className="font-semibold">{skill.owner.name}</span>
							<div className='flex items-center'>
								{Array.from({length: 10}).map((_, index) => (
									<FiStar className='text-primary' key={index}/>
								))}
							</div>
						</div>
					) : (
						<div className="text-sm text-muted-foreground">
							<span>Owner information not available</span>
						</div>
					)
				}
			</CardContent>
			<CardFooter className='w-full'>
				<div className="flex gap-1">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => onEdit?.(skill)}
						title="Edit"
					>
						<FiEdit2 className="w-4 h-4"/>
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => onDelete?.(skill)}
						title="Delete"
					>
						<FiTrash2 className="w-4 h-4 text-red-500"/>
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
};
