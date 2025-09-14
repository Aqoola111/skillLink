import {Star, UserIcon} from "lucide-react";

interface UserInfoProps {
	name: string | null;
	image?: string;
	rating?: number;
	ratingsCount?: number;
}

const stars = Array.from({length: 5}, (_, i) => i + 1);

export const UserInfo = ({rating = 0, ratingsCount, image, name = 'User'}: UserInfoProps) => {
	return (
		<div className='flex gap-1 items-center'>
			<div>
				{/*// Implement image later*/}
				<UserIcon className='border rounded-full size-10 py-2'/>
			</div>
			<div className='flex flex-col'>
				<h1 className='font-semibold'>
					{name}
				</h1>
				<div className='flex items-center gap-1'>
					{stars.map(star => (
						<span key={star}
							  className={` ${star <= rating ? 'text-lg text-yellow-500' : 'text-sm text-gray-500'}`}>
									<Star size='14'/>
								</span>
					))}
					<h1 className='text-muted-foreground text-sm ml-1'>
						{ratingsCount ? ratingsCount : '0'}
					</h1>
					<h1 className='text-muted-foreground text-sm'>
						({ratingsCount ? ratingsCount : '0'})
					</h1>
				</div>
			</div>
		</div>
	)
};