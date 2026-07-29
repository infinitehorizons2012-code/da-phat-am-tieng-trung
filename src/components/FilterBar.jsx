import React from 'react';
import { Search } from 'lucide-react';
import { initials } from '../data/pinyinData';

export default function FilterBar({ searchQuery, onSearchChange, filterInitial, onFilterInitialChange }) {
  return (
    <div className="filter-bar">
      <div style={{ position: 'relative', flex: 1 }}>
        <Search 
          style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} 
          size={18} 
        />
        <input 
          type="text" 
          className="search-input"
          placeholder="Tìm kiếm âm tiết (ví dụ: 'ma', 'zhou', 'ba')..." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <select 
        className="filter-select"
        value={filterInitial}
        onChange={(e) => onFilterInitialChange(e.target.value)}
      >
        <option value="all">Tất cả âm đầu</option>
        {initials.map(init => (
          <option key={init.id} value={init.id}>
            {init.label}
          </option>
        ))}
      </select>
    </div>
  );
}
