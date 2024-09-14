import { Navigate, Route, Routes  } from "react-router-dom";
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import TransactionPage from './pages/TransactionPage';
import NotFoundPage from './pages/NotFoundPage';
import Header from "./components/ui/Header";
import { GET_AUTHETICATED_USER } from "./graphql/queries/user.query";
import { useQuery } from "@apollo/client";
import { Toaster } from "react-hot-toast";


function App() {
  const {loading,data,error}=useQuery(GET_AUTHETICATED_USER);
  console.log("loading",loading);
  console.log("authUserNow",data);
  console.log("error",error);
  if(loading)
    return null;

  return (
    <>
    {data?.authUser && <Header/>}
     <Routes>
        <Route path="/" element={ data.authUser?  <HomePage/>: <Navigate to ="/login" /> }  />
        <Route path="/login" element={ !data.authUser? <LoginPage/>: <Navigate to ="/" /> }  />
        <Route path="/signUp" element={ !data.authUser?<SignUpPage/>: <Navigate to ="/login" /> }  />
        <Route path="/transaction/:id" element={data.authUser?<TransactionPage/>:<Navigate to ="/login" />} />
        <Route path="*" element={<NotFoundPage/>}/>
     </Routes>
     <Toaster/>
    </>
  )
}

export default App
