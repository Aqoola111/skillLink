export const REDIRECT_AFTER_LOGIN = '/';
export const SKILLS_PER_PAGE = 10;

export const SIDE_BAR_ITEMS = [
	{
		label: 'Skills',
		children: [
			{
				href: '/skills',
				label: 'Look for skills',
			},
			{
				href: '/skills/my',
				label: 'My Skills',
			},
			{
				href: '/skills/create',
				label: 'Share Your Skill',
			}
		],
		
	}
];
