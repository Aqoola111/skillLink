import {Button} from "@/components/ui/button";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {XIcon} from "lucide-react";
import {Control, FieldPath, FieldValues} from "react-hook-form";

type options = {
	value: string;
	label: string;
}

type props<FV extends FieldValues, N extends FieldPath<FV>> = {
	control: Control<FV>
	name: N
	label?: string;
	placeholder?: string;
	options?: options[]
	clearable?: boolean;
}

export const CustomFormSelect = <
	FV extends FieldValues,
	N extends FieldPath<FV>
>({
	  clearable,
	  options,
	  label = "Select",
	  placeholder = "Select...",
	  name,
	  control,
  }: props<FV, N>) => {
	return (
		<FormField name={name} control={control} render={({field}) => (
			<FormItem>
				<FormLabel>
					{label}
				</FormLabel>
				<Select value={field.value as string | undefined} onValueChange={field.onChange}>
					<FormControl>
						<div className="flex gap-2 items-center">
							<SelectTrigger aria-label={`select-${name}`} className="w-full">
								<SelectValue placeholder={placeholder}/>
							</SelectTrigger>
							{clearable && !!field.value && (
								<Button aria-label={`clear-${name}`} type="button"
										onClick={() => field.onChange(undefined)} size="icon"
										variant="destructive">
									<XIcon className="!size-5"/>
								</Button>
							)}
						</div>
					</FormControl>
					<SelectContent>
						{options?.map((o) => (
							<SelectItem key={o.value} value={o.value}>
								{o.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<FormMessage/>
			</FormItem>
		)}/>
	);
};