import React from 'react';
import './ResumeTemplate.css';

const ResumeTemplate = ({ resumeData, templateId = 1 }) => {
  if (!resumeData) return null;

  const { personalDetails, education, experience, skills, projects } = resumeData;

  // Template 1: Professional Modern
  const renderProfessionalTemplate = () => (
    <div className="resume-template professional" id="resume-content">
      {/* Header */}
      <div className="resume-header">
        <div className="header-left">
          <h1 className="name">{personalDetails?.fullName || 'Your Name'}</h1>
          <p className="title">Software Developer</p>
        </div>
        <div className="header-right">
          <div className="contact-info">
            <p><i className="icon">📧</i> {personalDetails?.email || 'email@example.com'}</p>
            <p><i className="icon">📱</i> {personalDetails?.phone || '+1 (555) 123-4567'}</p>
            {personalDetails?.address && (
              <p><i className="icon">📍</i> {personalDetails.address}</p>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="resume-section">
        <h2>Professional Summary</h2>
        <p>
          Experienced software developer with expertise in modern web technologies. 
          Passionate about creating efficient, scalable solutions and continuously learning new technologies.
        </p>
      </div>

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="resume-section">
          <h2>Professional Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="exp-header">
                <h3>{exp.role}</h3>
                <span className="company">{exp.company}</span>
                <span className="duration">{exp.duration}</span>
              </div>
              <p className="exp-description">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="resume-section">
          <h2>Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="education-item">
              <div className="edu-header">
                <h3>{edu.degree}</h3>
                <span className="school">{edu.school}</span>
                <span className="year">{edu.year}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="resume-section">
          <h2>Technical Skills</h2>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="resume-section">
          <h2>Projects</h2>
          {projects.map((project, index) => (
            <div key={index} className="project-item">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Template 2: Creative
  const renderCreativeTemplate = () => (
    <div className="resume-template creative" id="resume-content">
      {/* Header */}
      <div className="resume-header creative-header">
        <div className="header-main">
          <h1 className="name">{personalDetails?.fullName || 'Your Name'}</h1>
          <p className="title">Creative Developer</p>
        </div>
        <div className="contact-info creative-contact">
          <p><i className="icon">📧</i> {personalDetails?.email || 'email@example.com'}</p>
          <p><i className="icon">📱</i> {personalDetails?.phone || '+1 (555) 123-4567'}</p>
          {personalDetails?.address && (
            <p><i className="icon">📍</i> {personalDetails.address}</p>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="resume-section creative-section">
        <h2>About Me</h2>
        <p>
          Creative and innovative developer who loves turning ideas into reality. 
          Passionate about user experience and creating beautiful, functional applications.
        </p>
      </div>

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="resume-section creative-section">
          <h2>Work Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="experience-item creative-exp">
              <div className="exp-header">
                <h3>{exp.role}</h3>
                <span className="company">{exp.company}</span>
                <span className="duration">{exp.duration}</span>
              </div>
              <p className="exp-description">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="resume-section creative-section">
          <h2>Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="education-item creative-edu">
              <div className="edu-header">
                <h3>{edu.degree}</h3>
                <span className="school">{edu.school}</span>
                <span className="year">{edu.year}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="resume-section creative-section">
          <h2>Skills & Technologies</h2>
          <div className="skills-grid creative-skills">
            {skills.map((skill, index) => (
              <span key={index} className="skill-tag creative-skill">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="resume-section creative-section">
          <h2>Featured Projects</h2>
          {projects.map((project, index) => (
            <div key={index} className="project-item creative-project">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Template 3: Minimal
  const renderMinimalTemplate = () => (
    <div className="resume-template minimal" id="resume-content">
      {/* Header */}
      <div className="resume-header minimal-header">
        <h1 className="name">{personalDetails?.fullName || 'Your Name'}</h1>
        <div className="contact-info minimal-contact">
          <p>{personalDetails?.email || 'email@example.com'}</p>
          <p>{personalDetails?.phone || '+1 (555) 123-4567'}</p>
          {personalDetails?.address && <p>{personalDetails.address}</p>}
        </div>
      </div>

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="resume-section minimal-section">
          <h2>Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="experience-item minimal-exp">
              <div className="exp-header">
                <h3>{exp.role}</h3>
                <span className="company">{exp.company}</span>
                <span className="duration">{exp.duration}</span>
              </div>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="resume-section minimal-section">
          <h2>Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="education-item minimal-edu">
              <h3>{edu.degree}</h3>
              <p>{edu.school} • {edu.year}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="resume-section minimal-section">
          <h2>Skills</h2>
          <p>{skills.join(', ')}</p>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="resume-section minimal-section">
          <h2>Projects</h2>
          {projects.map((project, index) => (
            <div key={index} className="project-item minimal-project">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Template 4: Technical
  const renderTechnicalTemplate = () => (
    <div className="resume-template technical" id="resume-content">
      {/* Header */}
      <div className="resume-header technical-header">
        <div className="header-left">
          <h1 className="name">{personalDetails?.fullName || 'Your Name'}</h1>
          <p className="title">Software Engineer</p>
        </div>
        <div className="header-right">
          <div className="contact-info technical-contact">
            <p><i className="icon">📧</i> {personalDetails?.email || 'email@example.com'}</p>
            <p><i className="icon">📱</i> {personalDetails?.phone || '+1 (555) 123-4567'}</p>
            {personalDetails?.address && (
              <p><i className="icon">📍</i> {personalDetails.address}</p>
            )}
          </div>
        </div>
      </div>

      {/* Technical Summary */}
      <div className="resume-section technical-section">
        <h2>Technical Summary</h2>
        <p>
          Full-stack developer with expertise in modern web technologies, cloud platforms, and software architecture. 
          Experienced in building scalable applications and leading technical teams.
        </p>
      </div>

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="resume-section technical-section">
          <h2>Professional Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="experience-item technical-exp">
              <div className="exp-header">
                <h3>{exp.role}</h3>
                <span className="company">{exp.company}</span>
                <span className="duration">{exp.duration}</span>
              </div>
              <p className="exp-description">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="resume-section technical-section">
          <h2>Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="education-item technical-edu">
              <div className="edu-header">
                <h3>{edu.degree}</h3>
                <span className="school">{edu.school}</span>
                <span className="year">{edu.year}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Technical Skills */}
      {skills && skills.length > 0 && (
        <div className="resume-section technical-section">
          <h2>Technical Skills</h2>
          <div className="skills-grid technical-skills">
            {skills.map((skill, index) => (
              <span key={index} className="skill-tag technical-skill">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="resume-section technical-section">
          <h2>Technical Projects</h2>
          {projects.map((project, index) => (
            <div key={index} className="project-item technical-project">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render template based on templateId
  const renderTemplate = () => {
    switch (templateId) {
      case 1:
        return renderProfessionalTemplate();
      case 2:
        return renderCreativeTemplate();
      case 3:
        return renderMinimalTemplate();
      case 4:
        return renderTechnicalTemplate();
      default:
        return renderProfessionalTemplate();
    }
  };

  return renderTemplate();
};

export default ResumeTemplate;
