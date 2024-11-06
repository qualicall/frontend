import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function Card({ title, description, icon }: CardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <div className="flex items-center space-x-4">
        <div className="bg-blue-100 p-3 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}