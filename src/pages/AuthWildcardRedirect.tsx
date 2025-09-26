import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AuthWildcardRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/auth/callback${location.search}${location.hash}`, { replace: true });
  }, [location.search, location.hash, navigate]);

  return null;
}
