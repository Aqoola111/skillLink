import {z} from "zod";

export const signInSchema = z.object({
	email: z.email("Invalid email address"),
	password: z.string()
})


export const signUpSchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(50, "Name must be at most 50 characters"),
	
	email: z
		.email("Invalid email address"),
	
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.regex(/[a-z]/, "Password must contain at least one lowercase letter")
		.regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
	
	confirmPassword: z.string(),
	
})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	})

export const SignUpDefaultValues: SignUpSchema = {
	password: "",
	confirmPassword: "",
	name: "",
	email: "",
}

export const SignInDefaultValues: SignInSchema = {
	email: "",
	password: "",
}

export type SignUpSchema = z.infer<typeof signUpSchema>
export type SignInSchema = z.infer<typeof signInSchema>