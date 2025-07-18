import React from 'react'
import { Routes,Route, Navigate } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotificationPage from './pages/NotificationPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import { Toaster } from 'react-hot-toast';
import PageLoader from './components/PageLoader.jsx';
import useAuthUser from './hooks/useAuthUser.js';
import Layout from "./components/Layout.jsx"
import { useThemeStore } from './store/useThemeStore.js';
import CallPage from './pages/CallPage.jsx';
import FriendPage from './pages/FriendPage.jsx';

const App = () => {

const {isLoading,authUser}=useAuthUser();
const {theme}=useThemeStore();
const isAuthenticated =Boolean(authUser);
const isOnboarded=authUser?.isOnboarded

if(isLoading) return <PageLoader/>

  return (
    <div className='min-h-screen' data-theme={theme}> 
     <Routes>
    <Route path='/' element={isAuthenticated&&isOnboarded?(<Layout showSidebar={true}><HomePage/></Layout>):(<Navigate to={!isAuthenticated?"/login":"/onboarding"}/>)}/>
    <Route path='/signup' element={!isAuthenticated?<SignUpPage/>:<Navigate to={isOnboarded?'/':"/onboarding"}/>}/>
    <Route path='/login'element={!isAuthenticated?(<LoginPage/>):(<Navigate to={isOnboarded?'/':"/onboarding"}/>)}/>
    <Route path='/notifications' element={isAuthenticated?<NotificationPage/>:<Navigate to="/login"/>}/>
     <Route path='/friends' element={isAuthenticated?<FriendPage/>:<Navigate to="/login"/>}/>
     <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />      
     <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

    <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
           (
                <OnboardingPage />
              ) 
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    <Toaster />
   </div>
  )
}

export default App;