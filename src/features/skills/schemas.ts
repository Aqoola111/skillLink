import {PaymentType} from "@prisma/client";
import {z} from "zod";


export const skillSchema = z.object({
	id: z.string(),
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	price: z.number().positive().nullable(),
	paymentType: z.enum(PaymentType),
	ownerId: z.string(),
	createdAt: z.date().default(() => new Date()),
	updatedAt: z.date().default(() => new Date())
});

export const MAX_TAGS = 3;

export const createSkillFormSchema = z.object({
	title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
	description: z.string().min(1, "Description is required").max(256, "Description must be 256 characters or less"),
	paymentType: z.enum(PaymentType),
	icon: z.string().nullable().optional(),
	price: z.number().positive().nullable(),
	categoryId: z.string().nullable().optional(),
	tagIds: z.array(z.object({id: z.string()})).max(MAX_TAGS, `You can select up to ${MAX_TAGS} tags`),
})
	.superRefine((data, ctx) => {
		// This validation logic correctly checks for price based on paymentType
		if (data.paymentType === "MONEY" || data.paymentType === "BOTH") {
			if (data.price == null || data.price <= 0) {
				ctx.addIssue({
					path: ["price"],
					code: "custom",
					message: "Price is required and must be positive for this payment type.",
				});
			}
		}
		// This check is also correct, ensuring price is not set for BARTER
		if (data.paymentType === "BARTER" && data.price != null) {
			ctx.addIssue({
				path: ["price"],
				code: "custom",
				message: "Price should not be set for BARTER payment type.",
			});
		}
	});

export type CreateSkillFormSchema = z.infer<typeof createSkillFormSchema>; // для useForm

export const createSkillDefaultValues: CreateSkillFormSchema = {
	description: '',
	paymentType: PaymentType.BARTER,
	price: 0,
	title: '',
	tagIds: [],
	icon: '',
	categoryId: null
}

export const updateSkillSchema = skillSchema.omit({
	updatedAt: true,
	createdAt: true,
})

export type UpdateSkillSchema = z.infer<typeof updateSkillSchema>;