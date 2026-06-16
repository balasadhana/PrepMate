import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ResumePreview from '../../components/ResumePreview';
import '../../styles/ResumeBuilder.css';

const ResumeBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
      linkedin: ''
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: []
  });

  const templates = [
    {
      id: 1,
      name: 'Professional',
      description: 'Clean and modern design suitable for corporate positions',
      image: '📄',
      category: 'Professional'
    },
    {
      id: 2,
      name: 'Creative',
      description: 'Colorful and creative design for creative industries',
      image: '🎨',
      category: 'Creative'
    },
    {
      id: 3,
      name: 'Minimal',
      description: 'Simple and minimal design focusing on content',
      image: '⚪',
      category: 'Minimal'
    },
    {
      id: 4,
      name: 'Technical',
      description: 'Technical-focused design for IT and engineering roles',
      image: '💻',
      category: 'Technical'
    }
  ];

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleInputChange = (section, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addSectionItem = (section) => {
    const newItem = section === 'education' ? {
      degree: '',
      institution: '',
      year: '',
      gpa: ''
    } : section === 'experience' ? {
      title: '',
      company: '',
      duration: '',
      description: ''
    } : section === 'skills' ? {
      category: '',
      skills: ''
    } : section === 'projects' ? {
      title: '',
      description: '',
      technologies: '',
      link: ''
    } : {
      name: '',
      issuer: '',
      year: '',
      link: ''
    };

    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const removeSectionItem = (section, index) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const updateSectionItem = (section, index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewResumeData, setPreviewResumeData] = useState(null);

  const API_BASE_URL = 'https://prepmate-backend-wy02.onrender.com';

  const fetchResumes = async () => {
    try {
      setError('');
      setLoading(true);
      console.log('[GET] /api/resumes');
      const res = await axios.get(`${API_BASE_URL}/api/resumes`);
      setResumes(res.data || []);
    } catch (e) {
      console.error('[GET] /api/resumes error:', e);
      setError(e?.response?.data?.error || e?.message || 'Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResumes(); }, []);

  const saveResume = async () => {
    try {
      setError('');
      setSuccess('');
      const payload = {
        personalDetails: {
          fullName: resumeData.personalInfo.name,
          email: resumeData.personalInfo.email,
          phone: resumeData.personalInfo.phone,
          address: ''
        },
        education: resumeData.education.map(e => ({
          school: e.institution,
          degree: e.degree,
          year: e.year
        })),
        experience: resumeData.experience.map(e => ({
          company: e.company,
          role: e.title,
          duration: e.duration,
          description: e.description
        })),
        skills: resumeData.skills.flatMap(s => (s.skills ? s.skills.split(',').map(t => t.trim()).filter(Boolean) : [])),
        projects: resumeData.projects.map(p => ({ title: p.title, description: p.description }))
      };
      console.log('[POST] /api/resumes payload:', payload);
      await axios.post(`${API_BASE_URL}/api/resumes`, payload);
      setSuccess('Resume saved successfully!');
      await fetchResumes();
    } catch (err) {
      console.error('[POST] /api/resumes error:', err);
      const details = err?.response?.data?.details || '';
      const msg = err?.response?.data?.error || err?.message || 'Failed to save resume';
      setError(details ? `${msg} (${details})` : msg);
    }
  };

  const previewResume = () => {
    const previewData = {
      personalDetails: {
        fullName: resumeData.personalInfo.name,
        email: resumeData.personalInfo.email,
        phone: resumeData.personalInfo.phone,
        address: ''
      },
      education: resumeData.education.map(e => ({
        school: e.institution,
        degree: e.degree,
        year: e.year
      })),
      experience: resumeData.experience.map(e => ({
        company: e.company,
        role: e.title,
        duration: e.duration,
        description: e.description
      })),
      skills: resumeData.skills.flatMap(s => (s.skills ? s.skills.split(',').map(t => t.trim()).filter(Boolean) : [])),
      projects: resumeData.projects.map(p => ({ title: p.title, description: p.description }))
    };
    setPreviewResumeData(previewData);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewResumeData(null);
  };

  const previewSavedResume = (resume) => {
    setPreviewResumeData(resume);
    setShowPreview(true);
  };

  return (
    <div className="resume-builder">
      <div className="builder-header">
        <h1>Resume Builder</h1>
        <p>Create a professional resume with our easy-to-use builder</p>
      </div>

      {/* Template Selection */}
      <div className="template-section">
        <h2>Choose Template</h2>
        <div className="template-grid">
          {templates.map(template => (
            <div
              key={template.id}
              className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="template-image">{template.image}</div>
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              <span className="template-category">{template.category}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedTemplate && (
        <div className="resume-form">
          <div className="form-header">
            <h2>Build Your Resume</h2>
            <p>Selected Template: {selectedTemplate.name}</p>
          </div>

          {/* Personal Information */}
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={resumeData.personalInfo.name}
                  onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={resumeData.personalInfo.email}
                  onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="url"
                  value={resumeData.personalInfo.linkedin}
                  onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)}
                  placeholder="Enter your LinkedIn URL"
                />
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="form-section">
            <div className="section-header">
              <h3>Education</h3>
              <button
                className="add-btn"
                onClick={() => addSectionItem('education')}
              >
                + Add Education
              </button>
            </div>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="section-item">
                <div className="item-header">
                  <h4>Education #{index + 1}</h4>
                  <button
                    className="remove-btn"
                    onClick={() => removeSectionItem('education', index)}
                  >
                    🗑️ Remove
                  </button>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateSectionItem('education', index, 'degree', e.target.value)}
                      placeholder="e.g., Bachelor of Science in Computer Science"
                    />
                  </div>
                  <div className="form-group">
                    <label>Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateSectionItem('education', index, 'institution', e.target.value)}
                      placeholder="e.g., University Name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => updateSectionItem('education', index, 'year', e.target.value)}
                      placeholder="e.g., 2020-2024"
                    />
                  </div>
                  <div className="form-group">
                    <label>GPA</label>
                    <input
                      type="text"
                      value={edu.gpa}
                      onChange={(e) => updateSectionItem('education', index, 'gpa', e.target.value)}
                      placeholder="e.g., 3.8/4.0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Experience */}
          <div className="form-section">
            <div className="section-header">
              <h3>Work Experience</h3>
              <button
                className="add-btn"
                onClick={() => addSectionItem('experience')}
              >
                + Add Experience
              </button>
            </div>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="section-item">
                <div className="item-header">
                  <h4>Experience #{index + 1}</h4>
                  <button
                    className="remove-btn"
                    onClick={() => removeSectionItem('experience', index)}
                  >
                    🗑️ Remove
                  </button>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Job Title</label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateSectionItem('experience', index, 'title', e.target.value)}
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                  <div className="form-group">
                    <label>Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateSectionItem('experience', index, 'company', e.target.value)}
                      placeholder="e.g., Tech Company Inc."
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration</label>
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => updateSectionItem('experience', index, 'duration', e.target.value)}
                      placeholder="e.g., Jan 2023 - Present"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateSectionItem('experience', index, 'description', e.target.value)}
                      placeholder="Describe your responsibilities and achievements..."
                      rows="4"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="form-section">
            <div className="section-header">
              <h3>Skills</h3>
              <button
                className="add-btn"
                onClick={() => addSectionItem('skills')}
              >
                + Add Skill Category
              </button>
            </div>
            {resumeData.skills.map((skill, index) => (
              <div key={index} className="section-item">
                <div className="item-header">
                  <h4>Skill Category #{index + 1}</h4>
                  <button
                    className="remove-btn"
                    onClick={() => removeSectionItem('skills', index)}
                  >
                    🗑️ Remove
                  </button>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={skill.category}
                      onChange={(e) => updateSectionItem('skills', index, 'category', e.target.value)}
                      placeholder="e.g., Programming Languages"
                    />
                  </div>
                  <div className="form-group">
                    <label>Skills</label>
                    <input
                      type="text"
                      value={skill.skills}
                      onChange={(e) => updateSectionItem('skills', index, 'skills', e.target.value)}
                      placeholder="e.g., Python, JavaScript, React"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Generate & Save */}
          <div className="generate-section">
            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}
            <div className="action-buttons">
              <button
                className="preview-btn"
                onClick={previewResume}
                disabled={!resumeData.personalInfo.name || !resumeData.personalInfo.email || !resumeData.personalInfo.phone}
              >
                <span className="btn-icon">👁️</span>
                Preview Resume
              </button>
              <button
                className="generate-btn"
                onClick={saveResume}
                disabled={!resumeData.personalInfo.name || !resumeData.personalInfo.email || !resumeData.personalInfo.phone}
              >
                <span className="btn-icon">💾</span>
                Save Resume
              </button>
            </div>
            <p className="generate-note">
              * Please fill in at least your name, email and phone to save the resume
            </p>
          </div>
        </div>
      )}

      {/* Saved Resumes */}
      <div className="saved-resumes-section">
        <h2>Saved Resumes</h2>
        {loading ? (
          <p>Loading resumes...</p>
        ) : (
          <div className="resumes-grid">
            {resumes.map(r => (
              <div key={r._id} className="resume-card">
                <div className="resume-card-header">
                  <h3>{r.personalDetails?.fullName}</h3>
                  <span className="date">📅 {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</span>
                </div>
                <div className="resume-card-content">
                  <p><strong>Email:</strong> {r.personalDetails?.email}</p>
                  <p><strong>Phone:</strong> {r.personalDetails?.phone}</p>
                  {r.education?.length ? (
                    <div>
                      <h4>Education</h4>
                      <ul>
                        {r.education.map((e, idx) => (
                          <li key={idx}>{e.degree} - {e.school} ({e.year})</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {r.experience?.length ? (
                    <div>
                      <h4>Experience</h4>
                      <ul>
                        {r.experience.map((e, idx) => (
                          <li key={idx}><strong>{e.role}</strong> at {e.company} ({e.duration})</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {r.skills?.length ? (
                    <div>
                      <h4>Skills</h4>
                      <p>{r.skills.join(', ')}</p>
                    </div>
                  ) : null}
                  {r.projects?.length ? (
                    <div>
                      <h4>Projects</h4>
                      <ul>
                        {r.projects.map((p, idx) => (
                          <li key={idx}><strong>{p.title}:</strong> {p.description}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
                <div className="resume-card-actions">
                  <button
                    className="preview-resume-btn"
                    onClick={() => previewSavedResume(r)}
                  >
                    👁️ Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resume Preview Modal */}
      {showPreview && (
        <ResumePreview
          resumeData={previewResumeData}
          templateId={selectedTemplate?.id || 1}
          onClose={closePreview}
        />
      )}
    </div>
  );
};

export default ResumeBuilder; 