import { Routes, Route, Navigate } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Auth } from './components/Auth';
import { LinkedInCallback } from './components/LinkedInCallback';
import { LandingPage } from './components/LandingPage';
import { UserProfile } from './components/UserProfile/UserProfile';
import { RecommendationForm, RecommendationPage, RecommendationSearch } from './components/Recommendation';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { useUser } from './context/UserContext';

export default function App() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<Auth defaultMode="signin" />} />
        <Route path="/signup" element={<Auth defaultMode="signup" />} />
        <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Navigate to={`/profile/${user?.id}`} replace />
          </ProtectedRoute>
        } />
        <Route path="/profile/:userId" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        <Route path="/write-recommendation" element={
          <ProtectedRoute>
            <RecommendationSearch />
          </ProtectedRoute>
        } />
        <Route path="/write-recommendation/:userId" element={
          <ProtectedRoute>
            <RecommendationForm />
          </ProtectedRoute>
        } />
        <Route path="/recommendation/:recommendationId" element={<RecommendationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}