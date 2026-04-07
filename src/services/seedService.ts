import { dataService } from "./dataService";

const seedData = {
  customers: [
    { name: 'Eleanor Pena', email: 'eleanor@mailchimp.com', company: 'Mailchimp', status: 'Active', spent: '$12,500', joined: 'Oct 24, 2024', avatar: 'https://picsum.photos/seed/eleanor/100/100' },
    { name: 'Guy Hawkins', email: 'guy@gillette.com', company: 'Gillette', status: 'Active', spent: '$8,200', joined: 'Nov 12, 2024', avatar: 'https://picsum.photos/seed/guy/100/100' },
    { name: 'Jerome Bell', email: 'jerome@google.com', company: 'Google', status: 'Inactive', spent: '$45,000', joined: 'Jan 05, 2025', avatar: 'https://picsum.photos/seed/jerome/100/100' },
    { name: 'Kathryn Murphy', email: 'kathryn@apple.com', company: 'Apple', status: 'Active', spent: '$3,400', joined: 'Feb 18, 2025', avatar: 'https://picsum.photos/seed/kathryn/100/100' },
    { name: 'Jacob Jones', email: 'jacob@spotify.com', company: 'Spotify', status: 'Active', spent: '$18,900', joined: 'Mar 02, 2025', avatar: 'https://picsum.photos/seed/jacob/100/100' },
    { name: 'Kristin Watson', email: 'kristin@microsoft.com', company: 'Microsoft', status: 'Inactive', spent: '$2,100', joined: 'Mar 15, 2025', avatar: 'https://picsum.photos/seed/kristin/100/100' }
  ],
  projects: [
    { title: 'E-commerce Redesign', client: 'Mailchimp', status: 'In Progress', progress: 65, dueDate: 'Oct 24, 2025', team: ['https://picsum.photos/seed/eleanor/100/100', 'https://picsum.photos/seed/guy/100/100', 'https://picsum.photos/seed/jerome/100/100'] },
    { title: 'Mobile App Development', client: 'Gillette', status: 'Planning', progress: 15, dueDate: 'Nov 12, 2025', team: ['https://picsum.photos/seed/kathryn/100/100', 'https://picsum.photos/seed/jacob/100/100'] },
    { title: 'Marketing Campaign', client: 'Google', status: 'Completed', progress: 100, dueDate: 'Jan 05, 2025', team: ['https://picsum.photos/seed/kristin/100/100', 'https://picsum.photos/seed/cody/100/100'] },
    { title: 'Brand Identity', client: 'Apple', status: 'On Hold', progress: 45, dueDate: 'Feb 18, 2025', team: ['https://picsum.photos/seed/guy/100/100'] },
    { title: 'CRM Integration', client: 'Spotify', status: 'In Progress', progress: 80, dueDate: 'Mar 02, 2025', team: ['https://picsum.photos/seed/jerome/100/100', 'https://picsum.photos/seed/jacob/100/100'] }
  ],
  tasks: [
    { title: 'Review Q3 Marketing Strategy', time: 'Today, 2:00 PM', status: 'pending', priority: 'high' },
    { title: 'Client meeting with Apple Inc.', time: 'Today, 4:30 PM', status: 'completed', priority: 'medium' },
    { title: 'Send proposal to Mailchimp', time: 'Tomorrow, 10:00 AM', status: 'pending', priority: 'high' },
    { title: 'Update CRM contact list', time: 'Tomorrow, 1:00 PM', status: 'pending', priority: 'low' }
  ],
  leads: [
    { name: 'Eleanor Pena', company: 'Mailchimp', email: 'eleanor@mailchimp.com', status: 'New', amount: '$12,500', avatar: 'https://picsum.photos/seed/eleanor/100/100' },
    { name: 'Guy Hawkins', company: 'Gillette', email: 'guy@gillette.com', status: 'In Progress', amount: '$8,200', avatar: 'https://picsum.photos/seed/guy/100/100' },
    { name: 'Jerome Bell', company: 'Google', email: 'jerome@google.com', status: 'Won', amount: '$45,000', avatar: 'https://picsum.photos/seed/jerome/100/100' },
    { name: 'Kathryn Murphy', company: 'Apple', email: 'kathryn@apple.com', status: 'Lost', amount: '$3,400', avatar: 'https://picsum.photos/seed/kathryn/100/100' }
  ],
  messages: [
    { name: 'Sarah Jenkins', message: 'Can we reschedule our meeting to tomorrow?', time: '10m ago', unread: true, avatar: 'https://picsum.photos/seed/sarah/100/100' },
    { name: 'Michael Chen', message: 'The new designs look absolutely fantastic!', time: '1h ago', unread: true, avatar: 'https://picsum.photos/seed/michael/100/100' },
    { name: 'Emma Watson', message: 'Please send over the contract when you have a moment.', time: '3h ago', unread: false, avatar: 'https://picsum.photos/seed/emma/100/100' }
  ]
};

export const seedService = {
  isSeeding: false,

  async runSeeder() {
    if (this.isSeeding) return;
    this.isSeeding = true;
    
    try {
      console.log("Starting Firebase seeding...");
      
      const collections = Object.keys(seedData) as (keyof typeof seedData)[];
      
      for (const collectionName of collections) {
        const items = seedData[collectionName];
        for (const item of items) {
          // Saving to firebase using our dataservice
          await dataService.saveData(collectionName, item);
        }
        console.log(`✅ Seeded ${collectionName} with ${items.length} records.`);
      }

      console.log("Seeding complete! You can refresh or let UI update automatically.");
      return { success: true };
    } catch (error) {
      console.error("Seeding failed:", error);
      return { success: false, error };
    } finally {
      this.isSeeding = false;
    }
  }
};
