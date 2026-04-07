import React, { useState } from 'react';
import { Search, Phone, Video, MoreVertical, Paperclip, Smile, Send, ArrowLeft, Check, CheckCheck, MessageSquare } from 'lucide-react';

const initialContacts = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Marketing Director',
    avatar: 'https://picsum.photos/seed/sarah/100/100',
    lastMessage: 'Can we reschedule our meeting to tomorrow?',
    time: '10:42 AM',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Product Manager',
    avatar: 'https://picsum.photos/seed/michael/100/100',
    lastMessage: 'The new designs look absolutely fantastic!',
    time: 'Yesterday',
    unread: 0,
    online: true,
  },
  {
    id: 3,
    name: 'Emma Watson',
    role: 'Client',
    avatar: 'https://picsum.photos/seed/emma/100/100',
    lastMessage: 'Please send over the contract when you have a moment.',
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
  {
    id: 4,
    name: 'David Miller',
    role: 'Lead Developer',
    avatar: 'https://picsum.photos/seed/david/100/100',
    lastMessage: 'API integration is complete. Ready for testing.',
    time: 'Tuesday',
    unread: 0,
    online: false,
  },
  {
    id: 5,
    name: 'Jessica Parker',
    role: 'Designer',
    avatar: 'https://picsum.photos/seed/jessica/100/100',
    lastMessage: 'I uploaded the new assets to Figma.',
    time: 'Monday',
    unread: 0,
    online: true,
  }
];

const initialMessages: Record<number, any[]> = {
  1: [
    { id: 1, text: 'Hi Alex, how are you?', sender: 'them', time: '10:30 AM', status: 'read' },
    { id: 2, text: 'I am doing great, thanks! How about you?', sender: 'me', time: '10:32 AM', status: 'read' },
    { id: 3, text: 'Good! I was looking at the Q3 report.', sender: 'them', time: '10:35 AM', status: 'read' },
    { id: 4, text: 'Can we reschedule our meeting to tomorrow?', sender: 'them', time: '10:42 AM', status: 'delivered' },
  ],
  2: [
    { id: 1, text: 'Hey Alex, did you see the new mockups?', sender: 'them', time: 'Yesterday', status: 'read' },
    { id: 2, text: 'Yes, I just reviewed them.', sender: 'me', time: 'Yesterday', status: 'read' },
    { id: 3, text: 'The new designs look absolutely fantastic!', sender: 'them', time: 'Yesterday', status: 'read' },
  ]
};

export function Messages() {
  const [activeContactId, setActiveContactId] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState(initialMessages);

  const activeContact = initialContacts.find(c => c.id === activeContactId);
  const activeMessages = activeContactId ? (messages[activeContactId] || []) : [];

  const filteredContacts = initialContacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeContactId) return;

    const newMessage = {
      id: Date.now(),
      text: messageInput,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMessage]
    }));
    setMessageInput('');
  };

  return (
    <div className="max-w-7xl mx-auto w-full h-[calc(100vh-8rem)] min-h-[600px] animate-in fade-in duration-500 flex gap-6">
      
      {/* Left Sidebar - Contact List */}
      <div className={`
        ${activeContactId ? 'hidden md:flex' : 'flex'} 
        w-full md:w-80 lg:w-96 bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 flex-col h-full overflow-hidden
      `}>
        {/* Header & Search */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-display font-bold text-surface-900 tracking-tight">Messages</h2>
            <span className="bg-brand-50 text-brand-600 text-xs font-bold px-2.5 py-1 rounded-full">
              2 New
            </span>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
          {filteredContacts.map(contact => (
            <button
              key={contact.id}
              onClick={() => setActiveContactId(contact.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left group ${
                activeContactId === contact.id 
                  ? 'bg-brand-50 border border-brand-100/50' 
                  : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="relative flex-shrink-0">
                <img 
                  src={contact.avatar} 
                  alt={contact.name} 
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                {contact.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className={`text-sm truncate pr-2 ${contact.unread ? 'font-bold text-surface-900' : 'font-semibold text-slate-700'}`}>
                    {contact.name}
                  </h4>
                  <span className={`text-[10px] whitespace-nowrap ${contact.unread ? 'font-bold text-brand-600' : 'font-medium text-slate-400'}`}>
                    {contact.time}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-xs truncate ${contact.unread ? 'text-surface-900 font-medium' : 'text-slate-500'}`}>
                    {contact.lastMessage}
                  </p>
                  {contact.unread > 0 && (
                    <span className="flex-shrink-0 w-4 h-4 bg-brand-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Area - Active Chat */}
      <div className={`
        ${!activeContactId ? 'hidden md:flex' : 'flex'} 
        flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 flex-col h-full overflow-hidden relative
      `}>
        {activeContact ? (
          <>
            {/* Chat Header */}
            <div className="h-20 px-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-sm z-10">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveContactId(null)}
                  className="md:hidden p-2 -ml-2 text-slate-400 hover:text-surface-900 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative">
                  <img 
                    src={activeContact.avatar} 
                    alt={activeContact.name} 
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  {activeContact.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-surface-900">{activeContact.name}</h3>
                  <p className="text-xs text-slate-500">{activeContact.online ? 'Online now' : activeContact.role}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors">
                  <Video className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-slate-200 mx-1"></div>
                <button className="p-2.5 text-slate-400 hover:text-surface-900 hover:bg-slate-50 rounded-xl transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/30">
              <div className="flex flex-col gap-4">
                {/* Date Divider */}
                <div className="flex items-center justify-center my-2">
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Today
                  </span>
                </div>

                {activeMessages.length > 0 ? (
                  activeMessages.map((msg) => {
                    const isMe = msg.sender === 'me';
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`
                          max-w-[75%] px-4 py-2.5 rounded-2xl text-sm
                          ${isMe 
                            ? 'bg-brand-600 text-white rounded-br-sm' 
                            : 'bg-white border border-slate-100 text-surface-900 shadow-sm shadow-slate-200/10 rounded-bl-sm'}
                        `}>
                          {msg.text}
                        </div>
                        <div className="flex items-center gap-1 mt-1.5 px-1">
                          <span className="text-[10px] font-medium text-slate-400">{msg.time}</span>
                          {isMe && (
                            msg.status === 'read' ? <CheckCheck className="w-3 h-3 text-brand-500" /> : <Check className="w-3 h-3 text-slate-400" />
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 mt-10">
                    <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 flex items-center justify-center mb-4 shadow-sm">
                      <MessageSquare className="w-8 h-8 text-slate-300" />
                    </div>
                    <h4 className="text-sm font-semibold text-surface-900">No messages yet</h4>
                    <p className="text-xs text-slate-500 mt-1">Send a message to start the conversation.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <button type="button" className="p-3 text-slate-400 hover:text-surface-900 hover:bg-slate-50 rounded-xl transition-colors flex-shrink-0">
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <div className="flex-1 relative bg-slate-50 border border-slate-200 rounded-2xl focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all flex items-center">
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="w-full bg-transparent px-4 py-3 text-sm focus:outline-none"
                  />
                  <button type="button" className="p-2 mr-1 text-slate-400 hover:text-amber-500 transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>

                <button 
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="p-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-sm shadow-brand-500/20"
                >
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
              <MessageSquare className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-xl font-display font-bold text-surface-900">Your Messages</h2>
            <p className="text-sm text-slate-500 mt-2">Select a conversation from the list to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
