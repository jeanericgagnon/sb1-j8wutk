import { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from 'react-hot-toast';

interface AdditionalSectionSelectorProps {
  additionalSections: Array<{ title: string; content: string }>;
  onSectionAdd: (section: { title: string; content: string }) => void;
  isOpen: boolean;
  onClose: () => void;
}

const additionalSectionOptions = [
  "Values Alignment", "Long-Term Impact", "Areas for Development", "Client/Customer Feedback",
  "Collaboration with Leadership", "Contribution to Diversity & Inclusion", "Initiative and Innovation",
  "Contribution to Training/Onboarding", "Stakeholder Management", "Adaptability to Change"
];

const sectionDescriptions: { [key: string]: string } = {
  "Values Alignment": "How do they embody company values? Examples of integrity, teamwork, or innovation.",
  "Long-Term Impact": "What lasting contributions have they made? Projects or initiatives with enduring effects.",
  "Areas for Development": "Growth opportunities they're actively working on. Skills or areas they're improving.",
  "Client/Customer Feedback": "Direct feedback or testimonials from clients/customers about their work.",
  "Collaboration with Leadership": "How they interact with and influence leadership decisions.",
  "Contribution to Diversity & Inclusion": "Their role in creating an inclusive environment and supporting diversity.",
  "Initiative and Innovation": "Examples of proactive problem-solving and innovative solutions.",
  "Contribution to Training/Onboarding": "Their role in helping new team members and improving processes.",
  "Stakeholder Management": "How they handle relationships and balance different needs.",
  "Adaptability to Change": "Examples of adapting to new situations or leading through change."
};

export function AdditionalSectionSelector({
  additionalSections,
  onSectionAdd,
  isOpen,
  onClose
}: AdditionalSectionSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customTitle, setCustomTitle] = useState('');

  const filteredOptions = additionalSectionOptions.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !additionalSections.some(section => section.title.toLowerCase() === option.toLowerCase())
  );

  const handleAddSection = (title: string) => {
    if (additionalSections.length >= 3) {
      toast.error('You can only add up to 3 additional sections');
      return;
    }

    if (additionalSections.some(section => section.title === title)) {
      toast.error('This section already exists');
      return;
    }

    onSectionAdd({ title, content: '' });
    onClose();
    setSearchTerm('');
    setCustomTitle('');
    toast.success('Section added successfully!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Additional Section</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Search Sections</Label>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a section..."
            />
          </div>

          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <div className="space-y-4">
              {filteredOptions.map((option) => (
                <div key={option} className="space-y-2">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-accent px-3 py-1 text-sm font-medium rounded-full"
                    onClick={() => handleAddSection(option)}
                  >
                    {option}
                  </Badge>
                  <p className="text-sm text-muted-foreground pl-2">
                    {sectionDescriptions[option]}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="space-y-2">
            <Label>Custom Section Title</Label>
            <div className="flex space-x-2">
              <Input
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Enter custom section title..."
              />
              <Button
                onClick={() => {
                  if (customTitle.trim()) {
                    handleAddSection(customTitle.trim());
                  }
                }}
                className="bg-[#52789e] hover:bg-[#6b9cc3] text-white"
                disabled={!customTitle.trim()}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}