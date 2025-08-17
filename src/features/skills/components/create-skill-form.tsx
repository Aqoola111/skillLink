'use client'

import {CustomFormSelect} from "@/components/custom/custom-form-select";
import {IconPicker} from "@/components/custom/icon-picker"
import {TagPickerSimple} from "@/components/custom/tag-picker";
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Separator} from "@/components/ui/separator"
import {Textarea} from "@/components/ui/textarea"
import {getCategories} from "@/features/categories/actions"
import {useCreateSkillMutation} from "@/features/skills/mutations"
import {
	createSkillDefaultValues,
	createSkillFormSchema,
	CreateSkillFormSchema,
	MAX_TAGS,
} from "@/features/skills/schemas"
import {zodResolver} from "@hookform/resolvers/zod"
import {PaymentType, Tag} from "@prisma/client"
import {useQuery, useQueryClient} from "@tanstack/react-query"
import {useSession} from "next-auth/react"
import {useEffect, useState} from "react"
import {SubmitHandler, useFieldArray, useForm} from "react-hook-form"
import {toast} from "sonner"

export const CreateSkillForm = () => {
	const [tags, setTags] = useState<Tag[]>([])
	const {data: session} = useSession()
	
	const createSkillMutation = useCreateSkillMutation()
	const queryClient = useQueryClient()
	
	const categories = useQuery({
		queryKey: ["categories"],
		queryFn: getCategories,
	})
	
	const form = useForm<CreateSkillFormSchema>({
		resolver: zodResolver(createSkillFormSchema),
		defaultValues: createSkillDefaultValues,
		mode: "onSubmit",
	})
	
	const paymentTypeValue = form.watch("paymentType")
	const categoryValue = form.watch("categoryId")
	
	const {fields, append, remove, replace} = useFieldArray({
		control: form.control,
		name: "tagIds",
		keyName: "_key",
	})
	
	useEffect(() => {
		if (!categoryValue) {
			setTags([])
			replace([])
			return
		}
		const cat = categories.data?.find((c) => c.id === categoryValue)
		setTags(cat?.tags ?? [])
		replace([])
	}, [categoryValue, categories.data, replace])
	
	const selectedIds = fields.map((f) => f.id)
	const isTagSelected = (tag: Tag) => selectedIds.includes(tag.id)
	
	const toggleTag = (tag: Tag) => {
		const idx = fields.findIndex((f) => f.id === tag.id)
		if (idx >= 0) {
			remove(idx)
			return
		}
		if (fields.length >= MAX_TAGS) {
			toast.error(`You can select up to ${MAX_TAGS} tags`)
			return
		}
		append({id: tag.id})
	}
	
	const handleRemoveCategory = () => {
		form.resetField("categoryId")
		replace([])
		setTags([])
	}
	
	const onSubmit: SubmitHandler<CreateSkillFormSchema> = async (data) => {
		createSkillMutation.mutate(data, {
			onSuccess: () => {
				toast.success(`Created ${data.title} skill successfully`)
				queryClient.invalidateQueries({queryKey: ["skills", session?.user?.id]})
			},
			onError: (error) => {
				if (error instanceof Error) {
					toast.error(error.message)
				} else {
					toast.error("Something went wrong")
				}
			},
		})
	}
	
	return (
		<Form {...form}>
			<form className="mx-auto w-full max-w-2xl px-6 py-10"
				  onSubmit={form.handleSubmit(onSubmit)}>
				<Card className="w-full md:w-[580px]">
					<CardHeader className="text-3xl text-center">
						<CardTitle>Share your skill</CardTitle>
						<CardDescription className="text-xl">Add a new skill to your profile.</CardDescription>
					</CardHeader>
					
					<CardContent className='flex  flex-col gap-y-4'>
						<div className='flex items-center flex-col gap-2 w-full [&>*]:w-full'>
							<FormField
								control={form.control}
								name="title"
								render={({field}) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<Input placeholder="e.g. Guitar Lessons" {...field} />
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
											<Textarea
												maxLength={256}
												rows={1}
												className="resize-none overflow-y-auto max-h-[48px]"
												placeholder="Describe your skill"
												{...field}
											/>
										</FormControl>
										<FormMessage/>
									</FormItem>
								)}
							/>
						</div>
						
						<div className="flex items-center gap-2 [&>*]:w-full">
							<FormField
								control={form.control}
								name="paymentType"
								render={({field}) => (
									<FormItem>
										<FormLabel>Payment type</FormLabel>
										<Select value={field.value} onValueChange={field.onChange}>
											<FormControl>
												<SelectTrigger className='w-full'>
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
												type="number"
												step="0.01"
												placeholder="Enter price"
												value={field.value ?? ""}
												onChange={(e) => {
													const v = e.target.value
													field.onChange(v === "" ? null : Number(v))
												}}
											/>
										</FormItem>
									)}
								/>
							)}
						
						
						</div>
						
						<CustomFormSelect control={form.control} name={'categoryId'} label={'Select Category'}
										  options={categories.data?.map((cat) => {
											  return {
												  value: cat.id,
												  label: cat.name,
											  }
										  })}/>
						
						
						<div className="col-span-1 flex flex-col gap-4">
							<FormField
								control={form.control}
								name="icon"
								render={({field}) => (
									<FormItem>
										<FormLabel>Icon</FormLabel>
										<IconPicker value={field.value} onChange={field.onChange}/>
										<FormMessage/>
									</FormItem>
								)}
							/>
							
							
							{!!categoryValue && (
								<TagPickerSimple<CreateSkillFormSchema, 'tagIds'>
									control={form.control}
									name="tagIds"
									label="Tags"
									options={tags.map(t => ({id: t.id, name: t.name}))}
									max={3}
								/>)
							}
						</div>
					</CardContent>
					
					<CardFooter className="flex flex-col gap-8">
						<Button disabled={createSkillMutation.isPending} className="w-full" type="submit">
							Create Skill
						</Button>
					</CardFooter>
					<Separator/>
				</Card>
			</form>
		</Form>
	)
}
