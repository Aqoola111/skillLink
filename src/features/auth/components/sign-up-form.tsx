'use client'

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {signUp} from "@/features/auth/actions";
import {SignUpDefaultValues, signUpSchema, SignUpSchema} from "@/features/auth/schemas";
import {getErrorMessage} from "@/lib/utils";
import {zodResolver} from "@hookform/resolvers/zod";
import {Eye} from "lucide-react";
import {isRedirectError} from "next/dist/client/components/redirect-error";
import Link from "next/link";
import {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {toast} from "sonner";

const SignUpForm = () => {
	const [hidden, setHidden] = useState(true);
	const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(true);
	
	const form = useForm<SignUpSchema>({
		resolver: zodResolver(signUpSchema),
		defaultValues: SignUpDefaultValues,
		mode: "onSubmit"
	})
	
	const onSubmit: SubmitHandler<SignUpSchema> = async (data) => {
		try {
			await signUp(data)
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
						<CardTitle>Sign Up</CardTitle>
						<CardDescription>Create a new account to get started.</CardDescription>
					</CardHeader>
					<CardContent className='grid grid-cols-2 gap-4'>
						<FormField
							control={form.control}
							name="name"
							render={({field}) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<Input {...field} placeholder='John Doe'/>
									<FormMessage/>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({field}) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<Input {...field} placeholder='example@gmail.com'/>
									<FormMessage/>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({field}) => (
								<FormItem className='col-span-2'>
									<FormLabel>Password</FormLabel>
									<div className='flex relative items-center'>
										<Input {...field} type={hidden ? 'password' : 'text'}
											   placeholder='Password'/>
										<Button type='button' onClick={() => setHidden(!hidden)} variant='ghost'
												size={"icon"}>
											<Eye className='absolute right-1.5'/>
										</Button>
									</div>
									<FormMessage/>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({field}) => (
								<FormItem className='col-span-2'>
									<FormLabel>Confirm Password</FormLabel>
									<div className='flex relative items-center'>
										<Input {...field} type={confirmPasswordHidden ? 'password' : 'text'}
											   placeholder='Confirm password'/>
										<Button type='button'
												onClick={() => setConfirmPasswordHidden(!confirmPasswordHidden)}
												variant='ghost' size={"icon"}>
											<Eye className='absolute right-1.5'/>
										</Button>
									</div>
									<FormMessage/>
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter className='flex flex-col gap-8'>
						<Button className='w-full' type='submit'>Sign Up</Button>
						<Separator/>
						<div className='flex gap-2 justify-center items-center w-full'>
							Already have an account?
							<Button variant='link' size='sm' asChild>
								<Link href='/auth/sign-in'>Sign In</Link>
							</Button>
						</div>
					</CardFooter>
				</Card>
			</form>
		</Form>
	)
}
export default SignUpForm
