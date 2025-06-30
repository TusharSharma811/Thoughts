import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../../components/svgs/Logowhite";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
	});

	const queryClient = useQueryClient();

	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ email, username, fullName, password }) => {
			try {
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, username, fullName, password }),
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to create account");
				console.log(data);
				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Account created successfully");

			{
				/* Added this line below, after recording the video. I forgot to add this while recording, sorry, thx. */
			}
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault(); // page won't reload
		mutate(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className='max-w-7xl mx-auto flex h-screen bg-background-primary'>
			<div className='flex-1 hidden lg:flex items-center justify-center bg-background-secondary'>
				<XSvg className='lg:w-2/3 fill-brand-primary' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center px-8'>
				<form className='w-full max-w-md flex gap-6 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-brand-primary mx-auto' />
					<h1 className='text-4xl font-extrabold text-text-primary text-center'>Join today.</h1>
					
					<label className='flex flex-col gap-2'>
						<span className='text-text-secondary font-medium'>Email</span>
						<div className='flex items-center gap-3 px-4 py-3 border border-border-primary rounded-lg bg-background-card focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary focus-within:ring-opacity-20 transition-all duration-200'>
							<MdOutlineMail className='text-text-muted w-5 h-5' />
							<input
								type='email'
								className='grow bg-transparent text-text-primary placeholder-text-muted focus:outline-none'
								placeholder='Enter your email'
								name='email'
								onChange={handleInputChange}
								value={formData.email}
							/>
						</div>
					</label>
					
					<div className='flex gap-4'>
						<label className='flex flex-col gap-2 flex-1'>
							<span className='text-text-secondary font-medium'>Username</span>
							<div className='flex items-center gap-3 px-4 py-3 border border-border-primary rounded-lg bg-background-card focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary focus-within:ring-opacity-20 transition-all duration-200'>
								<FaUser className='text-text-muted w-4 h-4' />
								<input
									type='text'
									className='grow bg-transparent text-text-primary placeholder-text-muted focus:outline-none'
									placeholder='Username'
									name='username'
									onChange={handleInputChange}
									value={formData.username}
								/>
							</div>
						</label>
						
						<label className='flex flex-col gap-2 flex-1'>
							<span className='text-text-secondary font-medium'>Full Name</span>
							<div className='flex items-center gap-3 px-4 py-3 border border-border-primary rounded-lg bg-background-card focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary focus-within:ring-opacity-20 transition-all duration-200'>
								<MdDriveFileRenameOutline className='text-text-muted w-4 h-4' />
								<input
									type='text'
									className='grow bg-transparent text-text-primary placeholder-text-muted focus:outline-none'
									placeholder='Full Name'
									name='fullName'
									onChange={handleInputChange}
									value={formData.fullName}
								/>
							</div>
						</label>
					</div>
					
					<label className='flex flex-col gap-2'>
						<span className='text-text-secondary font-medium'>Password</span>
						<div className='flex items-center gap-3 px-4 py-3 border border-border-primary rounded-lg bg-background-card focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary focus-within:ring-opacity-20 transition-all duration-200'>
							<MdPassword className='text-text-muted w-5 h-5' />
							<input
								type='password'
								className='grow bg-transparent text-text-primary placeholder-text-muted focus:outline-none'
								placeholder='Create a password'
								name='password'
								onChange={handleInputChange}
								value={formData.password}
							/>
						</div>
					</label>
					
					<button 
						className='py-3 px-6 bg-brand-primary hover:bg-brand-secondary text-text-inverse font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed'
						disabled={isPending}
					>
						{isPending ? "Creating account..." : "Create Account"}
					</button>
					
					{isError && (
						<div className='p-3 bg-status-error bg-opacity-10 border border-status-error rounded-lg'>
							<p className='text-status-error text-sm font-medium'>{error.message}</p>
						</div>
					)}
				</form>
				
				<div className='flex flex-col gap-4 mt-8 w-full max-w-md'>
					<p className='text-text-secondary text-center text-sm'>
						Use any dummy data to sign up and test the application
					</p>
					<p className='text-text-secondary text-center'>Already have an account?</p>
					<Link to='/login'>
						<button className='w-full py-3 px-6 border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-text-inverse font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50'>
							Sign In
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;
