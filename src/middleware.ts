import {auth} from "@/auth"

export default auth((req) => {
	const {nextUrl} = req
	const isAuth = !!req.auth
	
	// Разрешённые без входа пути
	const publicPaths = ["/marketing", "/auth/sign-up", "/auth/sign-in",]
	
	if (!isAuth && !publicPaths.some(path => nextUrl.pathname.startsWith(path))) {
		return Response.redirect(new URL("/auth/sign-up", nextUrl))
	}
})

// Укажи, что мидлварь работает на всех путях
export const config = {
	matcher: [
		"/((?!_next/|public/|favicon.ico|marketing|api/auth|.*\\..*).*)",
	],
}