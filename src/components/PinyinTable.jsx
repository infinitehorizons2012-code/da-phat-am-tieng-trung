import React, { useState } from 'react';
import { initials, finals, pinyinMatrix } from '../data/pinyinData';
import PinyinCell from './PinyinCell';
import FilterBar from './FilterBar';

export default function PinyinTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterInitial, setFilterInitial] = useState('all');
  const [activeCell, setActiveCell] = useState(null); // format: "initial-final"

  // Handle clicking outside to close active tone popup
  React.useEffect(() => {
    const handleClickOutside = () => {
      setActiveCell(null);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Filter initials based on filter dropdown
  const displayedInitials = filterInitial === 'all' 
    ? initials 
    : initials.filter(i => i.id === filterInitial);

  const isCellMatched = (syllable) => {
    if (!syllable) return false;
    if (!searchQuery) return true;
    return syllable.toLowerCase().includes(searchQuery.toLowerCase().trim());
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <FilterBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterInitial={filterInitial}
        onFilterInitialChange={setFilterInitial}
      />
      
      <div className="table-wrapper">
        <table className="pinyin-table">
          <thead>
            <tr>
              <th className="col-initial">Pinyin</th>
              {finals.map(final => (
                <th key={final}>{final}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedInitials.map(init => (
              <tr key={init.id}>
                <td className="cell-initial">{init.label}</td>
                {finals.map(final => {
                  const syllable = pinyinMatrix[init.id]?.[final];
                  const cellId = `${init.id}-${final}`;
                  const isMatch = isCellMatched(syllable);
                  
                  // Nếu đang search mà không match thì không hiển thị nội dung để bảng gọn hơn (hoặc làm mờ)
                  const displaySyllable = (searchQuery && !isMatch) ? '' : syllable;

                  return (
                    <PinyinCell 
                      key={final}
                      syllable={displaySyllable}
                      isActive={activeCell === cellId}
                      onActivate={() => setActiveCell(cellId)}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
