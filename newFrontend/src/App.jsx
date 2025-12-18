import Layout from './components/Layout';
import Home from './pages/Home';
import LoadingSkeleton from './components/Skeletons/LoadingSkeleton';
import Login from './pages/Login';
import Signup from './pages/Signup';
import History from './pages/History'
import NotFoundPage from './pages/NotFoundPage';
import LandingPage from './pages/LandingPage';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@apollo/client';
import { GET_AUTHETICATED_USER } from './graphql/queries/user.query';
import Analytics from './pages/Analytics';
import AISuggestions from './pages/AISuggestions';
import FutureInsights from './pages/FutureInsights';
import TransactionUpdateForm from './pages/TransactionUpdateForm';
import Statement from './pages/Statement';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import TributeToOurNation from './pages/TributeToOurNation';
import { UserProvider } from './context/UserContext';
import { checkWeatherSeason } from './helpers/helperFunctions';
import Snowfall from 'react-snowfall';
import { useEffect, useState } from 'react';

function App() {
  const { loading, data } = useQuery(GET_AUTHETICATED_USER, {
    fetchPolicy: 'network-only'
  });

  const [isColdWeather, setIsColdWeather] = useState(false);

  useEffect(() => {
    const isWinter = checkWeatherSeason();
    setIsColdWeather(isWinter);
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <UserProvider>
      {/* 
        Snowfall Component 
        - pointerEvents: 'none': ensures clicks pass through to your app
        - zIndex: 50: ensures it falls over the header/content
        - snowflakeCount: 15 (Low frequency)
        - speed: [0.5, 1.5] (Slow speed range)
        - wind: [-0.5, 0.5] (Gentle swaying)
      */}
      {isColdWeather && (
        <Snowfall 
          style={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            zIndex: 50,
            pointerEvents: 'none' 
          }}
          snowflakeCount={15}  // Reduced density
          speed={[0.8, 1.5]}   // Slower falling speed [min, max]
          wind={[-0.5, 0.5]}   // Gentle wind range
          // radius={[0.5, 2.5]}  // Varied small sizes
        />
      )}

      <Routes>
        {/* Landing Page Route */}
        <Route path='/' element={!data?.authUser ? <LandingPage /> : <Navigate to="/dashboard" />} />
        
        {/* Protected Dashboard Routes */}
        <Route path='/dashboard' element={data?.authUser ? <Layout loggedInUser={data?.authUser} /> : <Navigate to="/" />}>
          <Route index element={<Home loggedInUser={data?.authUser} />} />
          <Route path='analytics' element={<Analytics />} />
          <Route path='ai-suggestions' element={<AISuggestions />} />
          <Route path='future-insights' element={<FutureInsights />} />
          <Route path='history' element={<History />} />
          <Route path="history/:id" element={<TransactionUpdateForm />} />
          <Route path="statement" element={<Statement />} />
          <Route path="profile" element={<Profile />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        {/* Auth Routes */}
        <Route path='/signup' element={!data?.authUser ? <Signup /> : <Navigate to="/dashboard" />} />
        <Route path='/login' element={!data?.authUser ? <Login /> : <Navigate to="/dashboard" />} />
        
        {/* Tribute Page */}
        <Route path='/tribute-to-our-nation' element={<TributeToOurNation />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </UserProvider>
  )
}

export default App;