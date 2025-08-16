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

export const createSkillFormSchema = z.object({
		title: z.string().min(1, "Title is required"),
		description: z.string().min(1, "Description is required"),
		price: z.number(), // строка или null
		paymentType: z.enum(PaymentType),
		ownerId: z.string()
	}).superRefine((data, ctx) => {
		if (data.paymentType === 'MONEY' || data.paymentType === 'BOTH') {
			if (data.price !== undefined && data.price <= 0) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Price must be greater than 0 when payment type is BARTER or BOTH",
				})
			}
		}
	})
;

// Схема для сервера (число | null)
export const createSkillSchema = createSkillFormSchema
	.extend({
		price: z
			.string()
			.nullable()
			.transform((val) => {
				if (!val) return null;
				const parsed = parseFloat(val);
				return isNaN(parsed) ? null : parsed;
			})
	})
	.refine(
		(data) =>
			!(
				data.paymentType === PaymentType.MONEY ||
				data.paymentType === PaymentType.BOTH
			) || (data.price !== null && data.price > 0),
		{
			message: "Price must be greater than 0 when payment type is MONEY or BOTH",
			path: ["price"]
		}
	);

export type CreateSkillFormSchema = z.infer<typeof createSkillFormSchema>; // для useForm

export const createSkillDefaultValues: CreateSkillFormSchema = {
	description: '',
	ownerId: '',
	paymentType: PaymentType.BARTER,
	price: 0,
	title: ''
}

export const updateSkillSchema = skillSchema.omit({
	updatedAt: true,
	createdAt: true,
})


export type CreateSkillSchema = z.infer<typeof createSkillSchema>;
export type UpdateSkillSchema = z.infer<typeof updateSkillSchema>;