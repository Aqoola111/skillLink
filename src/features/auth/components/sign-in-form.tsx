'use client'

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {signInAction} from "@/features/auth/actions";
import {SignInDefaultValues, SignInSchema, signInSchema} from "@/features/auth/schemas";
import {getErrorMessage} from "@/lib/utils";
import {zodResolver} from "@hookform/resolvers/zod";
import {isRedirectError} from "next/dist/client/components/redirect-error";
import Link from "next/link";
import {SubmitHandler, useForm} from "react-hook-form";
import {toast} from "sonner";

const SignInForm = () => {
	
	const form = useForm<SignInSchema>({
		resolver: zodResolver(signInSchema),
		defaultValues: SignInDefaultValues
	})
	
	const onSubmit: SubmitHandler<SignInSchema> = async (data) => {
		try {
			await signInAction(data)
		} catch (e) {
			if (isRedirectError(e)) return
			toast.error(getErrorMessage(e))
		}
	}
	
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Card className='w-full md:w-[400px]'>
					<CardHeader>
						<CardTitle>
							Sign In
						</CardTitle>
						<CardDescription>
							Access your account to continue.
						</CardDescription>
					</CardHeader>
					<CardContent className='grid gap-4'>
						<FormField control={form.control} name={'email'} render={({field}) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<Input placeholder='Example@gmail.com' {...field} />
								<FormMessage/>
							</FormItem>
						)}/>
						<FormField control={form.control} name={'password'} render={({field}) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<Input placeholder='Password' type="password" {...field} />
								<FormMessage/>
							</FormItem>
						)}/>
					</CardContent>
					<CardFooter className='flex flex-col gap-8'>
						<Button className='w-full' type={'submit'}>
							Sign In
						</Button>
						<Separator/>
						<div className='flex gap-2 justify-center items-center w-full'>
							Dont have an account?
							<Button variant='link' size='sm'>
								<Link href={'/auth/sign-up'}>
									Sign Up
								</Link>
							</Button>
						</div>
					</CardFooter>
				</Card>
			</form>
		</Form>
	)
}

export default SignInForm
