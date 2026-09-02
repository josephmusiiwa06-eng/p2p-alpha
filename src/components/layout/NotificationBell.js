'use client';
import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const dropdownRef = useRef(null);

  const fetchItems = async () => {
    const res = await fetch('/api/notifications');
    if (res.ok) {
      const data = await res.json();
      setItems(data);
    }
  };

  const markRead = async (id, collection) => {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, collection }),
    });
    // Optimistically remove
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleToggle = () => {
    setOpen((o) => !o);
  };

  useEffect(() => {
    if (open) fetchItems();
  }, [open]);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <Bell size={20} onClick={handleToggle} style={{ cursor: 'pointer' }} />
      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: 'calc(100% + 4px)',
          background: '#FFF9F5',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: '8px',
          width: '300px',
          maxHeight: '400px',
          overflowY: 'auto',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
        }}>
          {items.length === 0 ? (
            <div style={{ padding: '12px', textAlign: 'center', color: '#9090A8' }}>No new notifications</div>
          ) : (
            items.map((it) => (
              <div key={it.id} style={{ padding: '8px 12px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{it.title || it.summary || 'Untitled'}</span>
                <button onClick={() => markRead(it.id, it.collection)} style={{ background: 'transparent', border: 'none', color: '#FF6B00', cursor: 'pointer' }}>Mark read</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
