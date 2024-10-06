
import Layout from './components/Layout';
import LoadingSkeleton from './components/LoadingSkeleton';
import Home from './pages/Home';
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

    <>
        <Routes>
          

          <Route path='/' element={data?.authUser ? <Layout loggedInUser={data?.authUser}/> : <Navigate to="/login" />}>

            <Route index element={<Home loggedInUser={data?.authUser} />} />
            <Route path='analytics' element={<Analytics/>}/>
            <Route path='history' element={<History/>} />
            <Route path="history/:id" element={<TransactionUpdateForm/>} />
            <Route path="statement" element={<Statement/>} />
            <Route path="*" element={<NotFoundPage />} />


          </Route>

          <Route path='/signup' element={<Signup/>} />
          <Route path='/login' element={!data.authUser ? <Login/> : <Navigate to="/" />}/>
          {/* <Route path="*" element={<NotFoundPage />} /> */}
          
        </Routes>
        <Toaster />
    </>
  )
}

export default App;


