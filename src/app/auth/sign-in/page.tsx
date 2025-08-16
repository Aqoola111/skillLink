import {auth} from "@/auth";
import SignInForm from "@/features/auth/components/sign-in-form";
import {redirect} from "next/navigation";

const SignInPage = async () => {
	const session = await auth();
	if (session?.user) {
		redirect('/')
	}
	return (
		<SignInForm/>
	)
}
export default SignInPage
