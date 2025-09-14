'use client'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog"
import {useConfirmDialog} from "@/store/use-confirm-dialog-store";

export function ConfirmDialog() {
	const {isOpen, options, close} = {
		isOpen: useConfirmDialog(s => s.isOpen),
		options: useConfirmDialog(s => s.options),
		close: useConfirmDialog(s => s.close),
	}
	const {
		title = "Are you sure?",
		description = "This action cannot be undone.",
		confirmText = "Confirm",
		cancelText = "Cancel"
	} = options
	
	return (
		<AlertDialog open={isOpen} onOpenChange={(o) => !o && close(false)}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => close(false)}>{cancelText}</AlertDialogCancel>
					<AlertDialogAction onClick={() => close(true)}>{confirmText}</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}