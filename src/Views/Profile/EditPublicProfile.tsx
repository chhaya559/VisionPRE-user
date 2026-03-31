import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileEdits.scss';
import {
  useEditProfileMutation,
  useGetProfileQuery,
} from '../../Services/Api/module/UserApi';

export default function EditPublicProfile() {
  const navigate = useNavigate();
  const { data: apiResponse, isLoading } = useGetProfileQuery({});
  const [EditPublicProfileMutation] = useEditProfileMutation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    bio: '',
    companyName: '',
    industry: '',
    businessStage: '',
    businessDescription: '',
    entrepreneurProfile: [] as string[],
    goals: [] as string[],
  });

  useEffect(() => {
    if (apiResponse?.data) {
      const p = apiResponse.data;
      setFormData({
        firstName: p.firstName || '',
        lastName: p.lastName || '',
        email: p.email || '',
        phoneNumber: p.phoneNumber || '',
        bio: p.bio || '',
        companyName: p.companyName || '',
        industry: p.industry || 'Technology',
        businessStage: p.businessStage || 'Startup - First sales',
        businessDescription: p.businessDescription || '',
        entrepreneurProfile: p.entrepreneurProfile || [],
        goals: p.goals || [],
      });
    }
  }, [apiResponse]);

  if (isLoading)
    return <div className="edit-profile-container">Loading profile...</div>;

  const displayName = formData.firstName || 'User';
  const initialLetter = displayName.charAt(0).toUpperCase();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      entrepreneurProfile: prev.entrepreneurProfile.includes(tag)
        ? prev.entrepreneurProfile.filter((t) => t !== tag)
        : [...prev.entrepreneurProfile, tag],
    }));
  };

  const toggleGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  async function EditProfile() {
    try {
      const response = await EditPublicProfileMutation(formData).unwrap();
      console.log(response, 'response from editing public profile');
      if (response.success) {
        navigate(-1);
      }
    } catch (err) {
      console.error('Error editing public profile', err);
    }
  }

  return (
    <div className="edit-profile-container">
      <header className="edit-profile-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            width="20"
            height="20"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <div style={{ height: '40px' }} /> {/* Spacer */}
        <div className="avatar-edit">
          <div className="avatar-circle">{initialLetter}</div>
          <div className="camera-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        </div>
        <span className="change-photo">Change Photo</span>
      </header>

      <div className="edit-profile-form">
        {/* Personal Information */}
        <div className="section">
          <div className="section-header">
            <h3>Personal Information</h3>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name (First & Last)</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="section">
          <div className="section-header">
            <h3>Business Information</h3>
            <span className="step-badge">From onboarding</span>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <label style={{ margin: 0 }}>Company Name</label>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: '#10b981',
                    fontWeight: 800,
                  }}
                >
                  Step 2
                </span>
              </div>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <label style={{ margin: 0 }}>Industry</label>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: '#10b981',
                    fontWeight: 800,
                  }}
                >
                  Step 3
                </span>
              </div>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
              >
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div className="form-group">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <label style={{ margin: 0 }}>Business Stage</label>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: '#10b981',
                    fontWeight: 800,
                  }}
                >
                  Step 4
                </span>
              </div>
              <select
                name="businessStage"
                value={formData.businessStage}
                onChange={handleInputChange}
              >
                <option value="Ideation">Ideation</option>
                <option value="Startup - First sales">
                  Startup - First sales
                </option>
                <option value="Growth Stage">Growth Stage</option>
                <option value="Established">Established</option>
              </select>
            </div>
            <div className="form-group">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <label style={{ margin: 0 }}>Business Description</label>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: '#10b981',
                    fontWeight: 800,
                  }}
                >
                  Step 5
                </span>
              </div>
              <textarea
                name="businessDescription"
                value={formData.businessDescription}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Entrepreneur Profile */}
        <div className="section">
          <div className="section-header">
            <h3>Entrepreneur Profile</h3>
            <span className="step-badge">Step 6</span>
          </div>
          <p
            style={{
              fontSize: '0.8125rem',
              color: '#9ca3af',
              marginBottom: '16px',
            }}
          >
            Select all that apply
          </p>
          <div className="tags-grid">
            {[
              'Startup',
              'Innovation / Technology',
              'Woman entrepreneur',
              'Young entrepreneur',
              'Growth-stage',
              'Social impact',
              'Diverse background',
            ].map((tag) => (
              <span
                key={tag}
                className={`tag ${
                  formData.entrepreneurProfile.includes(tag) ? 'active' : ''
                }`}
                onClick={() => toggleTag(tag)}
                style={{ cursor: 'pointer' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Your Goal */}
        <div className="section">
          <div className="section-header">
            <h3>Your Goal</h3>
            <span className="step-badge">Step 7</span>
          </div>
          <div className="goals-list">
            {[
              {
                id: 'meet',
                label: 'Meet other entrepreneurs',
                icon: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />,
              },
              {
                id: 'apply',
                label: 'Apply for grants',
                icon: <polyline points="22 4 12 14.01 9 11.01" />,
              },
              {
                id: 'grow',
                label: 'Grow my business',
                icon: <line x1="12" y1="22.08" x2="12" y2="12" />,
              },
              {
                id: 'attend',
                label: 'Attend galas',
                icon: (
                  <rect x1="3" y1="4" width="18" height="18" rx="2" ry="2" />
                ),
              },
            ].map((goal) => (
              <div
                key={goal.id}
                className={`goal-item ${
                  formData.goals.includes(goal.id) ? 'active' : ''
                }`}
                onClick={() => toggleGoal(goal.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="icon-box">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    {goal.id === 'meet' && <circle cx="9" cy="7" r="4" />}
                    {goal.id === 'meet' && (
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    )}
                    {goal.id === 'meet' && (
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    )}
                    {goal.id === 'apply' && (
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    )}
                    {goal.id === 'grow' && (
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    )}
                    {goal.id === 'grow' && (
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    )}
                    {goal.id === 'attend' && (
                      <line x1="16" y1="2" x2="16" y2="6" />
                    )}
                    {goal.id === 'attend' && (
                      <line x1="8" y1="2" x2="8" y2="6" />
                    )}
                    {goal.id === 'attend' && (
                      <line x1="3" y1="10" x2="21" y2="10" />
                    )}
                    {goal.icon}
                  </svg>
                </div>
                <span>{goal.label}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="btn-save" onClick={EditProfile}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
