import { useState, useEffect } from 'react';
import { User } from '../../types/user';
import { Reference } from '../../types/reference';
import { ProfileHeader } from './ProfileHeader';
import { SkillsSection } from './SkillsSection';
import { PortfolioSection } from './PortfolioSection';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { RecommendationPreview } from '../RecommendationPreview';
import { recommendationApi } from '../../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

interface ProfileContentProps {
  user: User;
}

export function ProfileContent({ user }: ProfileContentProps): JSX.Element {
  const { user: currentUser } = useAuth();
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('approved');
  const isOwner = currentUser?.id === user.id;

  useEffect(() => {
    const loadReferences = async () => {
      try {
        setLoading(true);
        const refs = await recommendationApi.getUserRecommendations(user.id);
        console.log('Loaded references:', refs);
        setReferences(refs);
        
        // If there are pending references and user is owner, switch to pending tab
        if (isOwner && refs.some(ref => ref.status === 'pending')) {
          setActiveTab('pending');
        }
      } catch (err) {
        console.error('Error loading references:', err);
        toast.error('Unable to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    loadReferences();
  }, [user.id, isOwner]);

  const handleAcceptReference = async (referenceId: string) => {
    try {
      await recommendationApi.updateRecommendationStatus(referenceId, 'approved');
      const updatedRefs = references.map(ref => 
        ref.id === referenceId ? { ...ref, status: 'approved' } : ref
      );
      setReferences(updatedRefs);
      toast.success('Reference approved successfully');
    } catch (error) {
      console.error('Error accepting reference:', error);
      toast.error('Failed to approve reference');
    }
  };

  const handleDenyReference = async (referenceId: string) => {
    try {
      await recommendationApi.updateRecommendationStatus(referenceId, 'rejected');
      setReferences(references.filter(ref => ref.id !== referenceId));
      toast.success('Reference denied successfully');
    } catch (error) {
      console.error('Error denying reference:', error);
      toast.error('Failed to deny reference');
    }
  };

  const pendingReferences = references.filter(ref => ref.status === 'pending');
  const approvedReferences = references.filter(ref => ref.status === 'approved');

  return (
    <div className="space-y-8">
      <ProfileHeader user={user} isOwner={isOwner} />
      
      {user.skills && user.skills.length > 0 && (
        <SkillsSection skills={user.skills} />
      )}
      
      {(user.resumeUrl || (user.portfolioItems && user.portfolioItems.length > 0)) && (
        <PortfolioSection 
          items={user.portfolioItems || []} 
          resumeUrl={user.resumeUrl}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>References</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="approved" className="flex-1">
                  Approved ({approvedReferences.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex-1">
                  Pending ({pendingReferences.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="approved" className="mt-4">
                <div className="space-y-4">
                  {approvedReferences.length > 0 ? (
                    approvedReferences.map((reference) => (
                      <RecommendationPreview
                        key={reference.id}
                        recommendation={reference}
                      />
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      No approved references yet
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="pending" className="mt-4">
                <div className="space-y-4">
                  {isOwner ? (
                    pendingReferences.length > 0 ? (
                      pendingReferences.map((reference) => (
                        <RecommendationPreview
                          key={reference.id}
                          recommendation={reference}
                          onApprove={() => handleAcceptReference(reference.id)}
                          onDecline={() => handleDenyReference(reference.id)}
                          isPending
                        />
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        No pending references
                      </p>
                    )
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      You don't have access to view pending references
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}