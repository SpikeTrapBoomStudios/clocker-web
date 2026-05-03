import { useState, useEffect } from 'react';
import { TimeLog } from '../types';
import './EditLogDialog.css';

interface Props {
  log: TimeLog | null;
  onClose: () => void;
  onSubmit: (log: TimeLog) => void;
}

function EditLogDialog({ log, onClose, onSubmit }: Props) {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    if (log) {
      setDate(log.date.toISOString().split('T')[0]);
      setStartTime(log.startTime.toTimeString().slice(0, 5));
      setEndTime(log.endTime ? log.endTime.toTimeString().slice(0, 5) : '');
    } else {
      const now = new Date();
      setDate(now.toISOString().split('T')[0]);
      setStartTime(now.toTimeString().slice(0, 5));
      setEndTime('');
    }
  }, [log]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !startTime) return;

    const [yearStr, monthStr, dayStr] = date.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);

    const [startHourStr, startMinuteStr] = startTime.split(':');
    const startHour = parseInt(startHourStr, 10);
    const startMinute = parseInt(startMinuteStr, 10);

    const newDate = new Date(year, month - 1, day);
    const newStartTime = new Date(year, month - 1, day, startHour, startMinute);

    const newEndTime = endTime
      ? (() => {
          const [endHourStr, endMinuteStr] = endTime.split(':');
          const endDate = new Date(year, month - 1, day, parseInt(endHourStr, 10), parseInt(endMinuteStr, 10));
          if (endDate < newStartTime) endDate.setDate(endDate.getDate() + 1);
          return endDate;
        })()
      : null;

    onSubmit({ date: newDate, startTime: newStartTime, endTime: newEndTime });
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h2>{log ? 'Edit Entry' : 'Add Entry'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date *</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Start Time *</label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="Leave empty if ongoing"
            />
          </div>
          <div className="dialog-buttons">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditLogDialog;
