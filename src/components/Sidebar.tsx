import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
  HomeIcon,
  QuestionMarkCircleIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

interface MenuItem {
  name: string;
  path: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
  { name: 'Questions', path: '/questions', icon: QuestionMarkCircleIcon },
  { name: 'Calls', path: '/calls', icon: PhoneIcon },
  { name: 'Answers', path: '/answers', icon: ChatBubbleLeftRightIcon },
];

export function Sidebar() {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white fixed left-0 top-0 flex flex-col">
      <div className="p-4">
        <h1 className="text-2xl font-bold">QualiCall</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 p-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-md transition-colors duration-200
                    ${isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-2 w-full text-gray-300 hover:bg-gray-700 rounded-md transition-colors duration-200"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
} 