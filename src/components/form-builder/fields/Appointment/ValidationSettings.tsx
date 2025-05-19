'use client';
import React, { ChangeEvent } from 'react';
import { AppointmentFieldDefinition } from '@/components/form-builder/types';

interface ValidationSettingsProps {
  fieldDef: AppointmentFieldDefinition;
  onChange: <K extends keyof AppointmentFieldDefinition>(
    key: K,
    value: AppointmentFieldDefinition[K],
  ) => void;
}

/**
 * Validation + behaviour settings panel for the Appointment field.
 */
const ValidationSettings: React.FC<ValidationSettingsProps> = ({ fieldDef, onChange }) => {
  // Generic helpers
  const handleCheckbox = (key: keyof AppointmentFieldDefinition, nested?: boolean) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      if (nested && key === 'validatorsConfig') {
        onChange('validatorsConfig', {
          ...(fieldDef.validatorsConfig ?? {}),
          required: checked,
        } as AppointmentFieldDefinition['validatorsConfig']);
      } else {
        onChange(key as keyof AppointmentFieldDefinition, checked as never);
      }
    };

  const handleText = (key: keyof AppointmentFieldDefinition) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onChange(key as keyof AppointmentFieldDefinition, e.target.value as never);
    };

  const handleNumber = (key: keyof AppointmentFieldDefinition) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value === '' ? undefined : Number(e.target.value);
      onChange(key as keyof AppointmentFieldDefinition, val as never);
    };

  const layout = fieldDef.appointmentLayout ?? 'datetime';

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2 text-gray-800">Validation & Options</h4>

      {/* Required */}
      <div className="flex items-center mb-3">
        <input
          id="appointment-required"
          type="checkbox"
          className="mr-2"
          checked={fieldDef.validatorsConfig?.required ?? false}
          onChange={handleCheckbox('validatorsConfig', true)}
        />
        <label htmlFor="appointment-required" className="text-sm text-gray-700 font-medium">
          Required
        </label>
      </div>

      {/* Layout selection */}
      <div className="mb-3">
        <label htmlFor="appointment-layout" className="block mb-1.5 font-medium text-gray-700 text-sm">
          Layout
        </label>
        <select
          id="appointment-layout"
          value={layout}
          onChange={handleText('appointmentLayout')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        >
          <option value="datetime">Date & Time</option>
          <option value="dateOnly">Date Only</option>
          <option value="timeOnly">Time Only</option>
        </select>
      </div>

      {/* Date constraints – hidden when timeOnly */}
      {layout !== 'timeOnly' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Min Date */}
          <div>
            <label htmlFor="min-date" className="block mb-1.5 font-medium text-gray-700 text-sm">
              Min Date
            </label>
            <input
              id="min-date"
              type="date"
              value={fieldDef.minDate ?? ''}
              onChange={handleText('minDate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
            />
          </div>
          {/* Max Date */}
          <div>
            <label htmlFor="max-date" className="block mb-1.5 font-medium text-gray-700 text-sm">
              Max Date
            </label>
            <input
              id="max-date"
              type="date"
              value={fieldDef.maxDate ?? ''}
              onChange={handleText('maxDate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
            />
          </div>
        </div>
      )}

      {/* Time constraints – hidden when dateOnly */}
      {layout !== 'dateOnly' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
          {/* Min Time */}
          <div>
            <label htmlFor="min-time" className="block mb-1.5 font-medium text-gray-700 text-sm">
              Min Time
            </label>
            <input
              id="min-time"
              type="time"
              value={fieldDef.minTime ?? ''}
              onChange={handleText('minTime')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
            />
          </div>
          {/* Max Time */}
          <div>
            <label htmlFor="max-time" className="block mb-1.5 font-medium text-gray-700 text-sm">
              Max Time
            </label>
            <input
              id="max-time"
              type="time"
              value={fieldDef.maxTime ?? ''}
              onChange={handleText('maxTime')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
            />
          </div>
        </div>
      )}

      {/* Step minutes */}
      {layout !== 'dateOnly' && (
        <div className="mb-3 mt-3">
          <label htmlFor="step-minutes" className="block mb-1.5 font-medium text-gray-700 text-sm">
            Step (minutes)
          </label>
          <input
            id="step-minutes"
            type="number"
            value={fieldDef.stepMinutes ?? ''}
            onChange={handleNumber('stepMinutes')}
            placeholder="e.g. 15"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
          />
        </div>
      )}

      {/* Autocomplete */}
      <div className="mb-3">
        <label htmlFor="autocomplete" className="block mb-1.5 font-medium text-gray-700 text-sm">
          Autocomplete Attribute
        </label>
        <select
          id="autocomplete"
          value={fieldDef.autocompleteAttr ?? 'off'}
          onChange={handleText('autocompleteAttr')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        >
          <option value="off">Off</option>
          <option value="bday">Birthday (YYYY-MM-DD)</option>
          <option value="bday-month">Birthday Month</option>
        </select>
      </div>
    </div>
  );
};

export default ValidationSettings; 