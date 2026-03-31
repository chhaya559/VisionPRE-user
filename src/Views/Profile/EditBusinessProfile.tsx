import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileEdits.scss';
import {
  useEditProfileMutation,
  useGetProfileQuery,
} from '../../Services/Api/module/UserApi';

export default function EditBusinessProfile() {
  const navigate = useNavigate();
  const { data: apiResponse, isLoading } = useGetProfileQuery({});
  const [editProfileMutation] = useEditProfileMutation();

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (apiResponse?.data) {
      setFormData(apiResponse.data);
    }
  }, [apiResponse]);

  if (isLoading)
    return (
      <div className="edit-profile-container">Loading business profile...</div>
    );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  async function EditProfile() {
    try {
      const response = await editProfileMutation(formData).unwrap();
      console.log(response, 'response from editing business profile');
      if (response.success) {
        navigate(-1);
      }
    } catch (err) {
      console.error('Error editing business profile', err);
    }
  }

  return (
    <div className="edit-profile-container">
      <header className="edit-profile-header secondary">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
          style={{ position: 'static', marginBottom: '16px', padding: 0 }}
        >
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
        <div className="header-info">
          <h1>Business Profile</h1>
          <p>Information used for grant applications</p>
        </div>
      </header>

      <div className="edit-profile-form">
        <div className="section">
          <div className="form-grid">
            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Industry</label>
              <select
                name="industry"
                value={formData.industry || 'Technology'}
                onChange={handleInputChange}
              >
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <div className="form-group">
              <label>Company Size</label>
              <select
                name="companySize"
                value={formData.companySize || '1-10 employees'}
                onChange={handleInputChange}
              >
                <option value="1-10 employees">1-10 employees</option>
                <option value="11-50 employees">11-50 employees</option>
                <option value="51-200 employees">51-200 employees</option>
                <option value="200+ employees">200+ employees</option>
              </select>
            </div>

            <div className="form-group">
              <label>Founded Year</label>
              <input
                type="text"
                name="foundedYear"
                value={formData.foundedYear || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Annual Revenue</label>
              <select
                name="annualRevenue"
                value={formData.annualRevenue || 'Under $100K'}
                onChange={handleInputChange}
              >
                <option value="Under $100K">Under $100K</option>
                <option value="$100K - $500K">$100K - $500K</option>
                <option value="$500K - $1M">$500K - $1M</option>
                <option value="$1M+">$1M+</option>
              </select>
            </div>

            <div className="form-group">
              <label>Website</label>
              <input
                type="text"
                name="website"
                value={formData.website || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Company Description</label>
              <textarea
                name="companyDescription"
                value={formData.companyDescription || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <button className="btn-save" onClick={EditProfile}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
