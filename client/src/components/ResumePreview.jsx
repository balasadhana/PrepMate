import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ResumeTemplate from './ResumeTemplate';
import './ResumePreview.css';

const ResumePreview = ({ resumeData, templateId, onClose }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(templateId || 1);

  const templates = [
    { id: 1, name: 'Professional', description: 'Clean and modern design' },
    { id: 2, name: 'Creative', description: 'Colorful and creative design' },
    { id: 3, name: 'Minimal', description: 'Simple and minimal design' },
    { id: 4, name: 'Technical', description: 'Technical-focused design' }
  ];

  const generatePDF = async () => {
    if (!resumeData) return;

    try {
      setIsGeneratingPDF(true);
      
      const element = document.getElementById('resume-content');
      if (!element) {
        console.error('Resume content element not found');
        return;
      }

      // Create a clone of the element to avoid modifying the original
      const clone = element.cloneNode(true);
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      document.body.appendChild(clone);

      // Generate canvas from the clone
      const canvas = await html2canvas(clone, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: clone.scrollHeight
      });

      // Remove the clone
      document.body.removeChild(clone);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate filename
      const name = resumeData.personalDetails?.fullName || 'resume';
      const filename = `${name.replace(/\s+/g, '_')}_${selectedTemplate}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Download PDF
      pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleTemplateChange = (newTemplateId) => {
    setSelectedTemplate(newTemplateId);
  };

  if (!resumeData) {
    return (
      <div className="resume-preview-overlay">
        <div className="resume-preview-modal">
          <div className="modal-header">
            <h2>Resume Preview</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="modal-content">
            <p>No resume data available for preview.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-preview-overlay">
      <div className="resume-preview-modal">
        <div className="modal-header">
          <h2>Resume Preview</h2>
          <div className="header-actions">
            <select 
              value={selectedTemplate} 
              onChange={(e) => handleTemplateChange(Number(e.target.value))}
              className="template-selector"
            >
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name} - {template.description}
                </option>
              ))}
            </select>
            <button 
              className="download-btn"
              onClick={generatePDF}
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? 'Generating PDF...' : '📥 Download PDF'}
            </button>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
        </div>
        
        <div className="modal-content">
          <div className="preview-container">
            <ResumeTemplate 
              resumeData={resumeData} 
              templateId={selectedTemplate} 
            />
          </div>
        </div>
        
        <div className="modal-footer">
          <div className="template-info">
            <p>Template: <strong>{templates.find(t => t.id === selectedTemplate)?.name}</strong></p>
            <p>You can change the template above and download different versions</p>
          </div>
          <div className="footer-actions">
            <button 
              className="secondary-btn"
              onClick={() => window.print()}
            >
              🖨️ Print
            </button>
            <button 
              className="primary-btn"
              onClick={generatePDF}
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? 'Generating...' : '📥 Download PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
