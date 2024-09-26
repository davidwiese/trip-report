import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black dark:bg-gradient-to-b dark:from-[#191919] dark:via-black dark:to-[#191919]">
			<SignUp />
		</div>
	);
}
