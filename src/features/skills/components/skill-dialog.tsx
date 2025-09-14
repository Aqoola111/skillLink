'use client'
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import {Drawer} from "@/components/ui/drawer";
import {Mode, SkillForm, SkillFormInitial} from "@/features/skills/components/skill-form";
import {useIsMobile} from "@/hooks/use-mobile";

interface SkillDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	mode: Mode
	initial: SkillFormInitial & { id: string } | undefined
	title?: string
}

export const SkillDialog = ({open, onOpenChange, mode, initial}: SkillDialogProps) => {
	const isMobile = useIsMobile()
	if (!isMobile) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className='bg-transparent shadow-none border-none [&>button]:hidden'>
					<DialogHeader>
						<DialogTitle className='hidden'>
							{mode === "CREATE" ? "Create Skill" : "Edit Skill"}
						</DialogTitle>
					</DialogHeader>
					<SkillForm onClose={() => onOpenChange(false)} mode={mode} initial={initial}/>
				</DialogContent>
			</Dialog>
		)
	}
	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<SkillForm onClose={() => onOpenChange(false)} mode={mode} initial={initial}/>
			</DialogContent>
		</Drawer>
	)
};