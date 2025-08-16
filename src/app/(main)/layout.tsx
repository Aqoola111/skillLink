'use client'
import MainSidebar from "@/components/layout/main-sidebar";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,} from "@/components/ui/breadcrumb"
import {Separator} from "@/components/ui/separator"
import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/components/ui/sidebar"
import {usePathname} from "next/navigation";

interface MainLayoutProps {
	children: React.ReactNode;
}

const MainLayout = ({children}: MainLayoutProps) => {
	const path = usePathname()
	const path_values = path.split('/').slice(1)
	return (
		<SidebarProvider>
			<MainSidebar/>
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1"/>
					<Separator
						orientation="vertical"
						className="mr-2 data-[orientation=vertical]:h-4"
					/>
					<Breadcrumb>
						<BreadcrumbList>
							{
								path_values.map((item, index) => (
									<BreadcrumbItem key={item + index} className="hidden md:block">
										<BreadcrumbLink href="#">
											{item.charAt(0).toUpperCase() + item.slice(1)}
										</BreadcrumbLink>
									</BreadcrumbItem>
								))
							}
						</BreadcrumbList>
					</Breadcrumb>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
export default MainLayout
