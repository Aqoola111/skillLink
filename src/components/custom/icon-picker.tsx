'use client'

import {LucideDynamic} from "@/components/custom/lucide-dynamic";
import {Button} from "@/components/ui/button";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {type LucideIconName, lucideIconsStrings} from "@/lib/lucide-icons-list";
import {cn} from "@/lib/utils";
import {Search} from "lucide-react";
import {UIEventHandler, useEffect, useMemo, useState} from "react";

interface IconPickerProps {
	value?: string | null;
	onChange: (val: string) => void;
	placeholder?: string;
	buttonClassName?: string;
}

const PAGE_SIZE = 20

export const IconPicker = ({buttonClassName, value, onChange, placeholder}: IconPickerProps) => {
	const [open, setOpen] = useState(false);
	const [q, setQ] = useState('');
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
	
	const list = useMemo(() => {
		const s = q.trim().toLowerCase();
		return s ? lucideIconsStrings.filter(n => n.includes(s)) : lucideIconsStrings;
	}, [q])
	
	useEffect(() => {
		setVisibleCount(PAGE_SIZE);
	}, [q, open]);
	
	useEffect(() => {
		if (visibleCount > list.length) setVisibleCount(list.length);
	}, [list.length, visibleCount]);
	
	const handleScroll: UIEventHandler<HTMLDivElement> = (e) => {
		const el = e.currentTarget;
		if (el.scrollTop + el.clientHeight >= el.scrollHeight - 4) {
			setVisibleCount(c => Math.min(c + PAGE_SIZE, list.length));
		}
	};
	
	const selected = (value && lucideIconsStrings.includes(value as LucideIconName)) ? value : "";
	
	const slice = list.slice(0, visibleCount);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" size='icon' role="combobox" aria-expanded={open}
						className={cn("w-[48px] h-[48px] ", buttonClassName)}>
					{
						selected ? (
							<LucideDynamic name={selected} className="!size-6 text-primary/80"/>
						) : (
							<Search/>
						)
					}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[320px] p-0">
				<Command>
					<CommandInput placeholder="Search icon..." value={q} onValueChange={setQ}/>
					<CommandList onScroll={handleScroll}>
						<CommandEmpty>No icon found.</CommandEmpty>
						<CommandGroup>
							<div className='grid grid-cols-4 gap-2 px-3 mx-auto'>
								{slice.map((name) => (
									<CommandItem
										key={name}
										aria-label={name}
										value={name}
										onSelect={(val) => {
											onChange(val);
											setOpen(false);
										}}
									>
										<Button variant='outline' size='icon' className='w-[48px] h-[48px]'>
											<LucideDynamic name={name} className={'!size-6 text-primary'}/>
										</Button>
									</CommandItem>
								))}
								{visibleCount < list.length && (
									<div
										className="col-span-4 w-full text-center text-xs text-muted-foreground">Loading…</div>
								)}
							</div>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
};