import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Search, Filter, Loader, X } from 'lucide-react';

export default function AdvancedSearch() {
  const [searchType, setSearchType] = useState('shipment');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    riskLevel: 'all',
    status: 'all',
    origin: '',
    destination: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      let data = [];

      if (searchType === 'shipment') {
        const res = await api.getShipmentStatus(query);
        data = [res.tracking];
      } else if (searchType === 'port') {
        const res = await api.getPortDetails(query);
        data = [res.port];
      } else if (searchType === 'risk') {
        const res = await api.getRegionRisks(query);
        data = res.risks ? [res] : [];
      }

      setResults(data);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      riskLevel: 'all',
      status: 'all',
      origin: '',
      destination: ''
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Search className="w-5 h-5" /> Advanced Search
      </h2>

      {/* Search Form */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Search Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['shipment', 'port', 'risk'].map(type => (
              <label key={type} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  value={type}
                  checked={searchType === type}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-slate-300 capitalize">{type}</span>
              </label>
            ))}
          </div>

          {/* Search Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={`Search by ${searchType} ID...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-slate-700/50 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium px-6 py-2 rounded transition-colors flex items-center gap-2"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-slate-700 hover:bg-slate-600 text-white font-medium px-4 py-2 rounded transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-600">
              <select
                value={filters.riskLevel}
                onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
                className="bg-slate-700/50 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Risk Levels</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="bg-slate-700/50 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="delayed">Delayed</option>
              </select>

              <input
                type="text"
                placeholder="Origin"
                value={filters.origin}
                onChange={(e) => handleFilterChange('origin', e.target.value)}
                className="bg-slate-700/50 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />

              <input
                type="text"
                placeholder="Destination"
                value={filters.destination}
                onChange={(e) => handleFilterChange('destination', e.target.value)}
                className="bg-slate-700/50 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />

              <button
                type="button"
                onClick={clearFilters}
                className="md:col-span-2 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 rounded transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Results ({results.length})</h3>
          <div className="space-y-3">
            {results.map((result, idx) => (
              <div key={idx} className="bg-slate-700/30 border border-slate-600 rounded p-4">
                {searchType === 'shipment' && (
                  <div>
                    <p className="font-bold text-white">{result.id}</p>
                    <p className="text-sm text-slate-400">{result.origin} → {result.destination}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-slate-400">Status: {result.status}</span>
                      <span className="text-xs text-blue-300">{result.progress}% complete</span>
                    </div>
                  </div>
                )}
                {searchType === 'port' && (
                  <div>
                    <p className="font-bold text-white">{result.name} ({result.code})</p>
                    <p className="text-sm text-slate-400">{result.country}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-slate-400">Utilization: {result.utilization}%</span>
                      <span className="text-xs text-slate-400">Wait: {result.avgWaitTime}</span>
                    </div>
                  </div>
                )}
                {searchType === 'risk' && (
                  <div>
                    <p className="font-bold text-white">{result.region}</p>
                    <p className="text-sm text-slate-400">Risk Score: {result.riskScore}/10</p>
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        result.riskLevel === 'High' ? 'bg-red-900/30 text-red-200' : 'bg-yellow-900/30 text-yellow-200'
                      }`}>
                        {result.riskLevel}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
          <p className="text-slate-400">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
