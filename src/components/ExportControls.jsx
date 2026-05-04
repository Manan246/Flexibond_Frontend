import React, { useState } from 'react';
import { FiDownload, FiFileText, FiImage } from 'react-icons/fi';

const ExportControls = ({ pageTitle = 'Dashboard' }) => {
  const [loading, setLoading] = useState(false);

  const captureScreenshot = async (format) => {
    try {
      setLoading(true);
      
      const targetElement = document.querySelector('.page-content');
      if (!targetElement) {
        alert('Could not find dashboard layout to export.');
        return;
      }

      // Hide toggle buttons / non-printable actions temporarily
      document.body.classList.add('is-exporting');
      const toggleBars = document.querySelectorAll('.metric-toggle, .filter-bar, .ai-insights-btn, button');
      toggleBars.forEach(el => el.style.visibility = 'hidden');

      if (format === 'image') {
        const canvas = await window.html2canvas(targetElement, {
          scale: 2, // Higher resolution
          useCORS: true,
          logging: false,
          backgroundColor: '#f8fafc' // Standard light dashboard background
        });

        // Restore UI
        document.body.classList.remove('is-exporting');
        toggleBars.forEach(el => el.style.visibility = 'visible');

        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `${pageTitle}_Export_${new Date().toISOString().split('T')[0]}.png`;
        link.click();
      } 
      
      else if (format === 'pdf') {
        const canvas = await window.html2canvas(targetElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#f8fafc'
        });

        // Restore UI
        document.body.classList.remove('is-exporting');
        toggleBars.forEach(el => el.style.visibility = 'visible');

        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 210; // A4 Width in mm
        const pageHeight = 295; // A4 Height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add extra pages if needed
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`${pageTitle}_Export_${new Date().toISOString().split('T')[0]}.pdf`);
      }
    } catch (error) {
      console.error('Export Error:', error);
      alert('Failed to export dashboard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button
        disabled={loading}
        onClick={() => captureScreenshot('pdf')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          background: '#fff',
          color: 'var(--text-primary)',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => { if(!loading) e.currentTarget.style.background = 'var(--bg-light)'; }}
        onMouseLeave={(e) => { if(!loading) e.currentTarget.style.background = '#fff'; }}
      >
        <FiFileText />
        <span>{loading ? 'Exporting...' : 'PDF'}</span>
      </button>

      <button
        disabled={loading}
        onClick={() => captureScreenshot('image')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          background: '#fff',
          color: 'var(--text-primary)',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => { if(!loading) e.currentTarget.style.background = 'var(--bg-light)'; }}
        onMouseLeave={(e) => { if(!loading) e.currentTarget.style.background = '#fff'; }}
      >
        <FiImage />
        <span>{loading ? 'Exporting...' : 'Image'}</span>
      </button>
    </div>
  );
};

export default ExportControls;
