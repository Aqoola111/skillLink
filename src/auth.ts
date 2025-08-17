import {signInSchema} from "@/features/auth/schemas";
import {prisma} from "@/lib/prisma"
import Credentials from "@auth/core/providers/credentials"
import {PrismaAdapter} from "@auth/prisma-adapter"
import NextAuth, {CredentialsSignin} from "next-auth"

const adapter = PrismaAdapter(prisma)

export const {handlers, auth, signIn, signOut} = NextAuth({
	adapter,
	session: {strategy: 'jwt'},
	providers: [
		Credentials({
			credentials: {
				email: {label: 'Email', type: 'email'},
				password: {label: 'Password', type: 'password'},
			},
			authorize: async (credentials) => {
				const validatedCredentials = signInSchema.parse(credentials)
				
				const user = await prisma.user.findUnique({
					where: {email: validatedCredentials.email}
				})
				
				if (!user) throw new CredentialsSignin("USER_NOT_FOUND");
				
				
				return user
			}
		})
	],
	callbacks: {
		async jwt({token, user}) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},
		async session({session, token}) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.role = token.role as "USER" | "ADMIN";
			}
			return session;
		},
	}
})
