'use server'

import {auth} from "@/auth";
import {
	createSkillFormSchema,
	CreateSkillFormSchema,
	updateSkillSchema,
	UpdateSkillSchema
} from "@/features/skills/schemas";
import {prisma} from "@/lib/prisma"
import {Prisma} from "@prisma/client";
import {SubmitHandler} from "react-hook-form";

export const getSkills = async () => {
	return prisma.skill.findMany()
}

export const getInfiniteSkills = async (cursor?: string) => {
	const take = 10
	
	const skills = await prisma.skill.findMany({
		take,
		skip: cursor ? 1 : 0,
		cursor: cursor ? {id: cursor} : undefined,
		orderBy: {createdAt: "desc"},
		include: {owner: true},
	})
	
	return {
		skills,
		nextCursor: skills.length === take ? skills[skills.length - 1].id : null,
	}
}

export const getSkillByOwnerId = async (id: string) => {
	return prisma.skill.findMany({
		where: {ownerId: id},
		include: {
			owner: {select: {id: true, name: true, image: true}},
			Category: {select: {id: true, name: true}},
			tags: {select: {id: true, name: true}},
			_count: {select: {reviews: true, bookings: true, tags: true}},
		},
	});
}


export const createSkill: SubmitHandler<CreateSkillFormSchema> = async (data) => {
	const validatedData = createSkillFormSchema.parse(data);
	const session = await auth()
	
	if (!session?.user) {
		throw new Error("You must be signed in to create a skill")
	}
	
	const userExists = await prisma.user.findUnique({
		where: {id: session.user.id}
	})
	
	if (!userExists) {
		throw new Error("User does not exist")
	}
	
	const skill = await prisma.skill.create({
		data: {
			title: data.title,
			description: data.description,
			price: data.price ?? null,
			categoryId: data.categoryId ?? null,
			tags: {
				connect: data.tagIds.map(tag => ({id: tag.id}))
			},
			icon: data.icon ?? null,
			paymentType: data.paymentType,
			ownerId: userExists.id
		}
	})
	
	if (!skill) {
		throw new Error("Failed to create skill")
	}
	
	
	return skill;
}

export const deleteSkill = async (id: string) => {
	
	const user = await auth()
	if (!user?.user) {
		throw new Error("You must be signed in to delete a skill")
	}
	
	try {
		return await prisma.skill.delete({
			where: {id, ownerId: user.user.id}
		});
	} catch (error) {
		throw new Error("Failed to delete skill" + (error as Error).message)
	}
}

export const updateSkill = async (id: string, data: UpdateSkillSchema) => {
	const user = await auth()
	if (!user?.user) {
		throw new Error("You must be signed in to update a skill")
	}
	const validatedData = updateSkillSchema.parse(data);
	
	const existingSkill = await prisma.skill.findUnique({
		where: {id}
	})
	
	if (!existingSkill) {
		throw new Error("Skill not found")
	}
	
	if (existingSkill.ownerId !== user.user.id) {
		throw new Error("You do not have permission to update this skill")
	}
	
	const patch: Prisma.SkillUpdateInput = {
		...(data.title !== undefined && {title: validatedData.title}),
		...(data.description !== undefined && {description: validatedData.description}),
		...(data.paymentType !== undefined && {paymentType: validatedData.paymentType}),
		...(data.icon !== undefined && {icon: validatedData.icon}),
		...(data.price !== undefined && {price: validatedData.price}),
		
		...(data.categoryId !== undefined &&
			(data.categoryId === null
				? {Category: {disconnect: true}}
				: {Category: {connect: {id: data.categoryId}}})
		),
		
		...(data.tagIds !== undefined && {
			tags: {set: validatedData.tagIds.map(({id}) => ({id}))},
		}),
		...(data.allowedCategories !== undefined && {
			allowedCategories: {
				deleteMany: {},
				create: data.allowedCategories.map(({id}) => ({
					category: {connect: {id}},
				})),
			},
		})
	};
	
	
	try {
		return await prisma.skill.update({where: {id}, data: patch});
	} catch (error) {
		throw new Error("Failed to update skill" + (error as Error).message)
	}
}

