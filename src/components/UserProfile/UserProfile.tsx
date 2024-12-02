import { useState } from 'react';
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle } from "../ui/alert-dialog";
import { toast } from 'react-hot-toast';
import { User } from '../../types/user';
import { ProfileContent } from './ProfileContent';
import { SettingsContent } from './SettingsContent';

// Mock user data for development
const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  bio: "Software Engineer with 5+ years of experience",
  title: "Senior Software Engineer",
  avatar: "/placeholder.svg",
  skills: [
    { name: "React", type: "hard" },
    { name: "TypeScript", type: "hard" },
    { name: "Leadership", type: "soft" }
  ],
  resumeUrl: "https://example.com/resume.pdf",
  portfolioItems: [
    {
      type: "Project",
      name: "E-commerce Platform",
      url: "https://github.com/johndoe/ecommerce"
    }
  ]
};

export function UserProfile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [pendingTabChange, setPendingTabChange] = useState<string | null>(null);
  const [user, setUser] = useState<User>(mockUser);

  const handleTabChange = (value: string) => {
    if (hasUnsavedChanges) {
      setShowAlertDialog(true);
      setPendingTabChange(value);
    } else {
      setActiveTab(value);
    }
  };

  const handleSaveSettings = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          setHasUnsavedChanges(false);
          if (pendingTabChange) {
            setActiveTab(pendingTabChange);
            setPendingTabChange(null);
          }
          resolve(null);
        }, 1000);
      }),
      {
        loading: 'Saving changes...',
        success: 'Changes saved successfully!',
        error: 'Failed to save changes',
      }
    );
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileContent user={user} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsContent 
              user={user}
              onUpdateUser={handleUpdateUser}
              hasUnsavedChanges={hasUnsavedChanges}
              onSave={handleSaveSettings}
            />
          </TabsContent>
        </Tabs>

        <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
          <AlertDialogContent>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Do you want to save them before leaving?
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setHasUnsavedChanges(false);
                if (pendingTabChange) {
                  setActiveTab(pendingTabChange);
                  setPendingTabChange(null);
                }
                setShowAlertDialog(false);
              }}>
                Discard
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleSaveSettings}>
                Save Changes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}