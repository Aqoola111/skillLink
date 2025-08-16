'use client'
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from "@/components/ui/sidebar";
import {SIDE_BAR_ITEMS} from "@/lib/constants";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {usePathname} from "next/navigation";

const MainSidebar = () => {
	const path = usePathname()
	return (
		<Sidebar>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						SkillLink
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			
			<SidebarContent>
				<SidebarMenu>
					{SIDE_BAR_ITEMS.map((item) => (
						<SidebarMenuItem className='px-4' key={item.label}>
							{item.label}
							{item.children.map((child) => (
								<SidebarMenuButton className={cn(child.href === path && 'bg-accent')} asChild
												   key={child.href}>
									<Link href={child.href}>
										{child.label}
									</Link>
								</SidebarMenuButton>
							))}
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarContent>
		</Sidebar>
	);
};

export default MainSidebar;
