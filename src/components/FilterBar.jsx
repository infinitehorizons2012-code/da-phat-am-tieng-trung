import React from 'react';
import { Search } from 'lucide-react';
import { initials } from '../data/pinyinData';

export default function FilterBar({ searchQuery, onSearchChange, filterInitial, onFilterInitialChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white border-b border-slate-200">
      <div className="relative flex-1">
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" 
          size={18} 
        />
        <input 
          type="text" 
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          placeholder="Tìm kiếm âm tiết (ví dụ: 'ma', 'zhou', 'ba')..." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <select 
        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer min-w-[150px]"
        value={filterInitial}
        onChange={(e) => onFilterInitialChange(e.target.value)}
      >
        <option value="all">Tất cả thanh mẫu</option>
        {initials.map(init => (
          <option key={init.id} value={init.id}>
            {init.label}
          </option>
        ))}
      </select>
    </div>
  );
}
