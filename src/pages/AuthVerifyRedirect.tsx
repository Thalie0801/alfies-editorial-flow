import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// This route catches unexpected /auth/v1/* redirects landing on our domain
// and forwards them to our client-side callback while preserving params
export default function AuthVerifyRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const search = location.search || '';
    const hash = location.hash || '';
    // Preserve both search and hash when redirecting to our callback page
    navigate(`/auth/callback${search}${hash}`, { replace: true });
  }, [location.search, location.hash, navigate]);

  return null;
}
