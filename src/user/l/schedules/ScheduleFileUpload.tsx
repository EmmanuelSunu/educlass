import React, { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import ButtonProps from "../../../components/ButtonProps";
import { RiUploadCloud2Line, RiCheckLine, RiFileExcel2Line, RiFileList3Line } from "react-icons/ri";
import { Schedule } from "../../../data/schedule/types";

interface ScheduleFileUploadProps {
  onImport: (schedules: Schedule[]) => void;
}

const ScheduleFileUpload: React.FC<ScheduleFileUploadProps> = ({ onImport }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<Schedule[]>([]);
  const [isVerified, setIsVerified] = useState(false);

  const resetState = () => {
    setIsUploading(false);
    setError(null);
    setFile(null);
    setParsedData([]);
    setIsVerified(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setIsVerified(false);
    setParsedData([]);

    // Auto-verify file when selected
    parseAndVerifyFile(selectedFile);
  };

  const validateData = (data: any[]): { valid: boolean; error?: string } => {
    if (!data.length) {
      return { valid: false, error: "File contains no data" };
    }

    // Check for required columns
    const requiredColumns = ['title', 'type', 'date', 'startTime', 'endTime', 'location'];
    const firstRow = data[0];

    const missingColumns = requiredColumns.filter(col => 
      !Object.keys(firstRow).some(key => key.toLowerCase() === col.toLowerCase())
    );

    if (missingColumns.length) {
      return { 
        valid: false, 
        error: `Missing required columns: ${missingColumns.join(', ')}` 
      };
    }

    // Validate type values
    const validTypes = ['class', 'examination', 'studyGroup', 'consultation'];
    const invalidTypes = data.filter(row => 
      row.type && !validTypes.includes(row.type.toLowerCase())
    );

    if (invalidTypes.length) {
      return {
        valid: false,
        error: `Invalid type values found. Valid types are: ${validTypes.join(', ')}`
      };
    }

    return { valid: true };
  };

  const parseAndVerifyFile = async (selectedFile: File) => {
    setIsUploading(true);
    setError(null);

    try {
      let data: any[] = [];

      if (selectedFile.name.endsWith('.csv')) {
        // Parse CSV
        const text = await selectedFile.text();
        const result = Papa.parse(text, { header: true, skipEmptyLines: true });
        data = result.data as any[];
      } else if (selectedFile.name.match(/\.xlsx?$/)) {
        // Parse Excel
        const arrayBuffer = await selectedFile.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(worksheet);
      } else {
        throw new Error('Unsupported file format. Please upload CSV or Excel file.');
      }

      // Validate data
      const validation = validateData(data);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Convert to Schedule objects
      const schedules: Schedule[] = data.map((row, index) => ({
        id: `imported-${index}`,
        title: row.title,
        type: row.type.toLowerCase() as "class" | "examination" | "studyGroup" | "consultation",
        date: row.date,
        startTime: row.startTime,
        endTime: row.endTime,
        location: row.location,
        isRecurring: row.isRecurring === 'true' || row.isRecurring === true,
        recurrence: row.isRecurring ? {
          frequency: row.frequency || 'weekly',
          endDate: row.endDate || ''
        } : undefined,
        description: row.description || '',
        courseId: row.courseId ? parseInt(row.courseId) : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      setParsedData(schedules);
      setIsVerified(true);
    } catch (err: any) {
      setError(err.message);
      setIsVerified(false);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImport = () => {
    if (parsedData.length) {
      onImport(parsedData);
    }
  };

  const getFileIcon = () => {
    if (!file) return null;

    if (file.name.endsWith('.csv')) {
      return <RiFileList3Line className="text-blue-500" size={24} />;
    } else if (file.name.match(/\.xlsx?$/)) {
      return <RiFileExcel2Line className="text-green-500" size={24} />;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <div className="flex flex-col items-center">
          <div className="mb-4 flex flex-col items-center">
            <div className="bg-blue-50 rounded-full p-4 mb-3">
              <RiUploadCloud2Line className="text-primary w-10 h-10" />
            </div>
            <h3 className="text-lg font-medium text-gray-700">Upload Schedule Data</h3>
            <p className="text-sm text-gray-500 mt-1">
              Upload a CSV or Excel file with your schedule data
            </p>
          </div>

          <label 
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors mb-4"
          >
            <div className="flex flex-col items-center justify-center py-3">
              <p className="text-sm font-medium text-primary mb-1">Click to upload</p>
              <p className="text-xs text-gray-500">or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">CSV, XLS, XLSX</p>
            </div>
            <input 
              id="file-upload" 
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </label>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-center">
            <div className="bg-gray-50 rounded-full p-4">
              {getFileIcon() || <RiUploadCloud2Line className="text-primary w-8 h-8" />}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="bg-blue-50 text-blue-800 text-sm py-1.5 px-3 rounded-full flex items-center">
              {file.name}
              <button 
                className="ml-2 text-blue-600 hover:text-blue-800" 
                onClick={resetState}
                aria-label="Remove file"
              >
                ×
              </button>
            </div>
          </div>

          {isUploading && (
            <div className="text-center text-sm text-gray-600">
              <div className="w-full h-1 bg-gray-200 rounded-full mb-1">
                <div className="h-1 bg-primary rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              Verifying file data...
            </div>
          )}

          {error && (
            <div className="p-2.5 bg-red-50 text-red-600 rounded-md text-sm">
              <p className="font-medium">Error</p>
              <p>{error}</p>
              <button 
                className="mt-1 text-sm text-red-700 hover:underline" 
                onClick={resetState}
              >
                Try a different file
              </button>
            </div>
          )}

          {isVerified && parsedData.length > 0 && (
            <div>
              <div className="p-2.5 bg-green-50 text-green-600 rounded-md text-sm flex items-center mb-3">
                <RiCheckLine className="mr-2 flex-shrink-0" />
                <span>Found {parsedData.length} schedule items ready to import</span>
              </div>

              <div className="flex justify-center">
                <ButtonProps
                  variant="primary"
                  onClick={handleImport}
                  className="gap-2"
                >
                  <RiCheckLine />
                  Import {parsedData.length} Schedule Items
                </ButtonProps>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="border-t border-gray-200 pt-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Required File Format</h4>
        <div className="text-xs text-gray-600 space-y-2">
          <p>Your CSV or Excel file must include these required columns:</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <span className="font-medium">title</span>
              <p className="text-gray-500">Event title</p>
            </div>
            <div>
              <span className="font-medium">type</span>
              <p className="text-gray-500">Event type (class, examination, studyGroup, consultation)</p>
            </div>
            <div>
              <span className="font-medium">date</span>
              <p className="text-gray-500">YYYY-MM-DD format</p>
            </div>
            <div>
              <span className="font-medium">startTime</span>
              <p className="text-gray-500">HH:MM format</p>
            </div>
            <div>
              <span className="font-medium">endTime</span>
              <p className="text-gray-500">HH:MM format</p>
            </div>
            <div>
              <span className="font-medium">location</span>
              <p className="text-gray-500">Event location</p>
            </div>
            <div>
              <span className="font-medium">courseId</span>
              <p className="text-gray-500">Optional course ID</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleFileUpload;