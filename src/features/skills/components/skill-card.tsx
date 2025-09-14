import {UserInfo} from "@/components/shared/user-info";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Prisma} from "@prisma/client";
import {DollarSign} from "lucide-react";
import {CgArrowsExchange, CgDollar} from "react-icons/cg";
import {FiEdit2, FiTrash2} from "react-icons/fi";

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
	onEdit?: (skill: SkillWithRelations) => void;
	onDelete?: (id: string) => void;
}

export const SkillCard = ({skill, onEdit, onDelete}: SkillCardProps) => {
	return (
		<Card className="w-full md:w-[400px] border shadow-sm hover:shadow-md transition-shadow">
			<CardHeader className="flex flex-col gap-2 text-2xl">
				<div className='flex itcems-center gap-2'>
					{
						skill.Category && (
							<Badge>
								{skill.Category.name}
							</Badge>
						)
						
					}
					<Tooltip>
						<TooltipTrigger>
							<Badge variant='outline'>
								{skill.paymentType === 'MONEY' && (
									<>
										<TooltipContent>
											For Money
										</TooltipContent>
										<DollarSign/>
									</>
								)}
								{skill.paymentType === 'BOTH' && (
									<>
										<TooltipContent>
											For Barter and Money
										</TooltipContent>
										<CgArrowsExchange className='!size-5'/>
										/
										<CgDollar className='!size-5'/>
									</>
								)}
								{skill.paymentType === 'MONEY' && (
									<>
										<TooltipContent>
											Barter
										</TooltipContent>
										<DollarSign/>
									</>
								)}
							</Badge>
						</TooltipTrigger>
					</Tooltip>
				</div>
				<CardTitle>
					{skill.title}
				</CardTitle>
				<CardDescription>
					{skill.description || 'No description provided.'}
				</CardDescription>
			</CardHeader>
			<Separator/>
			<CardContent className="pt-4">
				<UserInfo name={skill.owner.name}/>
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
						onClick={() => onDelete?.(skill.id)}
						title="Delete"
					>
						<FiTrash2 className="w-4 h-4 text-red-500"/>
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
};
