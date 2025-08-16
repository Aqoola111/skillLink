import {QueryProvider} from "@/components/providers/query-provider";
import {Toaster} from "@/components/ui/sonner";
import {SessionProvider} from "next-auth/react";

interface RootProviderProps {
	children: React.ReactNode
}

export const RootProvider = ({children}: RootProviderProps) => {
	
	return (
		<>
			<QueryProvider>
				<SessionProvider>
					<Toaster richColors/>
					{children}
				</SessionProvider>
			</QueryProvider>
		</>
	)
};