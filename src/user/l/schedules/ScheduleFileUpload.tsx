
import React, { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import ButtonProps from "../../../components/ButtonProps";
import { RiUpload2Line, RiCloseLine, RiCheckLine } from "react-icons/ri";
import { Schedule } from "./types";

interface ScheduleFileUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedulesImported: (schedules: Schedule[]) => void;
}

const ScheduleFileUpload: React.FC<ScheduleFileUploadProps> = ({ 
  isOpen, 
  onClose, 
  onSchedulesImported 
}) => {
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

  const handleModalClose = () => {
    resetState();
    onClose();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setIsVerified(false);
    setParsedData([]);
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

    return { valid: true };
  };

  const convertToSchedules = (data: any[]): Schedule[] => {
    return data.map((item, index) => ({
      id: `imported-${Date.now()}-${index}`,
      title: item.title || '',
      type: item.type || 'class',
      date: item.date || '',
      startTime: item.startTime || '',
      endTime: item.endTime || '',
      location: item.location || '',
      description: item.description || '',
      isRecurring: item.isRecurring === 'true' || item.isRecurring === true,
      recurrence: item.isRecurring ? {
        frequency: item.frequency || 'weekly',
        endDate: item.endDate || ''
      } : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  };

  const parseCSV = (file: File) => {
    setIsUploading(true);
    
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const validation = validateData(results.data);
          
          if (!validation.valid) {
            setError(validation.error || "Invalid data format");
            setIsUploading(false);
            return;
          }
          
          const schedules = convertToSchedules(results.data);
          setParsedData(schedules);
          setIsVerified(true);
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
    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const validation = validateData(jsonData);
        
        if (!validation.valid) {
          setError(validation.error || "Invalid data format");
          setIsUploading(false);
          return;
        }
        
        const schedules = convertToSchedules(jsonData);
        setParsedData(schedules);
        setIsVerified(true);
        setIsUploading(false);
      } catch (err) {
        setError(`Error parsing Excel: ${err instanceof Error ? err.message : String(err)}`);
        setIsUploading(false);
      }
    };
    
    reader.onerror = () => {
      setError("Error reading the file");
      setIsUploading(false);
    };
    
    reader.readAsBinaryString(file);
  };

  const handleVerifyFile = () => {
    if (!file) return;
    
    setError(null);

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      parseCSV(file);
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      parseExcel(file);
    } else {
      setError("Unsupported file format. Please upload a CSV or Excel file.");
    }
  };

  const handleImport = () => {
    if (parsedData.length) {
      onSchedulesImported(parsedData);
      handleModalClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleModalClose} />
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="relative bg-white rounded-lg w-full max-w-lg p-6">
          <button
            onClick={handleModalClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <RiCloseLine size={24} />
          </button>

          <h2 className="text-xl font-semibold mb-4">Import Calendar Data</h2>
          
          <div className="mb-6">
            <p className="text-sm text-slate-600 mb-4">
              Upload a CSV or Excel file with schedule data. The file must include the required columns.
            </p>
            
            <div className="mb-4">
              <div className="flex items-center justify-center w-full">
                <label 
                  className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <RiUpload2Line className="w-10 h-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">CSV, XLS, XLSX</p>
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
              {file && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected file: <span className="font-medium">{file.name}</span>
                </div>
              )}
            </div>
            
            {file && !isVerified && (
              <div className="flex justify-center mt-4">
                <ButtonProps
                  variant="secondary"
                  className="gap-2"
                  onClick={handleVerifyFile}
                  disabled={isUploading}
                >
                  {isUploading ? 'Verifying...' : 'Verify File Data'}
                </ButtonProps>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {isVerified && parsedData.length > 0 && (
              <div className="mt-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-md text-sm flex items-center mb-4">
                  <RiCheckLine className="mr-2" />
                  File verified successfully! Found {parsedData.length} schedule items.
                </div>
                
                <h3 className="font-medium text-sm mb-2">Preview:</h3>
                <div className="max-h-40 overflow-y-auto border rounded-md">
                  <table className="min-w-full border-collapse text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-2 border-b text-left">Title</th>
                        <th className="p-2 border-b text-left">Type</th>
                        <th className="p-2 border-b text-left">Date</th>
                        <th className="p-2 border-b text-left">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.slice(0, 5).map((item, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="p-2 border-b">{item.title}</td>
                          <td className="p-2 border-b">{item.type}</td>
                          <td className="p-2 border-b">{item.date}</td>
                          <td className="p-2 border-b">{item.startTime} - {item.endTime}</td>
                        </tr>
                      ))}
                      {parsedData.length > 5 && (
                        <tr>
                          <td colSpan={4} className="p-2 text-center text-gray-500">
                            ...and {parsedData.length - 5} more items
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
            <ButtonProps
              variant="secondary"
              onClick={handleModalClose}
              className="gap-2"
            >
              Cancel
            </ButtonProps>
            
            {isVerified && parsedData.length > 0 && (
              <ButtonProps
                variant="primary"
                onClick={handleImport}
                className="gap-2"
              >
                <RiCheckLine />
                Import {parsedData.length} Items
              </ButtonProps>
            )}
          </div>
          
          <div className="mt-6 text-xs text-slate-600">
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
              <li>endDate - End date for recurring events (optional)</li>
              <li>description - Event description (optional)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleFileUpload;
