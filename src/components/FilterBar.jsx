import React from 'react';

const FilterBar = ({ filters, options, onFilterChange }) => {
  return (
    <div className="filter-bar">
      <input
        type={filters.startDate ? "date" : "text"}
        name="startDate"
        value={filters.startDate || ''}
        onChange={(e) => onFilterChange({ startDate: e.target.value })}
        onFocus={(e) => (e.target.type = "date")}
        onBlur={(e) => !e.target.value && (e.target.type = "text")}
        placeholder="Start Date"
      />
      <input
        type={filters.endDate ? "date" : "text"}
        name="endDate"
        value={filters.endDate || ''}
        onChange={(e) => onFilterChange({ endDate: e.target.value })}
        onFocus={(e) => (e.target.type = "date")}
        onBlur={(e) => !e.target.value && (e.target.type = "text")}
        placeholder="End Date"
      />
      
      {options?.salespersons && options.salespersons.length > 0 && (
        <select
          value={filters.salesperson || ''}
          onChange={(e) => onFilterChange({ salesperson: e.target.value })}
        >
          <option value="">All Salespersons</option>
          {options.salespersons.map(sp => (
            <option key={sp} value={sp}>{sp}</option>
          ))}
        </select>
      )}

      {options?.categories && options.categories.length > 0 && (
        <select
          value={filters.category || ''}
          onChange={(e) => onFilterChange({ category: e.target.value })}
        >
          <option value="">All Categories</option>
          {options.categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      )}

      {options?.states && options.states.length > 0 && (
        <select
          value={filters.state || ''}
          onChange={(e) => onFilterChange({ state: e.target.value })}
        >
          <option value="">All States</option>
          {options.states.map(st => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      )}

      <button 
        className="btn-secondary" 
        onClick={() => onFilterChange({ 
          startDate: '', endDate: '', salesperson: '', category: '', state: '' 
        }, true)}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default FilterBar;
