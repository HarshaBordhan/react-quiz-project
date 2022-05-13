/*
// not sure, if needed 

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ component: Component }) {
  const { currentUser } = useAuth();

  return currentUser ? (
    <Outlet key={props => <Component {...props} />} />
  ) : (
    <Navigate to="/login" />
  );
}
*/

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute() {
  const { currentUser } = useAuth();

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
}
