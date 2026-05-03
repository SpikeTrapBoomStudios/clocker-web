import { useState } from 'react';
import { formatTime, formatDate, formatDuration, getDurationSeconds, isActive } from '../utils/TimeUtils';
import { TimeLog } from '../types';
import ConfirmDialog from './ConfirmDialog';
import './TimeLogTable.css';

interface Props {
  logs: TimeLog[];
  onEdit: (log: TimeLog) => void;
  onDelete: (index: number) => void;
  onSort: (column: number) => void;
  sortColumn: number;
  sortOrder: 'asc' | 'desc';
}

function TimeLogTable({ logs, onEdit, onDelete, onSort, sortColumn, sortOrder }: Props) {
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);

  const getSortIcon = (column: number) => {
    if (sortColumn !== column) return '⇅';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="table-container">
      <table className="time-log-table">
        <thead>
          <tr>
            <th onClick={() => onSort(0)} className="sortable">Date {getSortIcon(0)}</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th onClick={() => onSort(1)} className="sortable">Duration {getSortIcon(1)}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan={5} className="empty-cell">No time logs yet</td>
            </tr>
          ) : (
            logs.map((log, index) => {
              const duration = getDurationSeconds(log.startTime, log.endTime);
              const active = isActive(log);
              return (
                <tr key={index} className={active ? 'active-row' : ''}>
                  <td>{formatDate(log.date)}</td>
                  <td>{formatTime(log.startTime)}</td>
                  <td>{active ? '(Active)' : formatTime(log.endTime)}</td>
                  <td>{formatDuration(duration)}</td>
                  <td>
                    <div className="actions">
                      <button className="btn-edit" onClick={() => onEdit(log)} title="Edit">✎ Edit</button>
                      <button className="btn-delete" onClick={() => setDeleteConfirmIndex(index)} title="Delete">✕ Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {deleteConfirmIndex !== null && (
        <ConfirmDialog
          message="Delete this entry?"
          onConfirm={() => {
            onDelete(deleteConfirmIndex);
            setDeleteConfirmIndex(null);
          }}
          onCancel={() => setDeleteConfirmIndex(null)}
        />
      )}
    </div>
  );
}

export default TimeLogTable;
