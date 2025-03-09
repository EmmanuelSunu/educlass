
import React, { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import ButtonProps from "../../../components/ButtonProps";
import { RiUpload2Line } from "react-icons/ri";
import { Schedule } from "./types";

interface ScheduleFileUploadProps {
  onSchedulesImported: (schedules: Schedule[]) => void;
}

const ScheduleFileUpload: React.FC<ScheduleFileUploadProps> = ({ onSchedulesImported }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      parseCSV(file);
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      parseExcel(file);
    } else {
      setError("Unsupported file format. Please upload a CSV or Excel file.");
      setIsUploading(false);
    }
  };

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const schedules = convertToSchedules(results.data);
          onSchedulesImported(schedules);
          setIsUploading(false);
        } catch (err) {
          setError(`Error parsing CSV: ${err instanceof Error ? err.message : String(err)}`);
          setIsUploading(false);
        }
      },
      error: (error) => {
        setError(`Error parsing CSV: ${error.message}`);
        setIsUploading(false);
      }
    });
  };

  const parseExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const schedules = convertToSchedules(jsonData);
        onSchedulesImported(schedules);
        setIsUploading(false);
      } catch (err) {
        setError(`Error parsing Excel: ${err instanceof Error ? err.message : String(err)}`);
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
      setError("Error reading file");
      setIsUploading(false);
    };
    reader.readAsBinaryString(file);
  };

  const convertToSchedules = (data: any[]): Schedule[] => {
    if (!data.length) {
      throw new Error("File contains no data");
    }

    // Check required columns
    const requiredColumns = ['title', 'type', 'date', 'startTime', 'endTime', 'location'];
    const firstRow = data[0];
    
    const missingColumns = requiredColumns.filter(col => 
      !Object.keys(firstRow).some(key => key.toLowerCase() === col.toLowerCase())
    );
    
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    return data.map((row, index) => {
      // Find the actual column names in the data (case insensitive)
      const getColumnValue = (columnName: string) => {
        const key = Object.keys(row).find(k => k.toLowerCase() === columnName.toLowerCase());
        return key ? row[key] : undefined;
      };

      const isRecurring = getColumnValue('isRecurring') === 'true' || getColumnValue('isRecurring') === true;
      
      const schedule: Schedule = {
        id: `imported-${index}-${Date.now()}`,
        title: getColumnValue('title') || 'Untitled Event',
        type: getColumnValue('type') || 'class',
        date: getColumnValue('date') || '',
        startTime: getColumnValue('startTime') || '',
        endTime: getColumnValue('endTime') || '',
        location: getColumnValue('location') || '',
        isRecurring: isRecurring,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Handle recurrence data if present
      if (isRecurring) {
        const frequency = getColumnValue('frequency') || 'weekly';
        const endDate = getColumnValue('endDate') || '';
        
        if (endDate) {
          schedule.recurrence = {
            frequency,
            endDate
          };
        }
      }

      return schedule;
    });
  };

  return (
    <div className="mb-4">
      <div className="flex flex-col">
        <ButtonProps
          variant="secondary"
          className="gap-2"
          onClick={() => document.getElementById('schedule-file-upload')?.click()}
          disabled={isUploading}
        >
          <RiUpload2Line />
          {isUploading ? 'Uploading...' : 'Import Calendar Data'}
        </ButtonProps>
        <input
          id="schedule-file-upload"
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        
        {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
        
        <div className="mt-4 text-sm text-slate-600">
          <p className="font-semibold">Expected columns in file:</p>
          <ul className="list-disc pl-5 mt-1">
            <li>title - Event title (required)</li>
            <li>type - Event type: class, examination, test, meeting, etc. (required)</li>
            <li>date - Event date in YYYY-MM-DD format (required)</li>
            <li>startTime - Start time in HH:MM format (required)</li>
            <li>endTime - End time in HH:MM format (required)</li>
            <li>location - Event location (required)</li>
            <li>isRecurring - Whether event repeats (optional, true/false)</li>
            <li>frequency - For recurring events: daily, weekly, monthly (optional)</li>
            <li>endDate - End date for recurring events in YYYY-MM-DD format (optional)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScheduleFileUpload;
