import React from 'react';
import { Search, User, Bell } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-2xl font-semibold text-gray-800">Overview</h1>
      <div className="flex items-center gap-6">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search toys, employee or order..."
            className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-shadow"
          />
        </div>
        <button className="flex items-center gap-2 bg-red-600 text-white font-medium py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
          + Add Toy
        </button>
        <div className="flex items-center gap-4">
          <button className="relative text-gray-500 hover:text-gray-700">
            <Bell size={24} />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </button>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700 text-right">Admin!</span>
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
