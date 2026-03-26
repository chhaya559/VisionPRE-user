import { useNavigate } from 'react-router-dom';
import './ProfileEdits.scss';

export default function EditBusinessProfile() {
  const navigate = useNavigate();

  return (
    <div className="edit-profile-container">
      <header className="edit-profile-header secondary">
        <button className="back-btn" onClick={() => navigate(-1)} style={{ position: 'static', marginBottom: '16px', padding: 0 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="20" height="20"><polyline points="15 18 9 12 15 6"></polyline></svg>
          Business Profile
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
              <input type="text" defaultValue="Quackpreneur" />
            </div>
            
            <div className="form-group">
               <label>Industry</label>
               <select defaultValue="Technology">
                  <option>Technology</option>
                  <option>Healthcare</option>
               </select>
            </div>

            <div className="form-group">
               <label>Company Size</label>
               <select defaultValue="1-10 employees">
                  <option>1-10 employees</option>
                  <option>11-50 employees</option>
               </select>
            </div>

            <div className="form-group">
               <label>Founded Year</label>
               <input type="text" defaultValue="2021" />
            </div>

            <div className="form-group">
               <label>Annual Revenue</label>
               <select defaultValue="Under $100K">
                  <option>Under $100K</option>
                  <option>$100K - $500K</option>
               </select>
            </div>

            <div className="form-group">
               <label>Website</label>
               <input type="text" defaultValue="www.quackpreneur.ca" />
            </div>

            <div className="form-group">
               <label>Company Description</label>
               <textarea defaultValue="Innovative tech solutions for modern businesses..."></textarea>
            </div>
          </div>
        </div>

        <button className="btn-save" onClick={() => navigate(-1)}>Save Changes</button>
      </div>
    </div>
  );
}
