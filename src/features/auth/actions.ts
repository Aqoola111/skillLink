'use server'

import {signIn, signOut} from "@/auth";
import {signInSchema, SignInSchema, SignUpSchema, signUpSchema} from "@/features/auth/schemas";
import {REDIRECT_AFTER_LOGIN} from "@/lib/constants";
import {prisma} from "@/lib/prisma";
import {hashPassword} from "@/lib/utils";
import {Role} from "@prisma/client";

export const signUp = async (data: SignUpSchema) => {
	const validatedData = signUpSchema.parse(data);
	
	if (await prisma.user.findUnique({where: {email: validatedData.email}})) {
		throw new Error("Email already exists");
	}
	
	const hashedPassword = await hashPassword(validatedData.password)
	
	const user = await prisma.user.create({
		data: {
			name: validatedData.name,
			email: validatedData.email,
			password: hashedPassword,
			role: Role.USER
		}
	})
	
	if (!user) {
		throw new Error("Failed to create user");
	}
	
	await signIn('credentials', {
		email: validatedData.email,
		password: validatedData.password,
		redirect: true,
		redirectTo: REDIRECT_AFTER_LOGIN
	})
	
}

export const signInAction = async (data: SignInSchema) => {
	const validatedData = signInSchema.parse(data);
	
	await signIn('credentials', {
		email: validatedData.email,
		password: validatedData.password,
		redirect: true,
		redirectTo: REDIRECT_AFTER_LOGIN
	})
}

export const signOutAction = async () => {
	await signOut()
}