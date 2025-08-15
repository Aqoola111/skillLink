import {auth} from "@/auth";
import SignUpForm from "@/features/auth/components/sign-up-form";

const SignUpPage = async () => {
	const session = await auth();
	
	return (
		<SignUpForm/>
	)
}
export default SignUpPage
