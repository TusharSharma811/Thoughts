import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";

const Post = ({ post }) => {
	const [comment, setComment] = useState("");
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();
	const postOwner = post.user;
	const isLiked = post.likes.includes(authUser._id);

	const isMyPost = authUser._id === post.user._id;

	const formattedDate = formatPostDate(post.createdAt);

	const { mutate: deletePost, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/${post._id}`, {
					method: "DELETE",
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
			toast.success("Post deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const { mutate: likePost, isPending: isLiking } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/like/${post._id}`, {
					method: "POST",
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
		onSuccess: (updatedLikes) => {
			// this is not the best UX, bc it will refetch all posts
			// queryClient.invalidateQueries({ queryKey: ["posts"] });

			// instead, update the cache directly for that post
			queryClient.setQueryData(["posts"], (oldData) => {
				return oldData.map((p) => {
					if (p._id === post._id) {
						return { ...p, likes: updatedLikes };
					}
					return p;
				});
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const { mutate: commentPost, isPending: isCommenting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/comment/${post._id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text: comment }),
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
			toast.success("Comment posted successfully");
			setComment("");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleDeletePost = () => {
		deletePost();
	};

	const handlePostComment = (e) => {
		e.preventDefault();
		if (isCommenting) return;
		commentPost();
	};

	const handleLikePost = () => {
		if (isLiking) return;
		likePost();
	};

	return (
		<>
			<div className='flex gap-4 items-start p-6 border-b border-border-primary bg-background-card hover:bg-background-hover transition-colors duration-200'>
				<div className='avatar flex-shrink-0'>
					<Link to={`/profile/${postOwner.username}`} className='w-10 rounded-full overflow-hidden border border-border-primary'>
						<img 
							src={postOwner.profileImg || "/avatar-placeholder.png"} 
							alt={postOwner.fullName}
							className="w-full h-full object-cover"
						/>
					</Link>
				</div>
				<div className='flex flex-col flex-1 min-w-0'>
					<div className='flex gap-2 items-center mb-2'>
						<Link to={`/profile/${postOwner.username}`} className='font-bold text-text-primary hover:text-brand-primary transition-colors duration-200'>
							{postOwner.fullName}
						</Link>
						<span className='text-text-muted flex gap-1 text-sm'>
							<Link to={`/profile/${postOwner.username}`} className="hover:text-brand-primary transition-colors duration-200">
								@{postOwner.username}
							</Link>
							<span>·</span>
							<span>{formattedDate}</span>
						</span>
						{isMyPost && (
							<span className='flex justify-end flex-1'>
								{!isDeleting && (
									<button
										className='p-1 rounded-full hover:bg-status-error hover:bg-opacity-10 transition-colors duration-200'
										onClick={handleDeletePost}
									>
										<FaTrash className='w-4 h-4 text-text-muted hover:text-status-error' />
									</button>
								)}
								{isDeleting && <LoadingSpinner size='sm' />}
							</span>
						)}
					</div>
					<div className='flex flex-col gap-3 overflow-hidden'>
						<span className='text-text-primary leading-relaxed'>{post.text}</span>
						{post.img && (
							<img
								src={post.img}
								className='max-h-96 w-full object-cover rounded-lg border border-border-primary'
								alt='Post image'
							/>
						)}
					</div>
					<div className='flex justify-between mt-4'>
						<div className='flex gap-6 items-center'>
							<div
								className='flex gap-2 items-center cursor-pointer group'
								onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
							>
								<div className='p-2 rounded-full group-hover:bg-status-info group-hover:bg-opacity-10 transition-colors duration-200'>
									<FaRegComment className='w-4 h-4 text-text-muted group-hover:text-status-info' />
								</div>
								<span className='text-sm text-text-muted group-hover:text-status-info'>
									{post.comments.length}
								</span>
							</div>
							
							{/* Modal for comments */}
							<dialog id={`comments_modal${post._id}`} className='modal absolute left-1/2 top-1/2 z-5 bg-background-primary'>
								<div className='modal-box bg-background-card border border-border-primary rounded-lg max-w-lg'>
									<h3 className='font-bold text-lg mb-4 text-text-primary'>Comments</h3>
									<div className='flex flex-col gap-4 max-h-60 overflow-auto'>
										{post.comments.length === 0 && (
											<p className='text-sm text-text-muted text-center py-4'>
												No comments yet 🤔 Be the first one! 😉
											</p>
										)}
										{post.comments.map((comment) => (
											<div key={comment._id} className='flex gap-3 items-start'>
												<div className='avatar flex-shrink-0'>
													<div className='w-8 rounded-full border border-border-primary'>
														<img
															src={comment.user.profileImg || "/avatar-placeholder.png"}
															alt={comment.user.fullName}
															className="w-full h-full object-cover"
														/>
													</div>
												</div>
												<div className='flex flex-col flex-1 min-w-0'>
													<div className='flex items-center gap-2 mb-1'>
														<span className='font-bold text-text-primary text-sm'>{comment.user.fullName}</span>
														<span className='text-text-muted text-xs'>
															@{comment.user.username}
														</span>
													</div>
													<div className='text-sm text-text-primary'>{comment.text}</div>
												</div>
											</div>
										))}
									</div>
									<form
										className='flex gap-3 items-center mt-4 pt-4 border-t border-border-primary'
										onSubmit={handlePostComment}
									>
										<textarea
											className='flex-1 p-3 rounded-lg text-sm resize-none border border-border-primary bg-background-secondary text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary focus:ring-opacity-20 transition-all duration-200'
											placeholder='Add a comment...'
											value={comment}
											onChange={(e) => setComment(e.target.value)}
											rows={2}
										/>
										<button 
											className='py-2 px-4 bg-brand-primary hover:bg-brand-secondary text-text-inverse font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 disabled:opacity-50'
											disabled={isCommenting || !comment.trim()}
										>
											{isCommenting ? <LoadingSpinner size='sm' /> : "Post"}
										</button>
									</form>
								</div>
								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>
							</dialog>

							<div className='flex gap-2 items-center group cursor-pointer'>
								<div className='p-2 rounded-full group-hover:bg-status-success group-hover:bg-opacity-10 transition-colors duration-200'>
									<BiRepost className='w-5 h-5 text-text-muted group-hover:text-status-success' />
								</div>
								<span className='text-sm text-text-muted group-hover:text-status-success'>0</span>
							</div>

							<div className='flex gap-2 items-center group cursor-pointer' onClick={handleLikePost}>
								<div className='p-2 rounded-full group-hover:bg-red-500 group-hover:bg-opacity-10 transition-colors duration-200'>
									{isLiking && <LoadingSpinner size='sm' />}
									{!isLiked && !isLiking && (
										<FaRegHeart className='w-4 h-4 text-text-muted group-hover:text-red-500' />
									)}
									{isLiked && !isLiking && (
										<FaRegHeart className='w-4 h-4 text-red-500' />
									)}
								</div>
								<span
									className={`text-sm transition-colors duration-200 ${
										isLiked ? "text-red-500" : "text-text-muted group-hover:text-red-500"
									}`}
								>
									{post.likes.length}
								</span>
							</div>
						</div>
						<div className='flex items-center'>
							<div className='p-2 rounded-full hover:bg-brand-primary hover:bg-opacity-10 transition-colors duration-200'>
								<FaRegBookmark className='w-4 h-4 text-text-muted hover:text-brand-primary cursor-pointer' />
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Post;
