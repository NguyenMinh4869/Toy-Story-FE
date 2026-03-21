import React from 'react';
import { User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-end px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-gray-700 text-right">Admin!</span>
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
          <User size={24} className="text-white" />
        </div>
      </div>
    </header>
  );
};

export default Header;
