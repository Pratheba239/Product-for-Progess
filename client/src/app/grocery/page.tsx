'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, Archive, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { groceryApi } from '@/lib/api';

interface GroceryItem {
  id: string;
  item_name: string;
  is_checked: boolean;
}

const GroceryPage = () => {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await groceryApi.getAll('USER_01');
        setItems(res.data);
      } catch (err) {
        console.error('FETCH_FAILED:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const addItem = async () => {
    if (inputValue.trim()) {
      try {
        const res = await groceryApi.create({ item_name: inputValue.toUpperCase(), user_id: 'USER_01' });
        setItems([res.data, ...items]);
        setInputValue('');
      } catch (err) {
        console.error('ADD_FAILED:', err);
      }
    }
  };

  const toggleItem = async (id: string, currentStatus: boolean) => {
    try {
      await groceryApi.toggle(id, !currentStatus);
      setItems(items.map(item => item.id === id ? { ...item, is_checked: !currentStatus } : item));
    } catch (err) {
      console.error('TOGGLE_FAILED:', err);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await groceryApi.delete(id);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error('DELETE_FAILED:', err);
    }
  };

  return (
    <div className="resource-requisition">
      <header className="page-header">
        <h1 className="mono">RESOURCE_REQUISITION</h1>
        <p className="mono text-dim">INVENTORY_MANAGEMENT_MANIFEST_v0.8</p>
      </header>

      <div className="manifest-container">
        <div className="input-terminal neon-card">
          <Terminal size={18} className="text-glow-green" />
          <input 
            type="text" 
            placeholder="ADD_NEW_RESOURCE..." 
            className="mono"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
          />
          <button onClick={addItem} className="neon-btn green mono"><Plus size={16} /></button>
        </div>

        <div className="items-stream">
          <AnimatePresence>
            {items.map(item => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`item-node ${item.is_checked ? 'status-synced' : ''}`}
              >
                <div className="node-content" onClick={() => toggleItem(item.id, item.is_checked)}>
                  <div className="checkbox-glow">
                    {item.is_checked ? 
                      <CheckCircle size={18} className="text-glow-green" /> : 
                      <Circle size={18} className="text-dim" />
                    }
                  </div>
                  <span className="mono">{item.item_name}</span>
                </div>
                <button onClick={() => deleteItem(item.id)} className="purge-btn"><Trash2 size={16} /></button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .resource-requisition {
          max-width: 700px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .page-header {
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 1.5rem;
        }

        .manifest-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .input-terminal {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1rem 1.5rem;
        }

        .input-terminal input {
          flex: 1;
          background: none;
          border: none;
          color: var(--text-primary);
          outline: none;
          font-size: 1rem;
        }

        .items-stream {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .item-node {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem;
          background: var(--bg-secondary);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 4px;
          transition: all 0.2s;
        }

        .item-node:hover {
          border-color: rgba(57, 255, 20, 0.2);
          background: var(--bg-accent);
        }

        .node-content {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          cursor: pointer;
          flex: 1;
        }

        .checkbox-glow {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-node.status-synced span {
          text-decoration: line-through;
          color: var(--text-dim);
          opacity: 0.5;
        }

        .purge-btn {
          background: none;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          opacity: 0.3;
          transition: all 0.2s;
        }

        .purge-btn:hover { 
          color: var(--neon-red);
          opacity: 1;
          filter: drop-shadow(0 0 5px var(--neon-red));
        }

        .neon-btn.green { border-color: var(--neon-green); color: var(--neon-green); }
        .neon-btn:hover { box-shadow: 0 0 10px var(--neon-green-glow); background: rgba(57, 255, 20, 0.1); }
      `}</style>
    </div>
  );
};

export default GroceryPage;
