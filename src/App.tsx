import { Routes, Route } from 'react-router-dom';
import SignInForm from './_auth/forms/SignInForm';
import SignUpForm from './_auth/forms/SignUpForm';
import { Home, Explore, Messages, AllUsers, CreatePost, EditPost, PostDetails, Profile, UpdateProfile } from './_root/pages';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Settings from './_root/pages/Settings';
import { FollowProvider } from './context/FollowContext';
import { ThemeProvider } from './context/ThemeContext';
import Follower from './_root/pages/Follower';
import Following from './_root/pages/Following';


const App = () => {
  return (
    <ThemeProvider>
      <FollowProvider>
        <main className='flex h-screen'>
          <Routes>
            {/* public routes */}
            <Route element={<AuthLayout />}>
              <Route path='/sign-in' element={<SignInForm />} />
              <Route path='/sign-up' element={<SignUpForm />} />
            </Route>
            {/* private routes */}
            <Route element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route path='/explore' element={<Explore />} />
              <Route path='/all-users' element={<AllUsers />} />
              <Route path='/messages' element={<Messages />} />
              <Route path='/create-post' element={<CreatePost />} />
              <Route path='/update-post/:id' element={<EditPost />} />
              <Route path='/posts/:id' element={<PostDetails />} />
              <Route path='/profile/:id/*' element={<Profile />} />
              <Route path='/update-profile/:id' element={<UpdateProfile />} />
              <Route path='/settings-profile/:id' element={<Settings />} />
              <Route path='/follower-profile/:id' element={<Follower />} />
              <Route path='/following-profile/:id' element={<Following />} />
            </Route>
          </Routes>
          <Toaster />
        </main>
      </FollowProvider>
    </ThemeProvider>
  );
};

export default App;
