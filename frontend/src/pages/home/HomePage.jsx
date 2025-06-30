import { useState } from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	return (
		<>
			<div className='flex-[4_4_0] mr-auto border-r border-border-primary min-h-screen bg-background-primary'>
				{/* Header */}
				<div className='flex w-full border-b border-border-primary bg-background-card backdrop-blur-sm sticky top-0 z-10'>
					<div
						className={`
							flex justify-center flex-1 p-4 transition duration-300 cursor-pointer relative
							hover:bg-background-hover text-text-primary font-medium
							${feedType === "forYou" ? "text-brand-primary" : "text-text-secondary"}
						`}
						onClick={() => setFeedType("forYou")}
					>
						For you
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-12 h-1 rounded-full bg-brand-primary'></div>
						)}
					</div>
					<div
						className={`
							flex justify-center flex-1 p-4 transition duration-300 cursor-pointer relative
							hover:bg-background-hover text-text-primary font-medium
							${feedType === "following" ? "text-brand-primary" : "text-text-secondary"}
						`}
						onClick={() => setFeedType("following")}
					>
						Following
						{feedType === "following" && (
							<div className='absolute bottom-0 w-12 h-1 rounded-full bg-brand-primary'></div>
						)}
					</div>
				</div>

				{/*  CREATE POST INPUT */}
				<CreatePost />

				{/* POSTS */}
				<Posts feedType={feedType} />
			</div>
		</>
	);
};
export default HomePage;
