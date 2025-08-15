import {auth} from "@/auth";
import SignInForm from "@/features/auth/components/sign-in-form";

const SignInPage = async () => {
	const session = await auth();
	
	return (
		<SignInForm/>
	)
}
export default SignInPage
