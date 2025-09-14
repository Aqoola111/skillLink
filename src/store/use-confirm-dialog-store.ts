import {create} from "zustand/react";

type confirmOptions = {
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
}

type ConfirmState = {
	isOpen: boolean;
	options: confirmOptions;
	resolve?: (value: boolean) => void;
	open: (options?: confirmOptions) => Promise<boolean>;
	close: (value: boolean) => void;
}

export const useConfirmDialog = create<ConfirmState>((set, get) => ({
	isOpen: false,
	options: {},
	resolve: undefined,
	open: (options) =>
		new Promise<boolean>((resolve) => {
			set({isOpen: true, options: {...options}, resolve})
		}),
	close: (value) => {
		const {resolve} = get()
		resolve?.(value)
		set({isOpen: false, options: {}, resolve: undefined})
	}
}))