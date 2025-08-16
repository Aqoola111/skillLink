'use client'

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Separator} from "@/components/ui/separator";
import {Textarea} from "@/components/ui/textarea";
import {useCreateSkillMutation} from "@/features/skills/mutations";
import {createSkillDefaultValues, createSkillFormSchema, CreateSkillFormSchema} from "@/features/skills/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {PaymentType} from "@prisma/client";
import {useQueryClient} from "@tanstack/react-query";
import {useSession} from "next-auth/react";
import {SubmitHandler, useForm} from "react-hook-form";
import {toast} from "sonner";

export const CreateSkillForm = () => {
	
	const createSkillMutation = useCreateSkillMutation()
	const queryClient = useQueryClient()
	const {data: session, status} = useSession();
	
	const form = useForm<CreateSkillFormSchema>({
		resolver: zodResolver(createSkillFormSchema),
		defaultValues: createSkillDefaultValues
	});
	
	const paymentTypeValue = form.watch("paymentType");
	
	const onSubmit: SubmitHandler<CreateSkillFormSchema> = async (data) => {
		createSkillMutation.mutate(data, {
			onSuccess: () => {
				toast.success(`Created ${data.title} skill successfully`)
				queryClient.invalidateQueries({queryKey: ['skills', data.ownerId]})
			},
			onError: (error) => {
				if (error instanceof Error) {
					toast.error(error.message)
				} else {
					toast.error("Something went wrong")
				}
			}
		})
		
	};
	
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Card className="w-full md:w-[500px]">
					<Separator/>
					<CardHeader>
						<CardTitle>Share your skill</CardTitle>
						<CardDescription>
							Add a new skill to your profile.
						</CardDescription>
					</CardHeader>
					
					<CardContent className="grid gap-4">
						<FormField
							control={form.control}
							name="title"
							render={({field}) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<Input placeholder="e.g. Guitar Lessons" {...field}/>
									<FormMessage/>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({field}) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea maxLength={256} rows={1}
												  className='resize-none overflow-y-auto max-h-[48px]'
												  placeholder="Describe your skill" {...field}/>
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
						
						<FormField
							control={form.control}
							name="paymentType"
							render={({field}) => (
								<FormItem>
									<FormLabel>Payment type</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select payment type"/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{(Object.keys(PaymentType) as Array<keyof typeof PaymentType>).map((type) => (
												<SelectItem key={type} value={type}>
													{type}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage/>
								</FormItem>
							)}
						/>
						
						{(paymentTypeValue === PaymentType.MONEY || paymentTypeValue === PaymentType.BOTH) && (
							<FormField
								control={form.control}
								name="price"
								render={({field}) => (
									<FormItem>
										<FormLabel>Price</FormLabel>
										<Input
											type='number'
											step="0.01"
											placeholder="Enter price"
											value={field.value ?? null}
											onChange={(e) => field.onChange(Number(e.target.value))}
										/>
										<FormMessage/>
									</FormItem>
								)}
							/>
						)}
					</CardContent>
					
					<CardFooter className="flex flex-col gap-8">
						<Button
							disabled={createSkillMutation.isPending && createSkillMutation.variables.ownerId === session?.user?.id}
							className="w-full" type="submit">
							Create Skill
						</Button>
					</CardFooter>
					<Separator/>
				</Card>
			</form>
		</Form>
	);
};
