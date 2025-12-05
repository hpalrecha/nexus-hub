import React, { useState, useMemo, useEffect } from 'react';
import { User, Tool, AccessLevel, Department } from './types';
import { MOCK_USERS, INITIAL_TOOLS, CATEGORIES, DEFAULT_DEPARTMENTS } from './constants';
import ToolCard from './components/ToolCard';
import AddToolModal from './components/AddToolModal';
import SettingsView from './components/SettingsView';
import { Search, Plus, LayoutGrid, Users, Settings } from './components/Icons';

const App: React.FC = () => {
  // --- State ---
  const [currentView, setCurrentView] = useState<'dashboard' | 'settings'>('dashboard');
  
  // Data State
  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('nexushub_departments');
    return saved ? JSON.parse(saved) : DEFAULT_DEPARTMENTS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('nexushub_users');
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  // Simulate auth (default to first user in list)
  const [currentUser, setCurrentUser] = useState<User>(users[0] || MOCK_USERS[0]);
  
  // Tools state
  const [tools, setTools] = useState<Tool[]>(() => {
    const saved = localStorage.getItem('nexushub_tools');
    return saved ? JSON.parse(saved) : INITIAL_TOOLS;
  });

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('nexushub_tools', JSON.stringify(tools));
  }, [tools]);

  useEffect(() => {
    localStorage.setItem('nexushub_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('nexushub_users', JSON.stringify(users));
  }, [users]);

  // --- Handlers ---
  const handleAddTool = (newToolData: Omit<Tool, 'id'>) => {
    const newTool: Tool = {
      ...newToolData,
      id: `t${Date.now()}`,
    };
    setTools(prev => [newTool, ...prev]);
  };

  const handleAddUser = (userData: Omit<User, 'id' | 'avatar'>) => {
    const newUser: User = {
      ...userData,
      id: `u${Date.now()}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`
    };
    setUsers(prev => [...prev, newUser]);
  };

  const handleRemoveUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleAddDepartment = (dept: string) => {
    setDepartments(prev => [...prev, dept]);
  };

  const handleRemoveDepartment = (dept: string) => {
    setDepartments(prev => prev.filter(d => d !== dept));
  };

  const switchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      // Reset view to dashboard when switching users usually
      setCurrentView('dashboard'); 
    }
  };

  // --- Filtering Logic ---
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      // 1. Access Control Check
      let hasAccess = false;
      if (tool.accessLevel === AccessLevel.PUBLIC) hasAccess = true;
      else if (tool.accessLevel === AccessLevel.DEPARTMENT && tool.department === currentUser.department) hasAccess = true;
      else if (tool.accessLevel === AccessLevel.PRIVATE && tool.createdBy === currentUser.id) hasAccess = true;
      
      // Admins see everything
      if (currentUser.isAdmin) hasAccess = true;

      if (!hasAccess) return false;

      // 2. Search Text
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      // 3. Category
      if (selectedCategory !== 'All' && tool.category !== selectedCategory) return false;

      return true;
    });
  }, [tools, currentUser, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-indigo-500 rounded-lg p-1.5 text-white">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">NexusHub</span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          <div>
            <h3 className="text-xs uppercase text-slate-500 font-semibold mb-3 px-2 tracking-wider">Menu</h3>
            <nav className="space-y-1">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${currentView === 'dashboard' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
              >
                <LayoutGrid className="w-4 h-4" />
                Dashboard
              </button>
              {currentUser.isAdmin && (
                <button 
                  onClick={() => setCurrentView('settings')}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${currentView === 'settings' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              )}
            </nav>
          </div>

          {currentView === 'dashboard' && (
            <div className="animate-in slide-in-from-left-4 duration-300">
              <h3 className="text-xs uppercase text-slate-500 font-semibold mb-3 px-2 tracking-wider">Categories</h3>
              <nav className="space-y-1">
                <button 
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${selectedCategory === 'All' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
                >
                  All Tools
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${selectedCategory === cat ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
                  >
                    {cat}
                  </button>
                ))}
              </nav>
            </div>
          )}

          <div>
             <h3 className="text-xs uppercase text-slate-500 font-semibold mb-3 px-2 tracking-wider">My Organization</h3>
             <div className="px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
               <div className="flex items-center gap-3 mb-2">
                 <img src={currentUser.avatar} alt="User" className="w-8 h-8 rounded-full border border-slate-600" />
                 <div>
                   <p className="text-sm font-medium text-white">{currentUser.name}</p>
                   <p className="text-xs text-slate-400">{currentUser.department}</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
        
        {/* User Switcher (For Demo) */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/30">
          <p className="text-xs text-slate-500 mb-2">Simulate Login:</p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {users.map(u => (
               <button 
                key={u.id} 
                onClick={() => switchUser(u.id)}
                title={`Switch to ${u.name} (${u.department})`}
                className={`flex-shrink-0 w-8 h-8 rounded-full border-2 overflow-hidden transition-all ${currentUser.id === u.id ? 'border-indigo-500 scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
               >
                 <img src={u.avatar} alt={u.name} className="w-full h-full object-cover"/>
               </button>
            ))}
          </div>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
             {currentView === 'dashboard' ? (
               <div className="relative w-full max-w-md group">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                 </div>
                 <input
                   type="text"
                   className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
                   placeholder="Search tools, descriptions, tags..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
               </div>
             ) : (
               <div className="text-lg font-medium text-gray-500">Organization Settings</div>
             )}
          </div>

          <div className="flex items-center gap-3">
            {currentView === 'dashboard' && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md shadow-indigo-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Tool</span>
              </button>
            )}
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          
          {currentView === 'dashboard' && (
            <>
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-500 mt-1">
                    Viewing {selectedCategory === 'All' ? 'all' : selectedCategory} tools available to <span className="font-semibold text-gray-700">{currentUser.name}</span>
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                  <Users className="w-4 h-4" />
                  <span>{filteredTools.length} tools</span>
                </div>
              </div>

              {filteredTools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredTools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} currentUser={currentUser} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <div className="bg-gray-100 p-6 rounded-full mb-4">
                     <Search className="w-12 h-12 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No tools found</h3>
                  <p className="text-gray-500 max-w-sm mt-2">
                    We couldn't find any tools matching your criteria. Try adjusting your filters or add a new tool.
                  </p>
                  <button 
                    onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                    className="mt-4 text-indigo-600 font-medium hover:text-indigo-800"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}

          {currentView === 'settings' && (
            <SettingsView 
              users={users}
              departments={departments}
              onAddUser={handleAddUser}
              onRemoveUser={handleRemoveUser}
              onAddDepartment={handleAddDepartment}
              onRemoveDepartment={handleRemoveDepartment}
              currentUser={currentUser}
            />
          )}

        </div>
      </main>

      <AddToolModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddTool} 
        currentUser={currentUser}
      />
    </div>
  );
};

export default App;