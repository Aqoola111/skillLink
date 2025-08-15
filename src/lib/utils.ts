import {hash} from "bcryptjs";
import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const hashPassword = async (password: string) => {
	return await hash(password, 10)
}

export const getErrorMessage = (error: unknown): string => {
	if (error instanceof Error) {
		return error.message;
	} else if (typeof error === 'string') {
		return error;
	} else {
		return 'An unknown error occurred';
	}
}