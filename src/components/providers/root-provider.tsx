import {Toaster} from "@/components/ui/sonner";
import {SessionProvider} from "next-auth/react";

interface RootProviderProps {
	children: React.ReactNode
}

export const RootProvider = ({children}: RootProviderProps) => {
	
	return (
		<>
			<SessionProvider>
				<Toaster richColors/>
				{children}
			</SessionProvider>
		</>
	)
};