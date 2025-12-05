import React, { useState } from 'react';
import { Tool, AccessLevel, User } from '../types';
import { Lock, Users, Globe, ExternalLink, Key, Copy, Eye, EyeOff } from './Icons';

interface ToolCardProps {
  tool: Tool;
  currentUser: User;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, currentUser }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const getAccessIcon = (level: AccessLevel) => {
    switch (level) {
      case AccessLevel.PRIVATE: return <Lock className="w-4 h-4 text-red-500" />;
      case AccessLevel.DEPARTMENT: return <Users className="w-4 h-4 text-blue-500" />;
      case AccessLevel.PUBLIC: return <Globe className="w-4 h-4 text-green-500" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasCredentials = tool.credentials && (tool.credentials.username || tool.credentials.password || tool.credentials.notes);
  // Only show credentials if user is creator OR user is in same department (for department tools) OR admin
  const canViewCredentials = 
    currentUser.isAdmin || 
    tool.createdBy === currentUser.id ||
    (tool.accessLevel === AccessLevel.DEPARTMENT && tool.department === currentUser.department) ||
    tool.accessLevel === AccessLevel.PUBLIC;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden group">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider
              ${tool.accessLevel === AccessLevel.PRIVATE ? 'bg-red-50 text-red-600' : 
                tool.accessLevel === AccessLevel.DEPARTMENT ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
              }`}>
              {tool.accessLevel === AccessLevel.DEPARTMENT ? tool.department : tool.accessLevel}
            </span>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <a 
              href={tool.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
          {tool.name}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[2.5rem]">{tool.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tool.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
              #{tag}
            </span>
          ))}
        </div>

        {hasCredentials && canViewCredentials && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center text-gray-600 font-medium">
                <Key className="w-3 h-3 mr-1.5" />
                Access
              </span>
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-indigo-600"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            
            <div className="space-y-1">
              {tool.credentials?.username && (
                <div className="flex justify-between items-center group/cred">
                  <span className="text-gray-500 text-xs">User:</span>
                  <div className="flex items-center">
                    <span className="text-gray-800 mr-2 font-mono text-xs">{tool.credentials.username}</span>
                    <button onClick={() => copyToClipboard(tool.credentials?.username || '')} className="opacity-0 group-hover/cred:opacity-100 text-gray-400 hover:text-indigo-600">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
              {tool.credentials?.password && (
                <div className="flex justify-between items-center group/cred">
                  <span className="text-gray-500 text-xs">Pass:</span>
                  <div className="flex items-center">
                    <span className="text-gray-800 mr-2 font-mono text-xs">
                      {showPassword ? tool.credentials.password : '••••••••'}
                    </span>
                    <button onClick={() => copyToClipboard(tool.credentials?.password || '')} className="opacity-0 group-hover/cred:opacity-100 text-gray-400 hover:text-indigo-600">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-400">ID: {tool.id}</span>
        {getAccessIcon(tool.accessLevel)}
      </div>
    </div>
  );
};

export default ToolCard;