import { User } from '../types/user';
import { Recommendation } from '../types/recommendation';

// Create a mock database in localStorage
const initializeMockDB = () => {
  if (!localStorage.getItem('mockUsers')) {
    localStorage.setItem('mockUsers', JSON.stringify([
      {
        id: "999",
        name: 'Demo User',
        email: 'demo@example.com',
        password: 'demo123',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
        title: 'Software Engineer',
        bio: 'Demo user account showcasing the platform features',
        linkedin: 'https://linkedin.com/in/demo-user',
        skills: [
          { name: "JavaScript", type: "hard" },
          { name: "React", type: "hard" },
          { name: "TypeScript", type: "hard" },
          { name: "Leadership", type: "soft" },
          { name: "Communication", type: "soft" }
        ],
        references: []
      },
      {
        id: "888",
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'jane123',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        title: 'Product Manager',
        bio: 'Experienced product manager focused on user-centric solutions',
        linkedin: 'https://linkedin.com/in/janesmith',
        skills: [
          { name: "Product Strategy", type: "hard" },
          { name: "Agile", type: "hard" },
          { name: "Leadership", type: "soft" }
        ],
        references: []
      }
    ]));
  }

  if (!localStorage.getItem('mockReferences')) {
    localStorage.setItem('mockReferences', JSON.stringify([]));
  }
};

initializeMockDB();

export const getMockUsers = (): User[] => {
  return JSON.parse(localStorage.getItem('mockUsers') || '[]');
};

export const getMockReferences = (): Recommendation[] => {
  return JSON.parse(localStorage.getItem('mockReferences') || '[]');
};

export const saveMockReference = (reference: Recommendation) => {
  const references = getMockReferences();
  references.push(reference);
  localStorage.setItem('mockReferences', JSON.stringify(references));

  const users = getMockUsers();
  const recipientIndex = users.findIndex(u => u.id === reference.recipient.id);
  if (recipientIndex !== -1) {
    if (!users[recipientIndex].references) {
      users[recipientIndex].references = [];
    }
    users[recipientIndex].references.push(reference);
    localStorage.setItem('mockUsers', JSON.stringify(users));
  }
};

export const updateMockReference = (referenceId: string, updates: Partial<Recommendation>) => {
  const references = getMockReferences();
  const index = references.findIndex(ref => ref.id === referenceId);
  if (index !== -1) {
    references[index] = { ...references[index], ...updates };
    localStorage.setItem('mockReferences', JSON.stringify(references));

    const users = getMockUsers();
    const recipientIndex = users.findIndex(u => u.id === references[index].recipient.id);
    if (recipientIndex !== -1) {
      const userReferences = users[recipientIndex].references || [];
      const refIndex = userReferences.findIndex(ref => ref.id === referenceId);
      if (refIndex !== -1) {
        userReferences[refIndex] = references[index];
        users[recipientIndex].references = userReferences;
        localStorage.setItem('mockUsers', JSON.stringify(users));
      }
    }
  }
};

export const mockUsers = getMockUsers();
export const mockReferences = getMockReferences();