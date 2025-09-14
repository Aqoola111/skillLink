'use client'

import {Badge} from '@/components/ui/badge'
import {FormControl, FormField, FormItem, FormMessage} from '@/components/ui/form'
import {cn} from '@/lib/utils'
import {useEffect} from "react";
import {type Control, type FieldValues, type Path, useController} from 'react-hook-form'

type Option = { id: string; name: string }

type TagPickerProps<FV extends FieldValues, N extends Path<FV>> = {
	control: Control<FV>
	name: N                         // поле вида { id: string }[]
	label: string
	options: Option[]
	max?: number
	selected?: { id: string }[]
}

export function TagPickerSimple<FV extends FieldValues, N extends Path<FV>>({
																				control,
																				name,
																				label,
																				options,
																				selected,
																				max = Infinity,
																			}: TagPickerProps<FV, N>) {
	const {field} = useController({control, name})
	
	
	const value = (field.value as { id: string }[] | undefined) ?? []
	useEffect(() => {
		if (selected && selected.length > 0) {
			let current = value
			selected.forEach(obj => {
				if (!current.some(c => c.id === obj.id)) {
					current = [...current, {id: obj.id}]
				}
			})
			field.onChange(current)
		}
	}, [selected])
	
	
	const selectedIds = new Set(
		(value as Array<string | { id: string }>).map(v =>
			typeof v === 'string' ? v : v.id
		)
	)
	
	
	const toggle = (opt: Option) => {
		const exists = selectedIds.has(opt.id)
		
		if (exists) {
			field.onChange(value.filter(obj => obj.id !== opt.id))
		} else {
			if (value.length >= max) return
			field.onChange([...value, {id: opt.id}])
		}
	}
	
	
	return (
		<div className="flex flex-col gap-2">
			<div className='flex items-center justify-between px-2'>
				<h2 className="font-semibold">
					{label}
				</h2>
				<h1 className='text-muted-foreground text-xs'>
					{value.length} / {max}
				</h1>
			</div>
			
			<FormField control={control} name={name} render={() => (
				<FormItem>
					<FormControl>
						<div className="border rounded-xl p-5 flex flex-wrap gap-2">
							{options.map(opt => {
								const selected = selectedIds.has(opt.id)
								const disableAdd = !selected && value.length >= max
								return (
									<Badge
										key={opt.id}
										role="button"
										tabIndex={0}
										onKeyDown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') toggle(opt)
										}}
										onClick={() => toggle(opt)}
										variant={selected ? 'default' : 'outline'}
										className={cn(
											'inline-flex h-auto w-auto cursor-pointer transition-colors hover:bg-primary hover:scale-105',
											disableAdd && 'opacity-50 pointer-events-none'
										)}
										aria-pressed={selected}
									>
										{opt.name}
									</Badge>
								)
							})}
						</div>
					</FormControl>
					<FormMessage/>
				</FormItem>
			)}/>
		</div>
	)
}
