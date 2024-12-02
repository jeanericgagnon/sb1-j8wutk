import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { auth } from '../lib/firebase';
import { linkedInAuth } from '../lib/linkedin';
import { 
  signInWithEmailAndPassword,
  linkWithCredential,
  EmailAuthProvider,
  updateProfile
} from 'firebase/auth';
import { toast } from 'react-hot-toast';

export function useAuth() {
  const { user, setUser, loading } = useUser();
  const navigate = useNavigate();

  const signInWithLinkedIn = async () => {
    try {
      linkedInAuth.initiateAuth();
      // The actual auth handling will happen in the callback component
    } catch (error) {
      console.error('LinkedIn auth failed:', error);
      toast.error('LinkedIn authentication failed');
      throw error;
    }
  };

  const handleLinkedInCallback = async (code: string) => {
    try {
      const { isNewUser, email } = await linkedInAuth.handleCallback(code);
      
      if (isNewUser) {
        return { email, requiresPassword: true };
      }

      // Existing user - complete sign in
      if (auth.currentUser) {
        setUser({
          id: auth.currentUser.uid,
          email: auth.currentUser.email!,
          name: auth.currentUser.displayName || '',
          avatar: auth.currentUser.photoURL || undefined
        });
      }

      const redirectUrl = sessionStorage.getItem('postAuthRedirect');
      if (redirectUrl) {
        sessionStorage.removeItem('postAuthRedirect');
        navigate(redirectUrl);
      } else {
        navigate(`/profile/${auth.currentUser?.uid}`);
      }

      toast.success('Signed in successfully!');
      return { email, requiresPassword: false };

    } catch (error) {
      console.error('LinkedIn callback failed:', error);
      toast.error('LinkedIn authentication failed');
      throw error;
    }
  };

  const createPasswordAfterLinkedIn = async (email: string, password: string) => {
    try {
      if (!auth.currentUser) {
        throw new Error('No user found');
      }

      // Create email/password credential
      const credential = EmailAuthProvider.credential(email, password);
      
      // Link the credential to the current user
      await linkWithCredential(auth.currentUser, credential);

      // Update profile if needed
      if (!auth.currentUser.displayName || !auth.currentUser.photoURL) {
        await updateProfile(auth.currentUser, {
          displayName: auth.currentUser.displayName || email.split('@')[0],
          photoURL: auth.currentUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${email}`
        });
      }

      toast.success('Password created successfully!');
      navigate(`/profile/${auth.currentUser.uid}`);
    } catch (error) {
      console.error('Error creating password:', error);
      toast.error('Failed to create password');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser({
        id: result.user.uid,
        email: result.user.email!,
        name: result.user.displayName || '',
        avatar: result.user.photoURL || undefined
      });

      const redirectUrl = sessionStorage.getItem('postAuthRedirect');
      if (redirectUrl) {
        sessionStorage.removeItem('postAuthRedirect');
        navigate(redirectUrl);
      } else {
        navigate(`/profile/${result.user.uid}`);
      }

      toast.success('Signed in successfully!');
    } catch (error) {
      console.error('Sign in failed:', error);
      toast.error('Invalid email or password');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out failed:', error);
      toast.error('Failed to sign out');
    }
  };

  return {
    user,
    loading,
    signIn,
    signOut,
    signInWithLinkedIn,
    handleLinkedInCallback,
    createPasswordAfterLinkedIn,
    isAuthenticated: !!user,
  };
}