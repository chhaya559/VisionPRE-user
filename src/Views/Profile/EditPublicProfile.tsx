import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera,
  faCalendarDays,
  faChevronLeft,
  faCircleCheck,
  faCubes,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import './ProfileEdits.scss';
import {
  useEditProfileMutation,
  useGetProfileQuery,
} from '../../Services/Api/module/UserApi';
import { useTranslation } from 'react-i18next';
import Skeleton from '../../Shared/Components/Skeleton/Skeleton';
import { toast } from 'react-toastify';

export default function EditPublicProfile() {
  const navigate = useNavigate();
  const { data: apiResponse, isLoading } = useGetProfileQuery({});
  const [EditPublicProfileMutation] = useEditProfileMutation();
  const { t } = useTranslation('settings');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    companyName: '',
    industry: [] as string[],
    stage: '',
    businessDescription: '',
    profileType: [] as string[],
    goal: '',
    avatarUrl: '',
  });

  useEffect(() => {
    if (apiResponse?.data) {
      const p = apiResponse.data;
      const industryValue = Array.isArray(p.industry)
        ? p.industry
        : p.industry
          ? [p.industry]
          : ['Technology'];

      // Map goal if it comes back as a label instead of an ID
      const goalsMap: Record<string, string> = {
        'Meet other entrepreneurs': 'meet',
        'Apply for grants': 'apply',
        'Grow my business': 'grow',
        'Attend galas': 'attend',
      };
      const goalValue = goalsMap[p.goal] || p.goal || '';

      setFormData({
        firstName: p.firstName || '',
        lastName: p.lastName || '',
        phoneNumber: p.phoneNumber || '',
        companyName: p.companyName || '',
        industry: industryValue,
        stage: p.stage || p.businessStage || 'Startup - First sales',
        businessDescription: p.businessDescription || '',
        profileType: p.profileType || p.entrepreneurProfile || [],
        goal: goalValue,
        avatarUrl: p.avatarUrl || '',
      });
    }
  }, [apiResponse]);

  if (isLoading) {
    return (
      <div className="edit-profile-container loading-skeleton">
        <header className="edit-profile-header">
          <Skeleton variant="text" width="80px" height="24px" />
          <div className="avatar-edit" style={{ marginTop: '20px' }}>
            <Skeleton variant="circular" width="80px" height="80px" />
          </div>
          <Skeleton variant="text" width="120px" style={{ marginTop: '12px' }} />
        </header>

        <div className="edit-profile-form" style={{ padding: '20px' }}>
          <div className="section mb-8">
            <Skeleton variant="text" width="200px" height="28px" className="mb-6" />
            <div className="form-grid">
              <Skeleton variant="text" width="100px" className="mb-2" />
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <Skeleton variant="rounded" height="40px" style={{ flex: 1 }} />
                <Skeleton variant="rounded" height="40px" style={{ flex: 1 }} />
              </div>
              <Skeleton variant="text" width="100px" className="mb-2" />
              <Skeleton variant="rounded" height="40px" />
            </div>
          </div>

          <div className="section">
            <Skeleton variant="text" width="200px" height="28px" className="mb-6" />
            <div className="form-grid">
              <Skeleton variant="rounded" height="40px" className="mb-4" />
              <Skeleton variant="rounded" height="40px" className="mb-4" />
              <Skeleton variant="rounded" height="100px" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = formData.firstName || t('editPublic.user');
  const initialLetter = displayName.charAt(0).toUpperCase();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'industry' ? [value] : value,
    }));
  };

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      profileType: prev.profileType.includes(tag)
        ? prev.profileType.filter((t) => t !== tag)
        : [...prev.profileType, tag],
    }));
  };

  const toggleGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      goal: prev.goal === goal ? '' : goal,
    }));
  };

  async function EditProfile() {
    try {
      const payload = {
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        companyName: formData.companyName || undefined,
        industry: formData.industry,
        stage: formData.stage || undefined,
        profileType: formData.profileType,
        businessDescription: formData.businessDescription || undefined,
        goal: formData.goal || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        avatarUrl: formData.avatarUrl || undefined,
      };

      console.log('Update Public Profile Request:', payload);
      const response = await EditPublicProfileMutation(payload).unwrap();
      console.log('Update Public Profile Response:', response);

      if (response.success) {
        toast.success(response.message, { position: 'top-right' });
        navigate(-1);
      }
    } catch (err: any) {
      console.error('Error editing public profile', err);
      toast.error(err?.data?.message || 'Update failed', { position: 'top-right' });
    }
  }

  return (
    <div className="edit-profile-container">
      <header className="edit-profile-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faChevronLeft} />
          {t('editPublic.back')}
        </button>
        <div className="header-spacer" />
        <div className="avatar-edit">
          <div className="avatar-circle">{initialLetter}</div>
          <div className="camera-icon">
            <FontAwesomeIcon icon={faCamera} />
          </div>
        </div>
        <span className="change-photo">{t('editPublic.changePhoto')}</span>
      </header>

      <div className="edit-profile-form">

        {/* Personal Information */}
        <div className="section">
          <div className="section-header">
            <h3>{t('editPublic.personalInfo')}</h3>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>{t('editPublic.fullName')}</label>
              <div className="name-inputs-row">
                <input type="text" name="firstName" placeholder={t('editPublic.firstName')} value={formData.firstName} onChange={handleInputChange} />
                <input type="text" name="lastName" placeholder={t('editPublic.lastName')} value={formData.lastName} onChange={handleInputChange} />
              </div>
            </div>
            <div className="form-group">
              <label>{t('editPublic.phone')}</label>
              <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="section">
          <div className="section-header">
            <h3>{t('editPublic.businessInfo')}</h3>
            <span className="step-badge">{t('editPublic.fromOnboarding')}</span>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <div className="label-row">
                <label>{t('editPublic.companyName')}</label>
                <span className="step-label">{t('editPublic.step2')}</span>
              </div>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <div className="label-row">
                <label>{t('editPublic.industry')}</label>
                <span className="step-label">{t('editPublic.step3')}</span>
              </div>
              <select name="industry" value={formData.industry[0] || 'Technology'} onChange={handleInputChange}>
                <option value="Technology">{t('editBusiness.technology')}</option>
                <option value="Healthcare">{t('editBusiness.healthcare')}</option>
                <option value="E-commerce">{t('editBusiness.ecommerce')}</option>
                <option value="Finance">{t('editBusiness.finance')}</option>
              </select>
            </div>
            <div className="form-group">
              <div className="label-row">
                <label>{t('editPublic.businessStage')}</label>
                <span className="step-label">{t('editPublic.step4')}</span>
              </div>
              <select name="stage" value={formData.stage} onChange={handleInputChange}>
                <option value="Ideation">{t('editPublic.ideation')}</option>
                <option value="Startup - First sales">{t('editPublic.startup')}</option>
                <option value="Growth Stage">{t('editPublic.growth')}</option>
                <option value="Established">{t('editPublic.established')}</option>
              </select>
            </div>
            <div className="form-group">
              <div className="label-row">
                <label>{t('editPublic.businessDescription')}</label>
                <span className="step-label">{t('editPublic.step5')}</span>
              </div>
              <textarea name="businessDescription" value={formData.businessDescription} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        {/* Entrepreneur Profile */}
        <div className="section">
          <div className="section-header">
            <h3>{t('editPublic.entrepreneurProfile')}</h3>
            <span className="step-badge">{t('editPublic.step6')}</span>
          </div>
          <p className="section-hint">{t('editPublic.selectAll')}</p>
          <div className="tags-grid">
            {[
              { id: 'Startup', key: 'startupTag' },
              { id: 'Innovation / Technology', key: 'innovation' },
              { id: 'Woman entrepreneur', key: 'woman' },
              { id: 'Young entrepreneur', key: 'young' },
              { id: 'Growth-stage', key: 'growthStage' },
              { id: 'Social impact', key: 'socialImpact' },
              { id: 'Diverse background', key: 'diverse' },
            ].map((tag) => (
              <span
                key={tag.id}
                className={`tag ${formData.profileType.includes(tag.id) ? 'active' : ''}`}
                onClick={() => toggleTag(tag.id)}
              >
                {t(`editPublic.${tag.key}`)}
              </span>
            ))}
          </div>
        </div>

        {/* Your Goal */}
        <div className="section">
          <div className="section-header">
            <h3>{t('editPublic.yourGoal')}</h3>
            <span className="step-badge">{t('editPublic.step7')}</span>
          </div>
          <div className="goals-list">
            {[
              { id: 'meet', labelKey: 'meetEntrepreneurs' },
              { id: 'apply', labelKey: 'applyGrants' },
              { id: 'grow', labelKey: 'growBusiness' },
              { id: 'attend', labelKey: 'attendGalas' },
            ].map((goal) => (
              <div
                key={goal.id}
                className={`goal-item ${formData.goal === goal.id ? 'active' : ''}`}
                onClick={() => toggleGoal(goal.id)}
              >
                <div className="icon-box">
                  <FontAwesomeIcon
                    icon={
                      goal.id === 'meet'
                        ? faUsers
                        : goal.id === 'apply'
                          ? faCircleCheck
                          : goal.id === 'grow'
                            ? faCubes
                            : faCalendarDays
                    }
                  />
                </div>
                <span>{t(`editPublic.${goal.labelKey}`)}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="btn-save" onClick={EditProfile}>
          {t('editPublic.saveChanges')}
        </button>
      </div>
    </div>
  );
}
