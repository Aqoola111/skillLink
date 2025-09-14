'use client'
import {deleteSkill, getSkillByOwnerId} from "@/features/skills/actions";
import {SkillCard, SkillWithRelations} from "@/features/skills/components/skill-card";
import {SkillDialog} from "@/features/skills/components/skill-dialog";
import {SkillsContainer} from "@/features/skills/components/skills-container";
import {useConfirmDialog} from "@/store/use-confirm-dialog-store";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";
import {useState} from "react";
import {toast} from "sonner";

export const UserSkillsCards = () => {
	const {data: session, status} = useSession();
	const confirm = useConfirmDialog(s => s.open)
	const queryClient = useQueryClient();
	
	if (status !== 'authenticated' || !session?.user) {
		redirect('/skills')
	}
	
	const data = useQuery({
		queryKey: ['skills', session.user.id],
		queryFn: () => getSkillByOwnerId(session.user.id),
		enabled: !!session?.user.id,
	})
	
	const [open, setOpen] = useState(false)
	const [selectedSkill, setSelectedSkill] = useState<SkillWithRelations | null>(null)
	const handelDelete = (id: string) => {
		confirm({
			title: "Delete skill?",
			description: "This action cannot be undone.",
			confirmText: "Delete",
		}).then((ok) => {
			if (ok) {
				deleteSkill(id).then((r) =>
					r && queryClient.invalidateQueries({queryKey: ['skills', session.user.id]})
				);
			}
		}).catch((err) => {
			toast.error("An error occurred." + err.message);
		});
		
	}
	
	return (
		<SkillsContainer>
			{data.data?.map((item) => (
				<SkillCard onDelete={(id) => handelDelete(id)} onEdit={(s) => {
					setSelectedSkill(item)
					setOpen(true)
				}} skill={item} key={item.id}/>
			))}
			<SkillDialog
				open={open}
				onOpenChange={setOpen}
				mode={selectedSkill ? "EDIT" : "CREATE"}
				initial={selectedSkill ?? undefined}
			/>
		</SkillsContainer>
	)
};