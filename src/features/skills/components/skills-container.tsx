interface SkillsContainerProps {
	children?: React.ReactNode;
}

export const SkillsContainer = ({children}: SkillsContainerProps) => {
	return (
		<div className='flex flex-wrap gap-x-5 gap-y-2.5'>
			{children}
		</div>
	)
};