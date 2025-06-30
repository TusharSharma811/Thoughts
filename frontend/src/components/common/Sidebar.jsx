import XSvg from "../svgs/Logowhite.jsx";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ThemeToggle from "./ThemeToggle";

const Sidebar = () => {
	const queryClient = useQueryClient();
	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/auth/logout", {
					method: "POST",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: () => {
			toast.error("Logout failed");
		},
	});
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	return (
		<div className='md:flex-[2_2_0] w-18 max-w-52'>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-border-primary bg-background-primary w-20 md:w-full'>
				<Link to='/' className='flex justify-center md:justify-start p-4'>
					<XSvg className='w-8 h-8 fill-brand-primary hover:fill-brand-accent transition-colors duration-200' />
				</Link>
				<ul className='flex flex-col gap-2 mt-4 px-2'>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/'
							className='flex gap-3 items-center hover:bg-background-hover transition-all rounded-full duration-300 py-3 px-4 w-full max-w-fit cursor-pointer text-text-primary hover:text-brand-primary'
						>
							<MdHomeFilled className='w-6 h-6' />
							<span className='text-lg hidden md:block font-medium'>Home</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/notifications'
							className='flex gap-3 items-center hover:bg-background-hover transition-all rounded-full duration-300 py-3 px-4 w-full max-w-fit cursor-pointer text-text-primary hover:text-brand-primary'
						>
							<IoNotifications className='w-6 h-6' />
							<span className='text-lg hidden md:block font-medium'>Notifications</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/profile/${authUser?.username}`}
							className='flex gap-3 items-center hover:bg-background-hover transition-all rounded-full duration-300 py-3 px-4 w-full max-w-fit cursor-pointer text-text-primary hover:text-brand-primary'
						>
							<FaUser className='w-6 h-6' />
							<span className='text-lg hidden md:block font-medium'>Profile</span>
						</Link>
					</li>
				</ul>

				{/* Theme Toggle */}
				<div className='mt-4 px-2 flex justify-center md:justify-start'>
					<div className='flex gap-3 items-center py-3 px-4 w-full max-w-fit'>
						<ThemeToggle />
						<span className='text-lg hidden md:block font-medium text-text-primary'>Theme</span>
					</div>
				</div>

				{authUser && (
					<Link
						to={`/profile/${authUser.username}`}
						className='mt-auto mb-6 mx-2 flex gap-3 items-center transition-all duration-300 hover:bg-background-hover py-3 px-4 rounded-full'
					>
						<div className='avatar hidden md:inline-flex'>
							<div className='w-8 rounded-full border border-border-primary'>
								<img 
									src={authUser?.profileImg || "/avatar-placeholder.png"} 
									alt={authUser?.fullName}
									className="w-full h-full object-cover"
								/>
							</div>
						</div>
						<div className='flex justify-between flex-1'>
							<div className='hidden md:block'>
								<p className='text-text-primary font-bold text-sm w-20 truncate'>{authUser?.fullName}</p>
								<p className='text-text-muted text-sm'>@{authUser?.username}</p>
							</div>
							<BiLogOut
								className='w-5 h-5 cursor-pointer text-text-muted hover:text-status-error transition-colors duration-200'
								onClick={(e) => {
									e.preventDefault();
									logout();
								}}
								title="Logout"
							/>
						</div>
					</Link>
				)}
			</div>
		</div>
	);
};
export default Sidebar;
