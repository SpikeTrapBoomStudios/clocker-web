import { useState } from 'react';
import { formatTime, formatDate, formatDuration, getDurationSeconds, isActive } from '../utils/timeUtils';
import ConfirmDialog from './ConfirmDialog';
import './TimeLogTable.css';

function TimeLogTable({ logs, onEdit, onDelete, onSort, sortCol, sortOrder }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const getSortIcon = (col) => {
    if (sortCol !== col) return '⇅';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="table-container">
      <table className="time-log-table">
        <thead>
          <tr>
            <th onClick={() => onSort(0)} className="sortable">
              Date {getSortIcon(0)}
            </th>
            <th>Start Time</th>
            <th>End Time</th>
            <th onClick={() => onSort(1)} className="sortable">
              Duration {getSortIcon(1)}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="5" className="empty-cell">No time logs yet</td>
            </tr>
          ) : (
            logs.map((log, idx) => {
              const duration = getDurationSeconds(log.startTime, log.endTime);
              const active = isActive(log);
              return (
                <tr key={idx} className={active ? 'active-row' : ''}>
                  <td>{formatDate(log.date)}</td>
                  <td>{formatTime(log.startTime)}</td>
                  <td>{active ? '(Active)' : formatTime(log.endTime)}</td>
                  <td>{formatDuration(duration)}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn-edit"
                        onClick={() => onEdit(log)}
                        title="Edit"
                      >
                        ✎ Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => setDeleteConfirm(idx)}
                        title="Delete"
                      >
                        ✕ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {deleteConfirm !== null && (
        <ConfirmDialog
          message="Delete this entry?"
          onConfirm={() => {
            onDelete(deleteConfirm);
            setDeleteConfirm(null);
          }}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}

export default TimeLogTable;
