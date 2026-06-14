import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../styles/UserResumeBuilderPage.css';

const UserResumeBuilderPage = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      website: ''
    },
    education: [{
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: ''
    }],
    experience: [{
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: ['']
    }],
    skills: [{
      category: '',
      skills: ['']
    }],
    projects: [{
      title: '',
      description: '',
      technologies: [''],
      link: '',
      startDate: '',
      endDate: ''
    }],
    certifications: [{
      name: '',
      issuer: '',
      date: '',
      link: ''
    }],
    languages: [{
      language: '',
      proficiency: ''
    }]
  });

  const API_BASE_URL = 'http://localhost:5000/api/user';

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Fetch available templates
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/resume-templates`);
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (section, index, field, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      
      if (index !== undefined) {
        // Handle array fields (education, experience, etc.)
        newData[section] = [...prev[section]];
        newData[section][index] = { ...newData[section][index], [field]: value };
      } else {
        // Handle object fields (personalInfo)
        newData[section] = { ...prev[section], [field]: value };
      }
      
      return newData;
    });
  };

  // Add new item to array fields
  const addItem = (section) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], getEmptyItem(section)]
    }));
  };

  // Remove item from array fields
  const removeItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  // Get empty item structure for different sections
  const getEmptyItem = (section) => {
    const emptyItems = {
      education: {
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
        description: ''
      },
      experience: {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        achievements: ['']
      },
      skills: {
        category: '',
        skills: ['']
      },
      projects: {
        title: '',
        description: '',
        technologies: [''],
        link: '',
        startDate: '',
        endDate: ''
      },
      certifications: {
        name: '',
        issuer: '',
        date: '',
        link: ''
      },
      languages: {
        language: '',
        proficiency: ''
      }
    };
    return emptyItems[section];
  };

  // Handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  // Save resume data
  const saveResume = async () => {
    if (!selectedTemplate) {
      alert('Please select a template first');
      return;
    }

    try {
      setLoading(true);
      const userId = 'temp-user-id'; // Replace with actual user ID from auth
      
      await axios.post(`${API_BASE_URL}/resumes`, {
        userId,
        templateId: selectedTemplate._id,
        ...formData
      });
      
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Failed to save resume');
    } finally {
      setLoading(false);
    }
  };

  // Generate and download PDF
  const generatePDF = async () => {
    if (!selectedTemplate) {
      alert('Please select a template first');
      return;
    }

    try {
      setGeneratingPDF(true);
      
      // Create a temporary div for PDF generation
      const pdfContent = document.createElement('div');
      pdfContent.innerHTML = generateResumeHTML();
      pdfContent.style.position = 'absolute';
      pdfContent.style.left = '-9999px';
      pdfContent.style.top = '0';
      pdfContent.style.width = '800px';
      pdfContent.style.padding = '20px';
      pdfContent.style.backgroundColor = 'white';
      pdfContent.style.fontFamily = 'Arial, sans-serif';
      pdfContent.style.fontSize = '12px';
      pdfContent.style.lineHeight = '1.4';
      
      document.body.appendChild(pdfContent);

      // Convert to canvas
      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      // Remove temporary element
      document.body.removeChild(pdfContent);

      // Generate PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download PDF
      const fileName = `${formData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Generate HTML for PDF
  const generateResumeHTML = () => {
    return `
      <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h1 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
          ${formData.personalInfo.name || 'Your Name'}
        </h1>
        
        <div style="margin-bottom: 20px;">
          <p style="margin: 5px 0;">${formData.personalInfo.email || 'email@example.com'}</p>
          <p style="margin: 5px 0;">${formData.personalInfo.phone || 'Phone'}</p>
          <p style="margin: 5px 0;">${formData.personalInfo.address || 'Address'}</p>
          ${formData.personalInfo.linkedin ? `<p style="margin: 5px 0;">LinkedIn: ${formData.personalInfo.linkedin}</p>` : ''}
          ${formData.personalInfo.website ? `<p style="margin: 5px 0;">Website: ${formData.personalInfo.website}</p>` : ''}
        </div>

        ${formData.education.length > 0 && formData.education[0].institution ? `
          <h2 style="color: #667eea; border-bottom: 1px solid #ddd; margin-top: 30px;">Education</h2>
          ${formData.education.map(edu => `
            <div style="margin-bottom: 15px;">
              <h3 style="margin: 0;">${edu.institution}</h3>
              <p style="margin: 5px 0; font-weight: bold;">${edu.degree} ${edu.field ? `- ${edu.field}` : ''}</p>
              <p style="margin: 5px 0; color: #666;">${edu.startDate} - ${edu.endDate || 'Present'}</p>
              ${edu.gpa ? `<p style="margin: 5px 0;">GPA: ${edu.gpa}</p>` : ''}
              ${edu.description ? `<p style="margin: 5px 0;">${edu.description}</p>` : ''}
            </div>
          `).join('')}
        ` : ''}

        ${formData.experience.length > 0 && formData.experience[0].company ? `
          <h2 style="color: #667eea; border-bottom: 1px solid #ddd; margin-top: 30px;">Experience</h2>
          ${formData.experience.map(exp => `
            <div style="margin-bottom: 15px;">
              <h3 style="margin: 0;">${exp.company}</h3>
              <p style="margin: 5px 0; font-weight: bold;">${exp.position}</p>
              <p style="margin: 5px 0; color: #666;">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</p>
              ${exp.description ? `<p style="margin: 5px 0;">${exp.description}</p>` : ''}
              ${exp.achievements.length > 0 && exp.achievements[0] ? `
                <ul style="margin: 5px 0;">
                  ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        ` : ''}

        ${formData.skills.length > 0 && formData.skills[0].category ? `
          <h2 style="color: #667eea; border-bottom: 1px solid #ddd; margin-top: 30px;">Skills</h2>
          ${formData.skills.map(skillGroup => `
            <div style="margin-bottom: 15px;">
              <h3 style="margin: 0;">${skillGroup.category}</h3>
              <p style="margin: 5px 0;">${skillGroup.skills.join(', ')}</p>
            </div>
          `).join('')}
        ` : ''}

        ${formData.projects.length > 0 && formData.projects[0].title ? `
          <h2 style="color: #667eea; border-bottom: 1px solid #ddd; margin-top: 30px;">Projects</h2>
          ${formData.projects.map(project => `
            <div style="margin-bottom: 15px;">
              <h3 style="margin: 0;">${project.title}</h3>
              ${project.description ? `<p style="margin: 5px 0;">${project.description}</p>` : ''}
              ${project.technologies.length > 0 && project.technologies[0] ? 
                `<p style="margin: 5px 0;"><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>` : ''}
              ${project.link ? `<p style="margin: 5px 0;"><strong>Link:</strong> ${project.link}</p>` : ''}
            </div>
          `).join('')}
        ` : ''}
      </div>
    `;
  };

  return (
    <div className="resume-builder-page">
      <div className="container">
        <h1>Resume Builder</h1>
        
        <div className="builder-layout">
          {/* Left Panel - Form */}
          <div className="form-panel">
            <h2>Personal Information</h2>
            
            {/* Personal Info */}
            <div className="form-section">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={formData.personalInfo.name}
                    onChange={(e) => handleInputChange('personalInfo', null, 'name', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) => handleInputChange('personalInfo', null, 'email', e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.personalInfo.phone}
                    onChange={(e) => handleInputChange('personalInfo', null, 'phone', e.target.value)}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={formData.personalInfo.address}
                    onChange={(e) => handleInputChange('personalInfo', null, 'address', e.target.value)}
                    placeholder="City, State, Country"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>LinkedIn</label>
                  <input
                    type="url"
                    value={formData.personalInfo.linkedin}
                    onChange={(e) => handleInputChange('personalInfo', null, 'linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    value={formData.personalInfo.website}
                    onChange={(e) => handleInputChange('personalInfo', null, 'website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>

            {/* Education */}
            <h2>Education</h2>
            <div className="form-section">
              {formData.education.map((edu, index) => (
                <div key={index} className="education-item">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Institution *</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleInputChange('education', index, 'institution', e.target.value)}
                        placeholder="University Name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Degree *</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleInputChange('education', index, 'degree', e.target.value)}
                        placeholder="Bachelor's Degree"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Field of Study</label>
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => handleInputChange('education', index, 'field', e.target.value)}
                        placeholder="Computer Science"
                      />
                    </div>
                    <div className="form-group">
                      <label>GPA</label>
                      <input
                        type="text"
                        value={edu.gpa}
                        onChange={(e) => handleInputChange('education', index, 'gpa', e.target.value)}
                        placeholder="3.8/4.0"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="date"
                        value={edu.startDate}
                        onChange={(e) => handleInputChange('education', index, 'startDate', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="date"
                        value={edu.endDate}
                        onChange={(e) => handleInputChange('education', index, 'endDate', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={edu.description}
                      onChange={(e) => handleInputChange('education', index, 'description', e.target.value)}
                      placeholder="Brief description of your studies..."
                      rows="3"
                    />
                  </div>
                  
                  {formData.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem('education', index)}
                      className="remove-btn"
                    >
                      Remove Education
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addItem('education')} className="add-btn">
                + Add Education
              </button>
            </div>

            {/* Experience */}
            <h2>Experience</h2>
            <div className="form-section">
              {formData.experience.map((exp, index) => (
                <div key={index} className="experience-item">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Company *</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleInputChange('experience', index, 'company', e.target.value)}
                        placeholder="Company Name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Position *</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => handleInputChange('experience', index, 'position', e.target.value)}
                        placeholder="Job Title"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="date"
                        value={exp.startDate}
                        onChange={(e) => handleInputChange('experience', index, 'startDate', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="date"
                        value={exp.endDate}
                        onChange={(e) => handleInputChange('experience', index, 'endDate', e.target.value)}
                        disabled={exp.current}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => handleInputChange('experience', index, 'current', e.target.checked)}
                      />
                      Currently working here
                    </label>
                  </div>
                  
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => handleInputChange('experience', index, 'description', e.target.value)}
                      placeholder="Describe your role and responsibilities..."
                      rows="3"
                    />
                  </div>
                  
                  {formData.experience.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem('experience', index)}
                      className="remove-btn"
                    >
                      Remove Experience
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addItem('experience')} className="add-btn">
                + Add Experience
              </button>
            </div>

            {/* Skills */}
            <h2>Skills</h2>
            <div className="form-section">
              {formData.skills.map((skillGroup, index) => (
                <div key={index} className="skills-item">
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={skillGroup.category}
                      onChange={(e) => handleInputChange('skills', index, 'category', e.target.value)}
                      placeholder="e.g., Programming Languages, Tools, etc."
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={skillGroup.skills.join(', ')}
                      onChange={(e) => handleInputChange('skills', index, 'skills', e.target.value.split(',').map(s => s.trim()))}
                      placeholder="JavaScript, React, Node.js"
                    />
                  </div>
                  
                  {formData.skills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem('skills', index)}
                      className="remove-btn"
                    >
                      Remove Skill Category
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addItem('skills')} className="add-btn">
                + Add Skill Category
              </button>
            </div>
          </div>

          {/* Right Panel - Template Selection & Preview */}
          <div className="preview-panel">
            {/* Template Selection */}
            <div className="template-selection">
              <h2>Choose Template</h2>
              {loading ? (
                <div className="loading">Loading templates...</div>
              ) : (
                <div className="templates-grid">
                  {templates.map((template) => (
                    <div
                      key={template._id}
                      className={`template-card ${selectedTemplate?._id === template._id ? 'selected' : ''}`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <h3>{template.title}</h3>
                      <div className="template-tags">
                        {template.tags?.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                onClick={saveResume}
                disabled={loading || !selectedTemplate}
                className="save-btn"
              >
                {loading ? 'Saving...' : 'Save Resume'}
              </button>
              
              <button
                onClick={() => setShowPreview(!showPreview)}
                disabled={!selectedTemplate}
                className="preview-btn"
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              
              <button
                onClick={generatePDF}
                disabled={generatingPDF || !selectedTemplate}
                className="download-btn"
              >
                {generatingPDF ? 'Generating PDF...' : 'Download PDF'}
              </button>
            </div>

            {/* Preview */}
            {showPreview && selectedTemplate && (
              <div className="preview-section">
                <h2>Preview</h2>
                <div className="preview-content">
                  <div dangerouslySetInnerHTML={{ __html: generateResumeHTML() }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserResumeBuilderPage; 