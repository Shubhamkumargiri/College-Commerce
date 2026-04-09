import { useEffect, useMemo, useState } from 'react';
import { SendHorizonal } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { formatDateTime } from './chatUtils';
import ProfileAvatar from '../components/ProfileAvatar';
import { toArray } from '../lib/collections';

export default function ChatPage() {
  const { userId } = useParams();
  const { socket, user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    loadConversations();
    loadUsers();
  }, []);

  useEffect(() => {
    if (userId) {
      openConversation(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (!socket || !activeConversation?.room) return;

    socket.emit('join_room', activeConversation.room);

    const handler = (message) => {
      setActiveConversation((current) => {
        if (!current || current.room !== message.room) return current;
        return { ...current, messages: [...current.messages, message] };
      });
      loadConversations();
    };

    socket.on('receive_message', handler);
    return () => socket.off('receive_message', handler);
  }, [socket, activeConversation?.room]);

  async function loadConversations() {
    try {
      const { data } = await api.get('/messages');
      const nextConversations = toArray(data);
      setConversations(nextConversations);
      if (!activeConversation && nextConversations[0]) {
        openConversation(nextConversations[0].user._id);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function openConversation(targetUserId) {
    try {
      const { data } = await api.get(`/messages/${targetUserId}`);
      setActiveConversation(data ? {
        ...data,
        messages: toArray(data.messages),
      } : null);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadUsers() {
    try {
      const { data } = await api.get('/users');
      setUsers(toArray(data));
    } catch (error) {
      console.error(error);
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversation?.partner?._id) return;

    try {
      const { data } = await api.post('/messages', {
        receiver: activeConversation.partner._id,
        content: messageInput,
      });

      setActiveConversation((current) => ({
        ...current,
        messages: [...current.messages, data],
      }));
      setMessageInput('');
      loadConversations();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to send message');
    }
  }

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    if (!query) return toArray(users);
    return toArray(users).filter((item) => (
      item.name?.toLowerCase().includes(query)
      || item.email?.toLowerCase().includes(query)
      || item.campus?.toLowerCase().includes(query)
    ));
  }, [users, userSearch]);

  return (
    <div className="grid min-h-[70vh] gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="rounded-[36px] border border-slate-200 bg-white/90 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <h1 className="text-2xl font-semibold text-slate-950">Chat</h1>
        <p className="mt-2 text-sm text-slate-500">Search any user and start a conversation.</p>

        <div className="mt-5 space-y-3">
          <input
            className="input-field"
            placeholder="Search people..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
          <div className="space-y-2 rounded-[28px] border border-slate-100 bg-slate-50 p-3">
            <p className="px-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">People</p>
            {filteredUsers.length ? filteredUsers.map((item) => (
              <button
                key={item._id}
                onClick={() => openConversation(item._id)}
                className="flex w-full items-center gap-3 rounded-[20px] px-2 py-2 text-left transition hover:bg-white"
              >
                <ProfileAvatar user={item} size={40} fallbackClassName="bg-gradient-to-br from-slate-950 to-emerald-600" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-950">{item.name}</p>
                  <p className="truncate text-xs text-slate-500">{item.campus}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Chat</span>
              </button>
            )) : (
              <p className="px-1 py-3 text-sm text-slate-500">No people found.</p>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Recent chats</h2>
          {toArray(conversations).map((item) => (
            <button key={item.user._id} onClick={() => openConversation(item.user._id)} className="flex w-full items-center gap-3 rounded-[24px] border border-slate-100 p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50">
              <ProfileAvatar user={item.user} size={48} fallbackClassName="bg-gradient-to-br from-slate-950 to-emerald-600" />
              <div className="min-w-0">
                <p className="font-semibold text-slate-950">{item.user.name}</p>
                <p className="truncate text-sm text-slate-500">{item.latestMessage?.content}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section className="flex flex-col rounded-[36px] border border-slate-200 bg-white/90 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        {activeConversation ? (
          <>
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <ProfileAvatar user={activeConversation.partner} size={48} fallbackClassName="bg-gradient-to-br from-slate-950 to-emerald-600" />
              <div>
                <p className="font-semibold text-slate-950">{activeConversation.partner.name}</p>
                <p className="text-sm text-slate-500">Live chat with a campus user</p>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-auto py-6">
              {toArray(activeConversation.messages).map((message) => {
                const isOwn = message.sender?._id === user?._id;
                return (
                  <div key={message._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xl rounded-[24px] px-4 py-3 ${isOwn ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-800'}`}>
                      <p>{message.content}</p>
                      <p className={`mt-2 text-xs ${isOwn ? 'text-slate-300' : 'text-slate-500'}`}>{formatDateTime(message.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={sendMessage} className="flex gap-3 border-t border-slate-100 pt-4">
              <input className="input-field flex-1" placeholder="Type your message..." value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
              <button className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800">
                <SendHorizonal size={18} />
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="grid flex-1 place-items-center text-slate-500">Pick a person on the left or start from a product page.</div>
        )}
      </section>
    </div>
  );
}
