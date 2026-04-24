import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiFileText, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { uploadFile } from '../services/api';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    disabled: uploading
  });

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setProgress(10);
      
      const res = await uploadFile(file, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        // Uploading to server is max 50% of the visual progress, the rest is processing
        setProgress(Math.min(percentCompleted / 2, 50));
      });

      // Simulate processing time
      let currProgress = 50;
      const interval = setInterval(() => {
        currProgress += 5;
        if (currProgress >= 95) {
          clearInterval(interval);
        } else {
          setProgress(currProgress);
        }
      }, 500);

      if (res.data.success) {
        clearInterval(interval);
        setProgress(100);
        setResult(res.data.result);
        toast.success(res.data.message);
        setFile(null); // Clear file after success
      }
    } catch (err) {
      setProgress(0);
      setResult({
        error: true,
        message: err.response?.data?.message || 'Upload failed',
        details: err.response?.data?.existingUpload
      });
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Data Upload</h1>
        <p>Upload Excel or PDF files containing sales, inventory, or billing data. The system will automatically classify and process the records.</p>
      </div>

      <div 
        {...getRootProps()} 
        className={`upload-zone ${isDragActive ? 'active' : ''} ${uploading ? 'disabled' : ''}`}
        style={uploading ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
      >
        <input {...getInputProps()} />
        <FiUploadCloud className="upload-icon" />
        {isDragActive ? (
          <h3>Drop the file here...</h3>
        ) : (
          <h3>Drag & drop a file here, or click to select</h3>
        )}
        <p>Supports .xlsx, .xls, and .pdf files (Max 50MB)</p>
      </div>

      {file && !uploading && !result && (
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FiFileText style={{ fontSize: '1.5rem', color: 'var(--primary-500)' }} />
            <div>
              <div style={{ fontWeight: 600 }}>{file.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
          </div>
          <button className="filter-bar btn-primary" onClick={handleUpload} style={{ margin: 0 }}>
            Upload & Process
          </button>
        </div>
      )}

      {uploading && (
        <div style={{ marginTop: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
            <span>Processing {file?.name}...</span>
            <span>{progress}%</span>
          </div>
          <div style={{ height: '8px', background: 'var(--primary-100)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary-500)', transition: 'width 0.3s ease' }}></div>
          </div>
          
          <div className="progress-steps">
            <div className={`progress-step ${progress >= 10 ? 'done' : 'active'}`}>
              <div className="step-circle">1</div>
              <span>Uploading</span>
            </div>
            <div className={`progress-step ${progress >= 50 ? 'done' : progress >= 10 ? 'active' : ''}`}>
              <div className="step-circle">2</div>
              <span>Parsing</span>
            </div>
            <div className={`progress-step ${progress >= 80 ? 'done' : progress >= 50 ? 'active' : ''}`}>
              <div className="step-circle">3</div>
              <span>Classifying & Saving</span>
            </div>
          </div>
        </div>
      )}

      {result && !result.error && (
        <div style={{ marginTop: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--success)', marginBottom: '16px' }}>
            <FiCheckCircle size={24} />
            <h3 style={{ margin: 0 }}>Upload Completed Successfully</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>Detected Data Type: <strong>{result.dataType.replace(/_/g, ' ').toUpperCase()}</strong></p>
          
          <div className="result-cards">
            <div className="result-card total">
              <div className="rc-value">{result.totalRecords}</div>
              <div className="rc-label">Total Records Found</div>
            </div>
            <div className="result-card inserted">
              <div className="rc-value">{result.inserted}</div>
              <div className="rc-label">Records Inserted</div>
            </div>
            <div className="result-card duplicates">
              <div className="rc-value">{result.duplicates}</div>
              <div className="rc-label">Duplicates Skipped</div>
            </div>
            <div className="result-card errors">
              <div className="rc-value">{result.errors}</div>
              <div className="rc-label">Errors</div>
            </div>
          </div>

          {result.errorMessages && result.errorMessages.length > 0 && (
            <div style={{ marginTop: '20px', padding: '16px', background: 'var(--danger-bg)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ color: 'var(--danger)', marginBottom: '10px' }}>Error Details:</h4>
              <ul style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', paddingLeft: '20px' }}>
                {result.errorMessages.map((msg, i) => <li key={i}>{msg}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      {result && result.error && (
        <div style={{ marginTop: '30px', padding: '20px', background: 'var(--danger-bg)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--danger)', marginBottom: '16px' }}>
            <FiXCircle size={24} />
            <h3 style={{ margin: 0 }}>Upload Failed</h3>
          </div>
          <p style={{ color: 'var(--danger)' }}>{result.message}</p>
          
          {result.details && (
            <div style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <p><strong>File Name:</strong> {result.details.fileName}</p>
              <p><strong>Upload Date:</strong> {new Date(result.details.uploadDate).toLocaleString()}</p>
              <p><strong>Data Type:</strong> {result.details.dataType}</p>
              <p><strong>Records:</strong> {result.details.insertedCount}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Upload;
