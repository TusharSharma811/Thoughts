import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import useFollow from "../../hooks/useFollow";

import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import LoadingSpinner from "./LoadingSpinner";

const RightPanel = () => {
	const { data: suggestedUsers, isLoading } = useQuery({
		queryKey: ["suggestedUsers"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/users/suggested");
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong!");
				}
				return data;
			} catch (error) {
				throw new Error(error.message);
			}
		},
	});

	const { follow, isPending } = useFollow();

	if (suggestedUsers?.length === 0) return <div className='md:w-64 w-0'></div>;

	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className='bg-background-card border border-border-primary p-6 rounded-lg sticky top-2 shadow-light'>
				<p className='font-bold text-text-primary text-lg mb-4'>Who to follow</p>
				<div className='flex flex-col gap-4'>
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						suggestedUsers?.map((user) => (
							<Link
								to={`/profile/${user.username}`}
								className='flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-background-hover transition-colors duration-200'
								key={user._id}
							>
								<div className='flex gap-3 items-center flex-1 min-w-0'>
									<div className='avatar flex-shrink-0'>
										<div className='w-10 rounded-full border border-border-primary'>
											<img 
												src={user.profileImg || "/avatar-placeholder.png"} 
												alt={user.fullName}
												className="w-full h-full object-cover"
											/>
										</div>
									</div>
									<div className='flex flex-col min-w-0 flex-1'>
										<span className='font-semibold text-text-primary tracking-tight truncate'>
											{user.fullName}
										</span>
										<span className='text-sm text-text-muted truncate'>@{user.username}</span>
									</div>
								</div>
								<div className='flex-shrink-0'>
									<button
										className='py-2 px-4 bg-brand-primary hover:bg-brand-secondary text-text-inverse font-medium rounded-full text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 disabled:opacity-50'
										onClick={(e) => {
											e.preventDefault();
											follow(user._id);
										}}
										disabled={isPending}
									>
										{isPending ? <LoadingSpinner size='sm' /> : "Follow"}
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;
