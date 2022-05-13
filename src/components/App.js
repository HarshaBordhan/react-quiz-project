import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import '../styles/App.css';
import Layout from './Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import Signup from './pages/Signup';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Usual approach */}
          {/* 
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          /> 
          */}
          {/* Better approach */}
          <Route path="/*" element={<PublicRoute />}>
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
          </Route>
          <Route path="/*" element={<PrivateRoute />}>
            <Route path="quiz/:id" element={<Quiz />} />
            <Route path="result/:id" element={<Result />} />
          </Route>
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
