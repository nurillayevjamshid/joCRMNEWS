import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Phone, Video, MoreVertical, Paperclip, Smile, Send, ArrowLeft, Check, CheckCheck, MessageSquare, UserPlus, Tag, X, Loader2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SkeletonChatList } from './Skeleton';
import { EmptyMessages } from './EmptyState';

/* ── Types ─────────────────────────────────────────────────────── */

interface ChatContact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  online: boolean;
  assignee?: string;
  tag?: string;
}

interface ChatMessage {
  id: string;
  chatId: string;
  text: string;
  sender: string; // 'me' | uid
  time: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  createdAt?: any;
}

/* ── Seed data ─────────────────────────────────────────────────── */

const seedContacts: ChatContact[] = [
  { id: 'c1', name: 'Sardor Karimov', role: 'Marketing direktori', avatar: 'https://picsum.photos/seed/sardor/100/100', online: true, tag: 'Mijoz' },
  { id: 'c2', name: 'Jasur Rahimov', role: 'Mahsulot menejeri', avatar: 'https://picsum.photos/seed/jasur/100/100', online: true, tag: 'Jamoa' },
  { id: 'c3', name: 'Dilnoza Aliyeva', role: 'Mijoz', avatar: 'https://picsum.photos/seed/dilnoza/100/100', online: false, tag: 'Mijoz' },
  { id: 'c4', name: 'Bobur Toshmatov', role: 'Yetakchi dasturchi', avatar: 'https://picsum.photos/seed/bobur/100/100', online: false, tag: 'Jamoa' },
  { id: 'c5', name: 'Nodira Xasanova', role: 'Dizayner', avatar: 'https://picsum.photos/seed/nodira/100/100', online: true, tag: 'Jamoa' },
];

const seedMessages: Record<string, ChatMessage[]> = {
  c1: [
    { id: 'm1', chatId: 'c1', text: 'Salom, qandaysiz?', sender: 'them', time: '10:30', status: 'read' },
    { id: 'm2', chatId: 'c1', text: "Yaxshi, rahmat! O'zingiz-chi?", sender: 'me', time: '10:32', status: 'read' },
    { id: 'm3', chatId: 'c1', text: "Yaxshi! 3-chorak hisobini ko'ryapman.", sender: 'them', time: '10:35', status: 'read' },
    { id: 'm4', chatId: 'c1', text: "Uchrashuvni ertagaga ko'chira olamizmi?", sender: 'them', time: '10:42', status: 'delivered' },
  ],
  c2: [
    { id: 'm5', chatId: 'c2', text: "Yangi maketlarni ko'rdingizmi?", sender: 'them', time: '09:15', status: 'read' },
    { id: 'm6', chatId: 'c2', text: "Ha, endi ko'rib chiqdim.", sender: 'me', time: '09:20', status: 'read' },
    { id: 'm7', chatId: 'c2', text: "Yangi dizaynlar juda ajoyib ko'rinadi!", sender: 'them', time: '09:25', status: 'read' },
  ],
  c3: [
    { id: 'm8', chatId: 'c3', text: "Shartnomani yuborishingizni so'rayman.", sender: 'them', time: 'Kecha', status: 'read' },
  ],
};

const tagColors: Record<string, string> = {
  'Mijoz': 'bg-blue-50 text-blue-600 border-blue-200',
  'Jamoa': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  'Lid': 'bg-amber-50 text-amber-600 border-amber-200',
  'Hamkor': 'bg-purple-50 text-purple-600 border-purple-200',
};

const tagList = ['Mijoz', 'Jamoa', 'Lid', 'Hamkor'];

/* ── Auto-reply pool ───────────────────────────────────────────── */

const autoReplies = [
  'Tushundim, rahmat!',
  'Yaxshi, men tekshiraman.',
  'Ha, albatta!',
  'Bir oz kuting, hozir javob beraman.',
  "Ma'qul, kelishildi!",
  'Qo\'shimcha ma\'lumot bera olasizmi?',
  'Bu juda yaxshi xabar!',
  "Ertaga muhokama qilaylik.",
];

/* ── Component ─────────────────────────────────────────────────── */

export function Messages() {
  const { user } = useAuth();
  const { addToast } = useToast();

  /* State */
  const [contacts, setContacts] = useState<ChatContact[]>(seedContacts);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(seedMessages);
  const [activeContactId, setActiveContactId] = useState<string | null>('c1');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [typingContact, setTypingContact] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTarget, setAssignTarget] = useState<string | null>(null);
  const [showTagPicker, setShowTagPicker] = useState<string | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({ c1: 2 });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeContact = contacts.find(c => c.id === activeContactId) || null;
  const activeMessages = activeContactId ? (chatMessages[activeContactId] || []) : [];

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = (Object.values(unreadCounts) as number[]).reduce((a, b) => a + b, 0);

  /* Auto-scroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, typingContact]);

  /* ── Send message ────────────────────────────────────────────── */

  const handleSendMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeContactId) return;

    const msgId = Date.now().toString();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: msgId,
      chatId: activeContactId,
      text: messageInput.trim(),
      sender: 'me',
      time: timeStr,
      status: 'sent',
    };

    // Optimistic update
    setChatMessages(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMsg],
    }));
    setMessageInput('');
    inputRef.current?.focus();

    // Mark as delivered after 1s
    setTimeout(() => {
      setChatMessages(prev => ({
        ...prev,
        [activeContactId]: (prev[activeContactId] || []).map(m =>
          m.id === msgId ? { ...m, status: 'delivered' as const } : m
        ),
      }));
    }, 1000);

    // Mock realtime: auto-reply after 2-5s
    const delay = 2000 + Math.random() * 3000;
    setTimeout(() => {
      setTypingContact(activeContactId);
    }, delay - 1500);

    setTimeout(() => {
      setTypingContact(null);
      const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      const replyId = (Date.now() + 1).toString();
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const replyMsg: ChatMessage = {
        id: replyId,
        chatId: activeContactId,
        text: reply,
        sender: 'them',
        time: replyTime,
        status: 'read',
      };

      setChatMessages(prev => ({
        ...prev,
        [activeContactId]: [...(prev[activeContactId] || []), replyMsg],
      }));

      // Unread if chat not active
      if (activeContactId !== activeContactId) {
        setUnreadCounts(prev => ({
          ...prev,
          [activeContactId]: (prev[activeContactId] || 0) + 1,
        }));
      }

      // Mark my message as read
      setChatMessages(prev => ({
        ...prev,
        [activeContactId]: (prev[activeContactId] || []).map(m =>
          m.sender === 'me' && m.status !== 'read' ? { ...m, status: 'read' as const } : m
        ),
      }));
    }, delay);

  }, [messageInput, activeContactId]);

  /* ── Mark as read on open ─────────────────────────────────────── */

  useEffect(() => {
    if (activeContactId && unreadCounts[activeContactId]) {
      setUnreadCounts(prev => {
        const next = { ...prev };
        delete next[activeContactId];
        return next;
      });
    }
  }, [activeContactId]);

  /* ── Last message preview ─────────────────────────────────────── */

  const getLastMessage = (contactId: string) => {
    const msgs = chatMessages[contactId];
    if (!msgs || msgs.length === 0) return { text: 'Hali xabar yo\'q', time: '' };
    const last = msgs[msgs.length - 1];
    return { text: last.sender === 'me' ? `Siz: ${last.text}` : last.text, time: last.time };
  };

  /* ── Tag change ───────────────────────────────────────────────── */

  const handleTagChange = (contactId: string, tag: string) => {
    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, tag } : c));
    setShowTagPicker(null);
    addToast('success', `Teg o'zgartirildi: ${tag}`);
  };

  /* ── Assign ───────────────────────────────────────────────────── */

  const handleAssign = () => {
    if (!assignTarget) return;
    const assigneeName = user?.displayName || user?.email?.split('@')[0] || 'Admin';
    setContacts(prev => prev.map(c => c.id === assignTarget ? { ...c, assignee: assigneeName } : c));
    setShowAssignModal(false);
    setAssignTarget(null);
    addToast('success', `Suhbat ${assigneeName} ga biriktirildi`);
  };

  /* ── Group by tag ─────────────────────────────────────────────── */

  const groupedContacts = () => {
    if (!searchQuery) return filteredContacts;
    return filteredContacts;
  };

  /* ── Render ───────────────────────────────────────────────────── */

  return (
    <div className="max-w-7xl mx-auto w-full h-[calc(100vh-8rem)] min-h-[600px] animate-in fade-in duration-500 flex gap-6 relative">

      {/* ─── Chat List ──────────────────────────────────────────── */}
      <div className={`
        ${activeContactId ? 'hidden md:flex' : 'flex'}
        w-full md:w-80 lg:w-96 bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 flex-col h-full overflow-hidden
      `}>
        {/* Header */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-display font-bold text-surface-900 tracking-tight">Xabarlar</h2>
            {totalUnread > 0 && (
              <span className="bg-brand-50 text-brand-600 text-xs font-bold px-2.5 py-1 rounded-full">
                {totalUnread} yangi
              </span>
            )}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Xabarlarni qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
          {groupedContacts().map(contact => {
            const last = getLastMessage(contact.id);
            const unread = unreadCounts[contact.id] || 0;
            const isTyping = typingContact === contact.id;

            return (
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
                    <h4 className={`text-sm truncate pr-2 ${unread ? 'font-bold text-surface-900' : 'font-semibold text-slate-700'}`}>
                      {contact.name}
                    </h4>
                    <span className={`text-[10px] whitespace-nowrap ${unread ? 'font-bold text-brand-600' : 'font-medium text-slate-400'}`}>
                      {last.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs truncate ${unread ? 'text-surface-900 font-medium' : 'text-slate-500'} ${isTyping ? 'text-brand-600 italic' : ''}`}>
                      {isTyping ? 'yozmoqda...' : last.text}
                    </p>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {contact.tag && (
                        <span className={`hidden lg:inline-flex text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${tagColors[contact.tag] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                          {contact.tag}
                        </span>
                      )}
                      {unread > 0 && (
                        <span className="w-4 h-4 bg-brand-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                          {unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Chat Area ──────────────────────────────────────────── */}
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
                  <p className="text-xs text-slate-500">
                    {typingContact === activeContact.id
                      ? <span className="text-brand-600 italic">yozmoqda...</span>
                      : activeContact.online ? 'Hozir onlayn' : activeContact.role}
                  </p>
                </div>
                {/* Tag badge */}
                {activeContact.tag && (
                  <span className={`hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full border ${tagColors[activeContact.tag] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    {activeContact.tag}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Tag picker */}
                <div className="relative">
                  <button
                    onClick={() => setShowTagPicker(showTagPicker === activeContact.id ? null : activeContact.id)}
                    className="p-2.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
                    title="Teg o'zgartirish"
                  >
                    <Tag className="w-4 h-4" />
                  </button>
                  {showTagPicker === activeContact.id && (
                    <div className="absolute right-0 top-10 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-30 min-w-[120px]">
                      {tagList.map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleTagChange(activeContact.id, tag)}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 transition-colors ${activeContact.tag === tag ? 'font-bold text-brand-600' : 'text-slate-700'}`}
                        >
                          <span className={`w-2 h-2 rounded-full ${tagColors[tag]?.split(' ')[0] || 'bg-slate-300'}`} />
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Assign button */}
                <button
                  onClick={() => { setAssignTarget(activeContact.id); setShowAssignModal(true); }}
                  className="p-2.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
                  title="Biriktirish"
                >
                  <UserPlus className="w-4 h-4" />
                </button>

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

            {/* Assignee bar */}
            {activeContact.assignee && (
              <div className="px-6 py-2 bg-brand-50/50 border-b border-brand-100 flex items-center gap-2 text-xs text-brand-700">
                <UserPlus className="w-3.5 h-3.5" />
                <span>Biriktirilgan: <strong>{activeContact.assignee}</strong></span>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/30">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center my-2">
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Bugun
                  </span>
                </div>

                {activeMessages.length > 0 ? (
                  activeMessages.map((msg) => {
                    const isMe = msg.sender === 'me';
                    return (
                      <div key={msg.id} className={`flex flex-col animate-scale-in ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`
                          max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                          ${isMe
                            ? 'bg-brand-600 text-white rounded-br-sm'
                            : 'bg-white border border-slate-100 text-surface-900 shadow-sm shadow-slate-200/10 rounded-bl-sm'}
                        `}>
                          {msg.text}
                        </div>
                        <div className="flex items-center gap-1 mt-1.5 px-1">
                          <span className="text-[10px] font-medium text-slate-400">{msg.time}</span>
                          {isMe && (
                            msg.status === 'read' ? <CheckCheck className="w-3 h-3 text-brand-500" />
                              : msg.status === 'delivered' ? <CheckCheck className="w-3 h-3 text-slate-400" />
                              : <Check className="w-3 h-3 text-slate-300" />
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
                    <h4 className="text-sm font-semibold text-surface-900">Hali xabar yo'q</h4>
                    <p className="text-xs text-slate-500 mt-1">Suhbatni boshlash uchun xabar yuboring.</p>
                  </div>
                )}

                {/* Typing indicator */}
                {typingContact === activeContactId && (
                  <div className="flex items-start animate-fade-in">
                    <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <button type="button" className="p-3 text-slate-400 hover:text-surface-900 hover:bg-slate-50 rounded-xl transition-colors flex-shrink-0">
                  <Paperclip className="w-5 h-5" />
                </button>

                <div className="flex-1 relative bg-slate-50 border border-slate-200 rounded-2xl focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Xabar yozing..."
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
          <EmptyMessages />
        )}
      </div>

      {/* ─── Assign Modal ───────────────────────────────────────── */}
      {showAssignModal && assignTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-surface-900">Suhbatni biriktirish</h3>
              <button
                onClick={() => { setShowAssignModal(false); setAssignTarget(null); }}
                className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-500 mb-4">
                Siz bu suhbatni o'zingizga biriktirmoqchimisiz?
              </p>
              <p className="text-sm font-medium text-surface-900 mb-6">
                {contacts.find(c => c.id === assignTarget)?.name}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowAssignModal(false); setAssignTarget(null); }}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleAssign}
                  className="flex-1 px-4 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/20"
                >
                  Biriktirish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close tag picker */}
      {showTagPicker && (
        <div className="fixed inset-0 z-20" onClick={() => setShowTagPicker(null)} />
      )}
    </div>
  );
}
