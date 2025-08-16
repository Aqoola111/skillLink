'use client'
import {Button} from "@/components/ui/button";
import {signOut, useSession} from "next-auth/react";

const Page = () => {
	const {data: session, status} = useSession();
	
	return (
		<div>
			<h1>Welcome to the Next.js App!</h1>
			<p>Status: {status}</p>
			{session ? (
				<div>
					<p>Hello, {session.user.name}!</p>
					<p>Your email: {session.user.email}</p>
					<p>Your role: {session.user.role}</p>
					<p>
						{JSON.stringify(session.user, null, 2)}
					</p>
					<Button onClick={() => signOut()}>
						Logout
					</Button>
				</div>
			) : (
				<p>Please sign in to access your account.</p>
			)}
		</div>
	)
}
export default Page
