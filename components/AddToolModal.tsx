import React, { useState } from 'react';
import { Tool, AccessLevel, Department, User, ToolCredentials } from '../types';
import { CATEGORIES } from '../constants';
import { X, Sparkles, LayoutGrid } from './Icons';
import { analyzeToolInfo } from '../services/geminiService';

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tool: Omit<Tool, 'id'>) => void;
  currentUser: User;
}

const AddToolModal: React.FC<AddToolModalProps> = ({ isOpen, onClose, onAdd, currentUser }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [accessLevel, setAccessLevel] = useState<AccessLevel>(AccessLevel.PRIVATE);
  const [credentials, setCredentials] = useState<ToolCredentials>({ username: '', password: '', notes: '' });
  const [tags, setTags] = useState<string>('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleAiFill = async () => {
    if (!name && !url) return;
    setIsAnalyzing(true);
    const suggestion = await analyzeToolInfo(name, url);
    setIsAnalyzing(false);

    if (suggestion) {
      setDescription(suggestion.description);
      setCategory(suggestion.category);
      setTags(suggestion.tags.join(', '));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    
    onAdd({
      name,
      url,
      description,
      category,
      accessLevel,
      department: currentUser.department, // Default to user's department if level is DEPARTMENT
      createdBy: currentUser.id,
      tags: tagArray,
      credentials
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Add New Tool</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tool Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Replit"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input 
                  type="url" 
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              {/* AI Trigger */}
              <button 
                type="button"
                onClick={handleAiFill}
                disabled={isAnalyzing || (!name && !url)}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors ${isAnalyzing ? 'opacity-75 cursor-wait' : ''}`}
              >
                <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-pulse' : ''}`} />
                {isAnalyzing ? 'Analyzing...' : 'Auto-fill Details with AI'}
              </button>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sharing & Access</label>
                <div className="grid grid-cols-3 gap-2">
                  {[AccessLevel.PRIVATE, AccessLevel.DEPARTMENT, AccessLevel.PUBLIC].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setAccessLevel(level)}
                      className={`px-2 py-2 text-xs font-medium rounded-lg border ${
                        accessLevel === level 
                          ? 'bg-gray-900 text-white border-gray-900' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {level === AccessLevel.DEPARTMENT ? 'Department' : level}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {accessLevel === AccessLevel.PRIVATE && "Only you can see this."}
                  {accessLevel === AccessLevel.DEPARTMENT && `Visible to ${currentUser.department} team.`}
                  {accessLevel === AccessLevel.PUBLIC && "Visible to everyone in NexusHub."}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none h-24 resize-none"
                  placeholder="What is this tool used for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credentials (Optional)</label>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                  <input 
                    type="text" 
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                    placeholder="Username / Email"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  />
                  <input 
                    type="password" 
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  />
                  <input 
                    type="text" 
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                    placeholder="Notes (e.g. 'Use VPN')"
                    value={credentials.notes}
                    onChange={(e) => setCredentials({...credentials, notes: e.target.value})}
                  />
                  <p className="text-[10px] text-gray-400 text-center">
                    Note: Stored locally for this demo.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="cloud, finance, urgent"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium shadow-md shadow-indigo-200 transition-colors"
            >
              Add Tool
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddToolModal;