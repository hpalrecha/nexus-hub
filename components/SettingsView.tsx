import React, { useState } from 'react';
import { User, Department } from '../types';
import { Trash2, UserPlus, Plus } from './Icons';

interface SettingsViewProps {
  users: User[];
  departments: Department[];
  onAddUser: (user: Omit<User, 'id' | 'avatar'>) => void;
  onRemoveUser: (userId: string) => void;
  onAddDepartment: (dept: string) => void;
  onRemoveDepartment: (dept: string) => void;
  currentUser: User;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  users, 
  departments, 
  onAddUser, 
  onRemoveUser,
  onAddDepartment,
  onRemoveDepartment,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'departments'>('users');
  
  // New User State
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserDept, setNewUserDept] = useState(departments[0] || '');
  const [newUserIsAdmin, setNewUserIsAdmin] = useState(false);

  // New Department State
  const [newDeptName, setNewDeptName] = useState('');

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser({
      name: newUserName,
      email: newUserEmail,
      department: newUserDept,
      isAdmin: newUserIsAdmin
    });
    setNewUserName('');
    setNewUserEmail('');
    setNewUserOpen(false);
  };

  const handleAddDeptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDeptName && !departments.includes(newDeptName)) {
      onAddDepartment(newDeptName);
      setNewDeptName('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your organization's users and departments.</p>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'users' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'departments' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Departments
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {activeTab === 'users' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
              <button 
                onClick={() => setNewUserOpen(!newUserOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>

            {newUserOpen && (
              <form onSubmit={handleAddUserSubmit} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="jane@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newUserDept}
                      onChange={(e) => setNewUserDept(e.target.value)}
                    >
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center mt-6">
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={newUserIsAdmin}
                          onChange={(e) => setNewUserIsAdmin(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">Grant Admin Privileges</span>
                     </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setNewUserOpen(false)}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                  >
                    Save User
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                    <th className="pb-3 pl-2">User</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(user => (
                    <tr key={user.id} className="group hover:bg-gray-50/50">
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-gray-100" />
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        {user.isAdmin ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700">
                            Admin
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">Member</span>
                        )}
                      </td>
                      <td className="py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {user.department}
                        </span>
                      </td>
                      <td className="py-4 text-right pr-2">
                        <button 
                          onClick={() => onRemoveUser(user.id)}
                          disabled={user.id === currentUser.id}
                          className={`p-1.5 rounded-lg transition-colors ${
                            user.id === currentUser.id 
                              ? 'opacity-30 cursor-not-allowed text-gray-300' 
                              : 'text-gray-400 hover:bg-red-50 hover:text-red-500'
                          }`}
                          title={user.id === currentUser.id ? "Cannot remove yourself" : "Remove user"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'departments' && (
          <div className="p-6">
             <div className="flex flex-col md:flex-row gap-6">
                
                {/* Add Dept Form */}
                <div className="w-full md:w-1/3 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Add Department</h3>
                  <form onSubmit={handleAddDeptSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={newDeptName}
                        onChange={(e) => setNewDeptName(e.target.value)}
                        placeholder="e.g. Legal"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={!newDeptName}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                      Add Department
                    </button>
                  </form>
                </div>

                {/* List Depts */}
                <div className="w-full md:w-2/3 border-l border-gray-100 md:pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Departments</h3>
                  <div className="space-y-2">
                    {departments.map((dept, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg group hover:bg-white hover:shadow-sm hover:border-gray-200 border border-transparent transition-all">
                        <span className="text-sm font-medium text-gray-700">{dept}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                             {users.filter(u => u.department === dept).length} users
                          </span>
                          <button 
                            onClick={() => onRemoveDepartment(dept)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                            title="Remove Department"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsView;