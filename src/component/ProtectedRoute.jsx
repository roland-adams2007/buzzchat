import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const isRegistered = Cookies.get('isRegistered') === 'true';
    const isVerified = Cookies.get('isVerified') === 'true';

    if (!isRegistered) {
      toast.error('Session has expired', {
        autoClose: 5000,
      });
      setRedirectPath('/register');
    } else if (!isVerified) {
      toast.error('Session has expired', {
        autoClose: 5000,
      });
      setRedirectPath('/verify-email');
    }
  }, []);

  if (redirectPath) {
    return <Navigate to={redirectPath} />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
