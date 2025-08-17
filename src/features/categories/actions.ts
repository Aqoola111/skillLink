'use server'
import {prisma} from "@/lib/prisma";

export const getCategories = async () => {
	return prisma.category.findMany({
		orderBy: {createdAt: "desc"},
		include: {
			tags: true
		}
	});
}