'use client'

import {CustomFormSelect} from "@/components/custom/custom-form-select"
import {IconPicker} from "@/components/custom/icon-picker"
import {TagPickerSimple} from "@/components/custom/tag-picker"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Progress} from "@/components/ui/progress"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Separator} from "@/components/ui/separator"
import {Textarea} from "@/components/ui/textarea"
import {CreateSkillFormSchema} from "@/features/skills/schemas";
import {PaymentType} from "@prisma/client"
import {Loader} from "lucide-react"

import {Mode, SkillFormInitial, useSkillForm} from "../use-skill-form"

interface SkillFormProps {
	mode: Mode
	initial?: SkillFormInitial
	onClose?: () => void
}

export const SkillForm = ({mode, initial, onClose}: SkillFormProps) => {
	const {
		form,
		steps,
		incrementStep,
		decrementStep,
		isPending,
		tags,
		selectedTags,
		categories,
		onSubmit,
		setSelectedTags,
	} = useSkillForm(mode, initial, onClose)
	
	const paymentTypeValue = form.watch("paymentType")
	const categoryValue = form.watch("categoryId")
	
	return (
		<Form {...form}>
			<form
				className="mx-auto w-full max-w-2xl px-6 py-10"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<Card className="w-full md:w-[580px] flex min-h-[600px] justify-between">
					{/* HEADER */}
					<CardHeader className="text-3xl">
						<div className="flex w-full justify-between">
							<div className="flex flex-col gap-2">
								<CardTitle>
									{mode === "CREATE" ? "Share" : "Update"} your skill
								</CardTitle>
								<CardDescription className="text-xl">
									{steps.current === 1 ? "Skill Details" : "Barter Details"}
								</CardDescription>
							</div>
							<h1>
								Step {steps.current} of {steps.total}
							</h1>
						</div>
						<Progress value={(steps.current / steps.total) * 100}/>
					</CardHeader>
					
					{/* CONTENT */}
					<CardContent className="flex flex-1 flex-col gap-y-6">
						{steps.current === 1 && (
							<>
								<div className="flex items-center flex-col gap-3 w-full [&>*]:w-full">
									<FormField
										control={form.control}
										name="title"
										render={({field}) => (
											<FormItem>
												<FormLabel>What is your skill</FormLabel>
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
												<FormLabel>Describe it</FormLabel>
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
												<FormLabel>Choose payment type</FormLabel>
												<Select value={field.value} onValueChange={field.onChange}>
													<FormControl>
														<SelectTrigger className="w-full">
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
															field.onChange(v === "" || v === undefined ? 0 : Number(v))
														}}
													/>
												</FormItem>
											)}
										/>
									)}
								</div>
								
								<CustomFormSelect
									clearable
									control={form.control}
									name={"categoryId"}
									label={"Select Category"}
									options={categories.data?.map((cat) => ({
										value: cat.id,
										label: cat.name,
									}))}
								/>
								
								<div className="col-span-1 flex flex-col gap-4">
									<FormField
										control={form.control}
										name="icon"
										render={({field}) => (
											<FormItem>
												<FormLabel>Choose an icon</FormLabel>
												<IconPicker value={field.value} onChange={field.onChange}/>
												<FormMessage/>
											</FormItem>
										)}
									/>
									
									{!!categoryValue && (
										<TagPickerSimple<CreateSkillFormSchema, "tagIds">
											control={form.control}
											name="tagIds"
											label="Tags"
											options={tags.map((t) => ({id: t.id, name: t.name}))}
											max={3}
											selected={selectedTags}
										/>
									)}
								</div>
							</>
						)}
						
						{steps.current === 2 && (
							<div className="flex-1 flex items-center justify-center">
								{categories.isPending && (
									<div className="flex items-center justify-center">
										<Loader className="animate-spin"/>
									</div>
								)}
								
								{categories.data && (
									<TagPickerSimple<CreateSkillFormSchema, "allowedCategories">
										control={form.control}
										name="allowedCategories"
										label="Select allowed categories for barter"
										options={categories.data?.map((t) => ({id: t.id, name: t.name}))}
										max={5}
									/>
								)}
								
								{categories.isError && (
									<div className="flex items-center justify-center gap-2 text-destructive text-2xl">
										Failed to load categories
									</div>
								)}
							</div>
						)}
					</CardContent>
					
					{/* FOOTER */}
					<CardFooter>
						<div className="flex items-center justify-between gap-x-5 w-full">
							<Button
								variant="outline"
								disabled={steps.current === 1 || isPending}
								type="button"
								onClick={decrementStep}
								className={steps.total === 1 ? "hidden" : "inline-flex"}
							>
								Previous step
							</Button>
							
							{steps.current === steps.total && (
								<Button disabled={isPending} className="flex-1" type="submit">
									{isPending ? <Loader
										className="animate-spin"/> : mode === "CREATE" ? "Create Skill" : "Save changes"}
								</Button>
							)}
							
							<Button
								className={steps.total === 1 ? "hidden" : "inline-flex"}
								type="button"
								variant="outline"
								disabled={steps.total === steps.current || isPending}
								onClick={incrementStep}
							>
								Next step
							</Button>
						</div>
					</CardFooter>
					
					<Separator/>
				</Card>
			</form>
		</Form>
	)
}
