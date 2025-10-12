
import Layout from './components/Layout';
import Home from './pages/Home';
import LoadingSkeleton from './components/Skeletons/LoadingSkeleton';
import Login from './pages/Login';
import Signup from './pages/Signup';
import History from './pages/History'
import NotFoundPage from './pages/NotFoundPage';
import { BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@apollo/client';
import { GET_AUTHETICATED_USER } from './graphql/queries/user.query';
import Analytics from './pages/Analytics';
import TransactionUpdateForm from './pages/TransactionUpdateForm';
import Statement from './pages/Statement';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import { UserProvider } from './context/UserContext';
 

function App() {

  const { loading, data } = useQuery(GET_AUTHETICATED_USER);
  // console.log(data,"getting user");
  if (loading) {
    return <LoadingSkeleton />;
  }
  // if(!data?.authUser){
  //   return <Login/>
  // }
  // console.log(data?.authUser,"In App");
  return (
    <UserProvider>
        <Routes>
          

          <Route path='/' element={data?.authUser ? <Layout loggedInUser={data?.authUser}/> : <Navigate to="/login" />}>

            <Route index element={<Home loggedInUser={data?.authUser} />} />
            <Route path='analytics' element={<Analytics/>}/>
            <Route path='history' element={<History/>} />
            <Route path="history/:id" element={<TransactionUpdateForm/>} />
            <Route path="statement" element={<Statement/>} />
            <Route path="profile" element={<Profile/>} />
            <Route path="change-password" element={<ChangePassword/>} />
            <Route path="*" element={<NotFoundPage />} />


          </Route>

          <Route path='/signup' element={<Signup/>} />
          <Route path='/login' element={!data.authUser ? <Login/> : <Navigate to="/" />}/>
          {/* <Route path="*" element={<NotFoundPage />} /> */}
          
        </Routes>
        <Toaster />
    </UserProvider>
  )
}

export default App;


