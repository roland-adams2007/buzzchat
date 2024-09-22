import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const Logout = ({updateStatus}) => {
      

  const navigate = useNavigate();

  const handleLogout = (e) => {

    e.preventDefault();
    Cookies.remove('isRegistered');
    Cookies.remove('isVerified');
    updateStatus(false)

    toast.success('You have been logged out', {
      autoClose: 5000,
    });

    // navigate('/');

    window.location.href="/";
  };

  return (
    <a href="#" onClick={handleLogout} className="rounded-md icon-link p-2">
          <i className="bx bx-log-out text-2xl md:text-3xl" />
    </a>
  );
};

export default Logout;
