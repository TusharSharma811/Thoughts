import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const imgRef = useRef(null);

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();

	const {
		mutate: createPost,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async ({ text, img }) => {
			try {
				const res = await fetch("/api/posts/create", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text, img }),
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},

		onSuccess: () => {
			setText("");
			setImg(null);
			toast.success("Post created successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		createPost({ text, img });
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className='flex p-6 items-start gap-4 border-b border-border-primary bg-background-card'>
			<div className='avatar flex-shrink-0'>
				<div className='w-10 rounded-full border border-border-primary'>
					<img 
						src={authUser.profileImg || "/avatar-placeholder.png"} 
						alt={authUser.fullName}
						className="w-full h-full object-cover"
					/>
				</div>
			</div>
			<form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit}>
				<textarea
					className='w-full p-4 text-lg resize-none border border-border-primary rounded-lg bg-background-secondary text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary focus:ring-opacity-20 transition-all duration-200'
					placeholder="What's happening?"
					value={text}
					onChange={(e) => setText(e.target.value)}
					rows={3}
				/>
				{img && (
					<div className='relative w-full max-w-md mx-auto'>
						<IoCloseSharp
							className='absolute top-2 right-2 text-text-inverse bg-background-accent hover:bg-border-accent rounded-full w-6 h-6 p-1 cursor-pointer transition-colors duration-200'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>
						<img 
							src={img} 
							className='w-full h-72 object-cover rounded-lg border border-border-primary' 
							alt="Post preview"
						/>
					</div>
				)}

				<div className='flex justify-between items-center pt-3 border-t border-border-primary'>
					<div className='flex gap-4 items-center'>
						<button
							type="button"
							className='p-2 rounded-full hover:bg-background-hover transition-colors duration-200'
							onClick={() => imgRef.current.click()}
						>
							<CiImageOn className='text-brand-primary w-6 h-6' />
						</button>
						<button
							type="button"
							className='p-2 rounded-full hover:bg-background-hover transition-colors duration-200'
						>
							<BsEmojiSmileFill className='text-brand-primary w-5 h-5' />
						</button>
					</div>
					<input type='file' accept='image/*' hidden ref={imgRef} onChange={handleImgChange} />
					<button 
						className='py-2 px-6 bg-brand-primary hover:bg-brand-secondary text-text-inverse font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed'
						disabled={isPending || (!text.trim() && !img)}
					>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>
				{isError && (
					<div className='p-3 bg-status-error bg-opacity-10 border border-status-error rounded-lg'>
						<p className='text-status-error text-sm font-medium'>{error.message}</p>
					</div>
				)}
			</form>
		</div>
	);
};
export default CreatePost;
