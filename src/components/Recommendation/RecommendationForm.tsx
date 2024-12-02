import { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Star } from 'lucide-react';
import { cn } from "@/lib/utils";
import { SkillSelector } from './SkillSelector';
import { SupportingDocuments } from './SupportingDocuments';

interface RecommendationFormProps {
  currentUser: {
    name: string;
    linkedin?: string;
  };
  targetUser: {
    id: string;
    name: string;
  };
  formData: {
    relationship: string;
    company: string;
    duration: string;
    endorsement: string;
    rating: number;
    skills: Array<{ name: string; type: 'soft' | 'hard' }>;
    documents: File[];
    portfolioItems: Array<{ type: string; name: string; url?: string }>;
  };
  onFormDataChange: (data: any) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function RecommendationForm({
  currentUser,
  targetUser,
  formData,
  onFormDataChange,
  onSubmit,
  submitting
}: RecommendationFormProps) {
  const [characterCount, setCharacterCount] = useState(0);

  const handleEndorsementChange = (value: string) => {
    onFormDataChange({ ...formData, endorsement: value });
    setCharacterCount(value.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (characterCount < 750) {
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Your Name</Label>
          <Input value={currentUser.name} disabled />
        </div>
        {currentUser.linkedin && (
          <div className="space-y-2">
            <Label>Your LinkedIn</Label>
            <Input value={currentUser.linkedin} disabled />
          </div>
        )}
      </div>

      {/* Relationship */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Your Relationship to {targetUser.name}</Label>
          <Select 
            value={formData.relationship}
            onValueChange={(value) => onFormDataChange({ ...formData, relationship: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select relationship type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="colleague">Colleague</SelectItem>
              <SelectItem value="direct-report">Direct Report</SelectItem>
              <SelectItem value="client">Client</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Company/Organization</Label>
          <Input
            value={formData.company}
            onChange={(e) => onFormDataChange({ ...formData, company: e.target.value })}
            placeholder="Where did you work together?"
          />
        </div>

        <div className="space-y-2">
          <Label>Duration</Label>
          <Select
            value={formData.duration}
            onValueChange={(value) => onFormDataChange({ ...formData, duration: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="How long have you known them?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="less-than-1">Less than 1 year</SelectItem>
              <SelectItem value="1-2">1-2 years</SelectItem>
              <SelectItem value="2-5">2-5 years</SelectItem>
              <SelectItem value="5+">5+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Endorsement */}
      <div className="space-y-2">
        <Label>Endorsement</Label>
        <Textarea
          value={formData.endorsement}
          onChange={(e) => handleEndorsementChange(e.target.value)}
          placeholder="Write your endorsement here... (minimum 750 characters)"
          className="min-h-[200px]"
        />
        <p className="text-sm text-muted-foreground">
          {characterCount < 750 
            ? `${750 - characterCount} more characters needed` 
            : `${characterCount} characters (minimum met)`}
        </p>
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <Label>Rating</Label>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button
              key={rating}
              type="button"
              variant="ghost"
              size="lg"
              className={cn(
                "p-0 w-12 h-12",
                rating <= formData.rating ? "text-yellow-400" : "text-gray-300"
              )}
              onClick={() => onFormDataChange({ ...formData, rating })}
            >
              <Star className="w-8 h-8 fill-current" />
            </Button>
          ))}
        </div>
      </div>

      {/* Skills */}
      <SkillSelector
        skills={formData.skills}
        onSkillsChange={(skills) => onFormDataChange({ ...formData, skills })}
      />

      {/* Supporting Documents */}
      <SupportingDocuments
        documents={formData.documents}
        onDocumentsChange={(documents) => onFormDataChange({ ...formData, documents })}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={submitting || characterCount < 750}
        className="w-full bg-[#52789e] hover:bg-[#6b9cc3] text-white"
      >
        {submitting ? 'Submitting...' : 'Submit Recommendation'}
      </Button>
    </form>
  );
}