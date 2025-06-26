import React, { useEffect, useState } from 'react';

interface TimeOption {
  label: string;
  value: string;
}

interface ServiceCenter {
  id: string;
  name: string;
  address: string;
  thumbnail: string;
  rating: number;
  total_reviews: number;
  working_weekdays: string;
  working_saturday: string;
  working_sunday: string;
  state: string;
  area: string;
  status?: "active" | "inactive" | undefined;
  working_weekdays_start?: string;
  working_weekdays_end?: string;
}

interface Errors {
  name?: string;
  address?: string;
  thumbnail?: string;
  rating?: number;
  total_reviews?: number;
  working_weekdays?: string;
  working_saturday?: string;
  working_sunday?: string;
  state?: string;
  area?: string;
  status?: string;
  working_weekdays_start?: string;
  working_weekdays_end?: string;
}

interface Props {
  newCenter: Partial<ServiceCenter>;
  setNewCenter: React.Dispatch<React.SetStateAction<Partial<ServiceCenter>>>;
  errors: Errors;
}

const generateTimeOptions = (): TimeOption[] => {
  const times: TimeOption[] = [];
  for (let hour = 0; hour < 24; hour++) {
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const period = hour < 12 ? 'AM' : 'PM';
    times.push({
      label: `${hour12}:00 ${period}`,
      value: `${hour}`
    });
  }
  return times;
};

const WeekendTimeSelector: React.FC<Props> = ({ newCenter, setNewCenter, errors }) => {
  const timeOptions = generateTimeOptions();
  const [endTimeError, setEndTimeError] = useState('');

  const getLabelFromValue = (value: string): string => {
    const found = timeOptions.find((t) => t.value === value);
    return found ? found.label : '';
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStart = e.target.value;
    const end = newCenter.working_weekdays_end || '';
    const startLabel = getLabelFromValue(newStart);
    const endLabel = getLabelFromValue(end);

    const combined = end ? `${startLabel} - ${endLabel}` : '';

    setNewCenter({
      ...newCenter,
      working_weekdays_start: newStart,
      working_weekdays_end: '',
      working_weekdays: combined
    });

    setEndTimeError('');
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEnd = e.target.value;
    const start = newCenter.working_weekdays_start || '';
    const startLabel = getLabelFromValue(start);
    const endLabel = getLabelFromValue(newEnd);

    const combined = start ? `${startLabel} - ${endLabel}` : '';

    setNewCenter({
      ...newCenter,
      working_weekdays_end: newEnd,
      working_weekdays: combined
    });

    setEndTimeError('');
  };

  const startHour = parseInt(newCenter.working_weekdays_start || '0');

  useEffect(() => {
    if (
      newCenter.working_weekdays &&
      !newCenter.working_weekdays_start &&
      !newCenter.working_weekdays_end
    ) {
      const [startLabel, endLabel] = newCenter.working_weekdays.split(' - ');
      const startOption = timeOptions.find((t) => t.label === startLabel);
      const endOption = timeOptions.find((t) => t.label === endLabel);
      

      setNewCenter((prev) => ({
        ...prev,
        working_weekdays_start: startOption?.value || '',
        working_weekdays_end: endOption?.value || ''
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

  console.log(errors);

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Start Time */}
      <div>
        <label className="block text-xs text-gray-500">Weekdays Start Time</label>
        <select
          value={newCenter.working_weekdays_start || ''}
          onChange={handleStartChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select start time</option>
          {timeOptions.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {(errors.working_weekdays_start) && (
          <p className="mt-1 text-sm text-red-600">{errors.working_weekdays_start}</p>
        )}
      </div>

      {/* End Time */}
      <div>
        <label className="block text-xs text-gray-500">Weekdays End Time</label>
        <select
          value={newCenter.working_weekdays_end || ''}
          onChange={handleEndChange}
          disabled={!newCenter.working_weekdays_start}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select end time</option>
          {timeOptions.map((t) => (
            <option
              key={t.value}
              value={t.value}
              disabled={parseInt(t.value) <= startHour}
              className={parseInt(t.value) <= startHour ? 'text-gray-400' : ''}
            >
              {t.label}
            </option>
          ))}
        </select>
        {(errors.working_weekdays_end || endTimeError) && (
          <p className="mt-1 text-sm text-red-600">
            {endTimeError || errors.working_weekdays_end}
          </p>
        )}
      </div>
    </div>
  );
};

export default WeekendTimeSelector;
