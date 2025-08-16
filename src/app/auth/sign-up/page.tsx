import {auth} from "@/auth";
import SignUpForm from "@/features/auth/components/sign-up-form";
import {redirect} from "next/navigation";

const SignUpPage = async () => {
	const session = await auth();
	if (session?.user) {
		redirect('/')
	}
	return (
		<SignUpForm/>
	)
}
export default SignUpPage
