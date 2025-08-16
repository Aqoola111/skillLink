'use server'

import {auth} from "@/auth";
import {createSkillFormSchema, CreateSkillFormSchema} from "@/features/skills/schemas";
import {prisma} from "@/lib/prisma"
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

export const getSkillByOwnerId = async (id: string, includeOwner: boolean) => {
	return prisma.skill.findMany({
		where: {ownerId: id},
		include: includeOwner ? {owner: true} : undefined,
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
			paymentType: data.paymentType,
			ownerId: userExists.id
		}
	})
	
	if (!skill) {
		throw new Error("Failed to create skill")
	}
	
	
	return skill;
}

