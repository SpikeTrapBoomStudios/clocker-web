import { useState, useEffect } from 'react';
import './EditLogDialog.css';

function EditLogDialog({ log, onClose, onSubmit }) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !startTime) return;

    const [year, month, day] = date.split('-');
    const [startHour, startMinute] = startTime.split(':');
    const newDate = new Date(year, month - 1, day);

    const newStartTime = new Date(year, month - 1, day, startHour, startMinute);
    const newEndTime = endTime
      ? (() => {
          const [endHour, endMinute] = endTime.split(':');
          let endDate = new Date(year, month - 1, day, endHour, endMinute);
          if (endDate < newStartTime) {
            endDate.setDate(endDate.getDate() + 1);
          }
          return endDate;
        })()
      : null;

    onSubmit({
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
    });
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h2>{log ? 'Edit Entry' : 'Add Entry'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Start Time *</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
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
