import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
	const { data: authUser, isLoading } = useQuery({
		// we use queryKey to give a unique name to our query and refer to it later
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/auth/me");
				const data = await res.json();
				if (data.error) return null;
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				console.log("authUser is here:", data);
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		retry: false,
	});

	if (isLoading) {
		return (
			<ThemeProvider>
				<div className='h-screen flex justify-center items-center bg-background-primary'>
					<LoadingSpinner size='lg' />
				</div>
			</ThemeProvider>
		);
	}

	return (
		<ThemeProvider>
			<div className='flex max-w-6xl mx-auto bg-background-primary min-h-screen'>
				{/* Common component, bc it's not wrapped with Routes */}
				{authUser && <Sidebar />}
				<Routes>
					<Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
					<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
					<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
					<Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
					<Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
				</Routes>
				{authUser && <RightPanel />}
				<Toaster 
					position="top-right"
					toastOptions={{
						duration: 3000,
						style: {
							background: 'var(--bg-card)',
							color: 'var(--text-primary)',
							border: '1px solid var(--border-primary)',
						},
						success: {
							style: {
								background: 'var(--success)',
								color: 'white',
							},
						},
						error: {
							style: {
								background: 'var(--error)',
								color: 'white',
							},
						},
					}}
				/>
			</div>
		</ThemeProvider>
	);
}

export default App;
