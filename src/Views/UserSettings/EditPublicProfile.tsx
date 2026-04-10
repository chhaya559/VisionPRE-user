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
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ensureAbsoluteUrl } from '../../Shared/Utils';
import {
  useEditProfileMutation,
  useGetProfileQuery,
  useUploadFileMutation,
} from '../../Services/Api/module/UserApi';
import type { UserProfile } from '../../Shared/Types';
import Skeleton from '../../Shared/Components/Skeleton/Skeleton';

// Normalize stage label → short ID (for data saved before this fix)
const stageNormalizeMap: Record<string, string> = {
  Ideation: 'idea',
  'Startup - First sales': 'startup',
  'Growth Stage': 'growth',
  Established: 'established',
};

// Normalize profileType label → short ID (for data saved before this fix)
const profileTypeNormalizeMap: Record<string, string> = {
  Startup: 'startup',
  'Innovation / Technology': 'innovation',
  'Woman entrepreneur': 'woman',
  'Young entrepreneur': 'young',
  'Growth-stage': 'growth',
  'Social impact': 'impact',
  'Diverse background': 'diverse',
};

// Normalize goal label → short ID
const goalNormalizeMap: Record<string, string> = {
  'Meet other entrepreneurs': 'meet',
  'Apply for grants': 'apply',
  'Grow my business': 'grow',
  'Attend galas': 'attend',
};

export default function EditPublicProfile() {
  const navigate = useNavigate();
  const { data: apiResponse, isLoading } = useGetProfileQuery(undefined);
  const [editProfile] = useEditProfileMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
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
      const p = apiResponse.data as UserProfile;

      const industryValue = Array.isArray(p.industry)
        ? p.industry
        : p.industry
        ? [p.industry]
        : [];

      // Normalize stage: map label → ID if needed
      const rawStage = p.stage || '';
      const stage = stageNormalizeMap[rawStage] || rawStage;

      // Normalize profileType: map label → ID if needed
      const rawProfileType = p.profileType || [];
      const profileType = rawProfileType.map(
        (v) => profileTypeNormalizeMap[v] || v
      );

      // Normalize goal: map label → ID if needed
      const rawGoal = p.goal || '';
      const goal = goalNormalizeMap[rawGoal] || rawGoal;

      setFormData({
        firstName: p.firstName || '',
        lastName: p.lastName || '',
        phoneNumber: p.phoneNumber || '',
        companyName: p.companyName || '',
        industry: industryValue,
        stage,
        businessDescription: p.businessDescription || '',
        profileType,
        goal,
        avatarUrl: p.avatarUrl || '',
      });
    }
  }, [apiResponse]);
  if (isLoading) {
    return (
      <div className="edit-profile-container loading-state">
        <header className="edit-profile-header">
          <div className="back-btn">
            <Skeleton variant="rect" width={80} height={24} />
          </div>
          <div className="header-spacer" />
          <div className="avatar-edit">
            <Skeleton variant="circle" width={100} height={100} />
          </div>
          <div className="avatar-actions">
            <Skeleton variant="text" width={100} />
          </div>
        </header>

        <div className="edit-profile-form">
          <div className="section">
            <Skeleton variant="text" width={150} height={24} />
            <div className="form-grid">
              <div className="form-group">
                <Skeleton variant="text" width={100} />
                <Skeleton variant="rect" height={45} />
              </div>
              <div className="form-group">
                <Skeleton variant="text" width={100} />
                <Skeleton variant="rect" height={45} />
              </div>
            </div>
          </div>
          <div className="section">
            <Skeleton variant="text" width={150} height={24} />
            <div className="form-grid">
              <Skeleton variant="rect" height={45} />
              <Skeleton variant="rect" height={100} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = formData.firstName || t('editPublic.user');
  const initialLetter = displayName.charAt(0).toUpperCase();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resp = await uploadFile({ file }).unwrap();

      // Support various response formats:
      // 1. { data: { url: "..." } }
      // 2. { url: "..." }
      // 3. { data: "..." } (string URL)
      // 4. "..." (direct string URL)
      const rawUrl =
        resp?.data?.url ||
        resp?.url ||
        (typeof resp?.data === 'string' ? resp.data : null) ||
        (typeof resp === 'string' ? resp : null);

      const imageUrl = ensureAbsoluteUrl(rawUrl);

      if (imageUrl) {
        setFormData((prev) => ({ ...prev, avatarUrl: imageUrl }));

        // Auto-save the profile with the new avatar URL
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
          avatarUrl: imageUrl,
        };

        await editProfile(payload).unwrap();
        toast.success(
          t('editPublic.uploadSuccess') || 'Avatar updated and saved!'
        );
      } else {
        // eslint-disable-next-line no-console
        console.error('No URL found in upload response', resp);
        toast.error(
          t('editPublic.uploadFailed') ||
            'Upload completed, but no image URL was returned.'
        );
      }
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      const apiErr = error as { data?: { message?: string }; message?: string };
      const errorMsg =
        apiErr?.data?.message ||
        apiErr?.message ||
        t('editPublic.uploadFailed') ||
        'Failed to upload image.';
      toast.error(errorMsg);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: '' }));
  };

  async function handleSaveProfile() {
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
        avatarUrl: formData.avatarUrl, // Send actual value to support removal ("") or persistence
      };

      const response = await editProfile(payload).unwrap();

      // On successful unwrap, we show success regardless of explicit 'success' field
      toast.success(
        response.message ||
          t('editPublic.updateSuccess') ||
          'Profile updated successfully!',
        { position: 'top-right' }
      );
      navigate(-1);
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error('Error editing public profile', err);
      const apiErr = err as { data?: { message?: string } };
      toast.error(
        apiErr?.data?.message ||
          t('editPublic.updateFailed') ||
          'Update failed',
        {
          position: 'top-right',
        }
      );
    }
  }

  return (
    <div className="edit-profile-container">
      <header className="edit-profile-header">
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faChevronLeft} />
          {t('editPublic.back')}
        </button>
        <div className="header-spacer" />
        <div className="avatar-edit">
          <label htmlFor="avatar-upload" style={{ cursor: 'pointer' }}>
            <div className="avatar-circle">
              {formData.avatarUrl ? (
                <img
                  src={ensureAbsoluteUrl(formData.avatarUrl) || ''}
                  alt="Avatar"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                initialLetter
              )}
            </div>
            <div className="camera-icon">
              <FontAwesomeIcon icon={faCamera} />
            </div>
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
        <div className="avatar-actions">
          <label htmlFor="avatar-upload" className="change-photo">
            {isUploading
              ? t('editPublic.uploading') || 'Uploading...'
              : t('editPublic.changePhoto')}
          </label>
          {formData.avatarUrl && (
            <span className="remove-photo" onClick={handleRemovePhoto}>
              {t('editPublic.removePhoto') || 'Remove Photo'}
            </span>
          )}
        </div>
      </header>

      <div className="edit-profile-form">
        {/* Personal Information */}
        <div className="section">
          <div className="section-header">
            <h3>{t('editPublic.personalInfo')}</h3>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <div className="name-inputs-row">
                <div className="name-input-group">
                  <label>{t('editPublic.firstName')}</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder={t('editPublic.firstName')}
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="name-input-group">
                  <label>{t('editPublic.lastName')}</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder={t('editPublic.lastName')}
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>{t('editPublic.phone')}</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
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
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <div className="label-row">
                <label>{t('editPublic.industry')}</label>
                <span className="step-label">{t('editPublic.step3')}</span>
              </div>
              <select
                name="industry"
                value={formData.industry[0] || 'Technology'}
                onChange={handleInputChange}
              >
                <option value="Technology">
                  {t('editBusiness.technology')}
                </option>
                <option value="Healthcare">
                  {t('editBusiness.healthcare')}
                </option>
                <option value="E-commerce">
                  {t('editBusiness.ecommerce')}
                </option>
                <option value="Finance">{t('editBusiness.finance')}</option>
              </select>
            </div>
            <div className="form-group">
              <div className="label-row">
                <label>{t('editPublic.businessStage')}</label>
                <span className="step-label">{t('editPublic.step4')}</span>
              </div>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleInputChange}
              >
                <option value="idea">{t('editPublic.ideation')}</option>
                <option value="startup">{t('editPublic.startup')}</option>
                <option value="growth">{t('editPublic.growth')}</option>
                <option value="established">
                  {t('editPublic.established')}
                </option>
              </select>
            </div>
            <div className="form-group">
              <div className="label-row">
                <label>{t('editPublic.businessDescription')}</label>
                <span className="step-label">{t('editPublic.step5')}</span>
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
            <h3>{t('editPublic.entrepreneurProfile')}</h3>
            <span className="step-badge">{t('editPublic.step6')}</span>
          </div>
          <p className="section-hint">{t('editPublic.selectAll')}</p>
          <div className="tags-grid">
            {[
              { id: 'startup', key: 'startupTag' },
              { id: 'innovation', key: 'innovation' },
              { id: 'woman', key: 'woman' },
              { id: 'young', key: 'young' },
              { id: 'growth', key: 'growthStage' },
              { id: 'impact', key: 'socialImpact' },
              { id: 'diverse', key: 'diverse' },
            ].map((tag) => (
              <span
                key={tag.id}
                className={`tag ${
                  formData.profileType.includes(tag.id) ? 'active' : ''
                }`}
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
                className={`goal-item ${
                  formData.goal === goal.id ? 'active' : ''
                }`}
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

        <button type="button" className="btn-save" onClick={handleSaveProfile}>
          {t('editPublic.saveChanges')}
        </button>
      </div>
    </div>
  );
}
