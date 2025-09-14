'use client'

import {getCategories} from "@/features/categories/actions"
import {SkillWithRelations} from "@/features/skills/components/skill-card"
import {useCreateSkillMutation, useUpdateSkillMutation} from "@/features/skills/mutations"
import {
	createSkillDefaultValues,
	createSkillFormSchema,
	CreateSkillFormSchema,
	UpdateSkillSchema,
} from "@/features/skills/schemas"
import {zodResolver} from "@hookform/resolvers/zod"
import {Tag} from "@prisma/client"
import {useQuery, useQueryClient} from "@tanstack/react-query"
import {useSession} from "next-auth/react"
import {useRouter} from "next/navigation"
import {useEffect, useMemo, useState} from "react"
import {SubmitHandler, useFieldArray, useForm} from "react-hook-form"
import {toast} from "sonner"

type FormStep = { current: number; total: number }

export type Mode = 'CREATE' | 'EDIT'
export type SkillFormInitial = Partial<SkillWithRelations> & { id?: string }

export const useSkillForm = (mode: Mode, initial?: SkillFormInitial, onClose?: () => void) => {
	const router = useRouter()
	const queryClient = useQueryClient()
	const {data: session} = useSession()
	
	
	const [tags, setTags] = useState<Tag[]>([])
	const [selectedTags, setSelectedTags] = useState<Array<{ id: string }>>(initial?.tags?.map(t => ({id: t.id})) ?? [])
	
	
	const defaults = useMemo<Partial<SkillWithRelations>>(() => {
		if (!initial) return createSkillDefaultValues
		return {
			...createSkillDefaultValues,
			...initial,
			tagIds: initial.tags ?? [],
			price: initial.price ?? null,
			categoryId: initial.categoryId ?? null,
			icon: initial.icon ?? "",
		}
	}, [initial])
	
	
	const [steps, setSteps] = useState<FormStep>({current: 1, total: 2})
	const incrementStep = () => setSteps(p => p.current < p.total ? {...p, current: p.current + 1} : p)
	const decrementStep = () => setSteps(p => p.current > 1 ? {...p, current: p.current - 1} : p)
	
	
	const createSkillMutation = useCreateSkillMutation()
	const updateSkillMutation = useUpdateSkillMutation()
	const isPending = createSkillMutation.isPending || updateSkillMutation.isPending
	
	
	const categories = useQuery({
		queryKey: ["categories"],
		queryFn: getCategories,
	})
	
	
	const form = useForm<CreateSkillFormSchema>({
		resolver: zodResolver(createSkillFormSchema),
		defaultValues: defaults,
		mode: "onSubmit",
	})
	
	useEffect(() => {
		form.reset(defaults)
	}, [defaults, form])
	
	
	const paymentTypeValue = form.watch("paymentType")
	const categoryValue = form.watch("categoryId")
	
	
	useEffect(() => {
		if (paymentTypeValue === "BARTER") form.setValue("price", null)
		if (paymentTypeValue !== "BARTER") form.setValue("allowedCategories", [])
	}, [paymentTypeValue, form])
	
	
	useEffect(() => {
		if (initial?.tags && categoryValue === initial?.categoryId) {
			setSelectedTags(initial.tags.map(t => ({id: t.id})))
		} else {
			setSelectedTags([])
		}
	}, [initial, categoryValue])
	
	
	useEffect(() => {
		setSteps(prev => ({
			...prev,
			total: paymentTypeValue !== "MONEY" ? 2 : 1,
		}))
	}, [paymentTypeValue])
	
	
	const {replace} = useFieldArray({control: form.control, name: "tagIds"})
	useEffect(() => {
		if (!categoryValue) {
			setTags([])
			replace([])
			return
		}
		const cat = categories.data?.find(c => c.id === categoryValue)
		setTags(cat?.tags ?? [])
		replace([])
	}, [categoryValue, categories.data, replace])
	
	// CRUD хендлеры
	const handleCreate = async (data: CreateSkillFormSchema) => {
		createSkillMutation.mutate(data, {
			onSuccess: () => {
				toast.success(`Created ${data.title} skill successfully`)
				queryClient.invalidateQueries({queryKey: ["skills", session?.user?.id]})
				router.push("/skills/my")
			},
			onError: (error) => {
				toast.error(error instanceof Error ? error.message : "Something went wrong")
			}
		})
	}
	
	const handleUpdate = async (id: string, data: UpdateSkillSchema) => {
		updateSkillMutation.mutate({id, values: data}, {
			onSuccess: () => {
				toast.success(`Updated ${data.title} skill successfully`)
				queryClient.invalidateQueries({queryKey: ["skills", session?.user?.id]})
				onClose?.()
			},
			onError: (error) => {
				toast.error(error instanceof Error ? error.message : "Something went wrong")
			}
		})
	}
	
	const onSubmit: SubmitHandler<CreateSkillFormSchema> = async (data) => {
		try {
			if (mode === "CREATE") {
				await handleCreate(data)
			} else {
				if (!initial?.id) throw new Error("Missing skill id for update")
				await handleUpdate(initial.id, data as UpdateSkillSchema)
			}
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed")
		}
	}
	
	return {
		form,
		steps,
		incrementStep,
		decrementStep,
		isPending,
		tags,
		selectedTags,
		setSelectedTags,
		categories,
		onSubmit
	}
}
