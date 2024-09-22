import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/Login';
import Register from './component/Register';
import Verify_Phone from './component/Verify_Phone';
import { useState, useEffect } from 'react';
import ProtectedRoute from './component/ProtectedRoute';
import Cookies from 'js-cookie';
import Home from './component/Home';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EmailProvider } from './component/EmailContext';

function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const registered = Cookies.get('isRegistered') === 'true';
    const verified = Cookies.get('isVerified') === 'true';
    setIsRegistered(registered);
    setIsVerified(verified);
  }, []);

  const [isOnline,setIsOnline]=useState(navigator.onLine);

  useEffect(()=>{
    const handleOnline = () =>{
      setIsOnline(true);
    }
    const handleOffline= () =>{
      setIsOnline(false);
    }

    window.addEventListener('online',handleOnline)
    window.addEventListener('offline',handleOffline)

    return ()=>{
      window.removeEventListener('online',handleOnline)
      window.removeEventListener('offline',handleOffline)
    }

  },[])

  const handleTryAgain = () =>{
    window.location.reload();
  }

  return (
      <div>
        {isOnline ? (
          <>
              <EmailProvider>
                <Router>
                  <Routes>
                    <Route
                      path="/"
                      element={isVerified ? <Navigate to="/home" /> : <Login setIsRegistered={setIsRegistered} />}
                    />
                    <Route
                      path="/register"
                      element={isVerified ? <Navigate to="/home" /> : <Register setIsRegistered={setIsRegistered} />}
                    />
                    <Route
                      path="/verify-email"
                      element={isRegistered ? <Verify_Phone setIsVerified={setIsVerified} /> : (
                        <>
                          {toast.error('You cannot access this page directly', {
                            autoClose: 5000,
                          })}
                          <Navigate to="/register" />
                        </>
                      )}
                    />
                    <Route
                      path="/home"
                      element={<ProtectedRoute component={Home} />}
                    />
                  </Routes>
                </Router>
                <ToastContainer />
              </EmailProvider>
          </>
        ) : (
          <div className="w-full h-screen flex justify-center items-center bg-gray-100">
            <div className='w-full flex  flex-col items-center text-center gap-y-2'>
                 <div>
                 <svg width="130px" height="130px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="System / Wifi_Off"> <path id="Vector" d="M17.8506 11.5442C17.0475 10.6829 16.0641 10.0096 14.9707 9.57227M20.7759 8.81625C19.5712 7.52437 18.0961 6.51439 16.4561 5.8584C14.816 5.20241 13.0514 4.91635 11.2881 5.02111M8.34277 14.5905C8.95571 13.9332 9.73448 13.4532 10.5971 13.2012C11.4598 12.9491 12.3745 12.9335 13.2449 13.1574M6.14941 11.5438C7.09778 10.5268 8.29486 9.77461 9.62259 9.36133M3.22363 8.81604C4.1215 7.85319 5.17169 7.04466 6.33211 6.42285M4.41406 4L18.5562 18.1421M12 19C11.4477 19 11 18.5523 11 18C11 17.4477 11.4477 17 12 17C12.5523 17 13 17.4477 13 18C13 18.5523 12.5523 19 12 19Z" stroke="#007BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g></svg>
                 </div>
                 <div className='flex  flex-col items-center text-center gap-y-2 w-full '>
                   <p className='text-lg font-bold' style={{color:"#007BFF"}}>Whoops!</p>
                   <p className='text-sm' >Please Check Your Internet Connection and Try Again.</p>
                 </div>
                 <div>
                     <button type='button' onClick={handleTryAgain} style={{backgroundColor:"#007BFF"}} className='rounded-sm px-3 py-1 text-white flex items-center gap-x-1'>Try Again <i className='bx bx-refresh text-2xl'></i></button>
                 </div>
            </div>
         </div>
        )}
      </div>
  );
}

export default App;
