import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Column {
  key: string;
  label: string;
  width?: string;
  render?: (value: any) => React.ReactNode;
}

interface DataTableProps {
  data: Record<string, any>[];
  columns: Column[];
  title?: string;
  loading?: boolean;
  onRowClick?: (row: Record<string, any>) => void;
}

export function DataTable({
  data,
  columns,
  title,
  loading = false,
  onRowClick,
}: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; asc: boolean } | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map((c) => c.key))
  );
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (typeof aVal === 'string') {
        return sortConfig.asc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return sortConfig.asc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return sorted;
  }, [data, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, asc: !prev.asc };
      }
      return { key, asc: true };
    });
  };

  const toggleColumn = (key: string) => {
    const newColumns = new Set(visibleColumns);
    if (newColumns.has(key)) {
      newColumns.delete(key);
    } else {
      newColumns.add(key);
    }
    setVisibleColumns(newColumns);
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? '✓ Sí' : '✗ No';
    if (typeof value === 'object') return JSON.stringify(value);
    if (typeof value === 'string' && value.length > 50) return value.substring(0, 50) + '...';
    return String(value);
  };

  return (
    <div className="bg-supabase-dark border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-lg font-bold">{title || 'Data Table'}</h3>
        {columns.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowColumnSelector(!showColumnSelector)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white"
              title="Toggle columns"
            >
              <Eye size={18} />
            </button>

            {showColumnSelector && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 bg-supabase-black border border-white/10 rounded-lg p-3 z-50 min-w-max shadow-lg"
              >
                {columns.map((col) => (
                  <label
                    key={col.key}
                    className="flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-white/5 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns.has(col.key)}
                      onChange={() => toggleColumn(col.key)}
                      className="rounded"
                    />
                    <span className="text-sm">{col.label}</span>
                  </label>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="inline-block">
            <div className="w-8 h-8 border-2 border-supabase-green border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="p-12 text-center text-white/40">
          <p>No hay datos para mostrar</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="w-10 p-4 text-left"></th>
                {columns.map(
                  (col) =>
                    visibleColumns.has(col.key) && (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        className={`px-4 py-3 text-left text-sm font-bold cursor-pointer hover:bg-white/5 transition-colors ${
                          col.width || 'w-auto'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{col.label}</span>
                          {sortConfig?.key === col.key && (
                            <>
                              {sortConfig.asc ? (
                                <ChevronUp size={14} />
                              ) : (
                                <ChevronDown size={14} />
                              )}
                            </>
                          )}
                        </div>
                      </th>
                    )
                )}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {sortedData.map((row, index) => (
                  <motion.tr
                    key={index}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="w-10 p-4">
                      <button
                        onClick={() =>
                          setExpandedRow(expandedRow === index ? null : index)
                        }
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        {expandedRow === index ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    </td>
                    {columns.map(
                      (col) =>
                        visibleColumns.has(col.key) && (
                          <td
                            key={col.key}
                            onClick={() => onRowClick?.(row)}
                            className="px-4 py-3 text-sm text-white/80 cursor-pointer"
                          >
                            {col.render ? col.render(row[col.key]) : formatValue(row[col.key])}
                          </td>
                        )
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {/* Expandable Row Details */}
          <AnimatePresence>
            {expandedRow !== null && (
              <motion.tr
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <td colSpan={columns.length + 1} className="p-6 bg-black/30 border-b border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {columns.map((col) => (
                      <div key={col.key}>
                        <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">
                          {col.label}
                        </p>
                        <p className="text-sm text-white/80 break-all font-mono text-xs">
                          {col.render
                            ? col.render(sortedData[expandedRow][col.key])
                            : formatValue(sortedData[expandedRow][col.key])}
                        </p>
                      </div>
                    ))}
                  </div>
                </td>
              </motion.tr>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
