import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import './ProfileEdits.scss';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  useEditProfileMutation,
  useGetProfileQuery,
} from '../../Services/Api/module/UserApi';
import type { UserProfile } from '../../Shared/Types';
import Skeleton from '../../Shared/Components/Skeleton/Skeleton';

export default function EditBusinessProfile() {
  const navigate = useNavigate();
  const { data: apiResponse, isLoading } = useGetProfileQuery(undefined);
  const [editProfileMutation] = useEditProfileMutation();
  const { t } = useTranslation('settings');
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (apiResponse?.data) {
      const p = apiResponse.data as UserProfile;
      setFormData({
        ...p,
        industry: Array.isArray(p.industry) ? p.industry[0] : p.industry || '',
        foundedYear: p.foundedYear?.toString() || '',
      });
    }
  }, [apiResponse]);

  if (isLoading) {
    return (
      <div className="edit-profile-container loading-state">
        <header className="edit-profile-header secondary">
          <div className="back-btn">
            <Skeleton variant="rect" width={80} height={24} />
          </div>
          <div className="header-info">
            <Skeleton variant="text" width={200} height={32} />
            <Skeleton variant="text" width={300} height={20} />
          </div>
        </header>

        <div className="edit-profile-form">
          <div className="section">
            <div className="form-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="form-group">
                  <Skeleton variant="text" width={100} />
                  <Skeleton variant="rect" height={45} />
                </div>
              ))}
              <div className="form-group">
                <Skeleton variant="text" width={100} />
                <Skeleton variant="rect" height={100} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  async function handleSaveProfile() {
    console.log('handleSaveProfile (Business) triggered');
    try {
      const payload = {
        companyName: formData.companyName || undefined,
        industry: Array.isArray(formData.industry)
          ? formData.industry
          : [formData.industry || 'Technology'],
        companySize: formData.companySize || undefined,
        foundedYear: formData.foundedYear
          ? parseInt(formData.foundedYear, 10)
          : 0,
        annualRevenue: formData.annualRevenue || undefined,
        website: formData.website || undefined,
        businessDescription:
          formData.businessDescription ||
          formData.companyDescription ||
          undefined,
        stage: formData.stage || undefined,
        profileType: Array.isArray(formData.profileType)
          ? formData.profileType
          : [],
        goal: formData.goal || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        avatarUrl: formData.avatarUrl || undefined,
      };

      console.log('Update Business Profile Request:', payload);
      const response = await editProfileMutation(payload).unwrap();
      console.log('Update Business Profile Response:', response);

      if (response.success) {
        toast.success(
          response.message || 'Business profile updated successfully!',
          { position: 'top-right' }
        );
        navigate(-1);
      }
    } catch (err: any) {
      console.error('Error editing business profile', err);
      toast.error(err?.data?.message || 'Update failed', {
        position: 'top-right',
      });
    }
  }

  return (
    <div className="edit-profile-container">
      <header className="edit-profile-header secondary">
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faChevronLeft} />
          {t('editBusiness.back')}
        </button>
        <div className="header-info">
          <h1>{t('editBusiness.title')}</h1>
          <p>{t('editBusiness.description')}</p>
        </div>
      </header>

      <div className="edit-profile-form">
        <div className="section">
          <div className="form-grid">
            <div className="form-group">
              <label>{t('editBusiness.companyName')}</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>{t('editBusiness.industry')}</label>
              <select
                name="industry"
                value={formData.industry || ''}
                onChange={handleInputChange}
              >
                <option value="">
                  {t('editBusiness.selectIndustry') || 'Select industry'}
                </option>
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
              <label>{t('editBusiness.companySize')}</label>
              <select
                name="companySize"
                value={formData.companySize || ''}
                onChange={handleInputChange}
              >
                <option value="">
                  {t('editBusiness.selectSize') || 'Select size'}
                </option>
                <option value="1-10 employees">
                  {t('editBusiness.size1')}
                </option>
                <option value="11-50 employees">
                  {t('editBusiness.size2')}
                </option>
                <option value="51-200 employees">
                  {t('editBusiness.size3')}
                </option>
                <option value="200+ employees">
                  {t('editBusiness.size4')}
                </option>
              </select>
            </div>
            <div className="form-group">
              <label>{t('editBusiness.foundedYear')}</label>
              <input
                type="text"
                name="foundedYear"
                value={formData.foundedYear || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>{t('editBusiness.annualRevenue')}</label>
              <select
                name="annualRevenue"
                value={formData.annualRevenue || ''}
                onChange={handleInputChange}
              >
                <option value="">
                  {t('editBusiness.selectRevenue') || 'Select revenue'}
                </option>
                <option value="Under $100K">
                  {t('editBusiness.revenue1')}
                </option>
                <option value="$100K - $500K">
                  {t('editBusiness.revenue2')}
                </option>
                <option value="$500K - $1M">
                  {t('editBusiness.revenue3')}
                </option>
                <option value="$1M+">{t('editBusiness.revenue4')}</option>
              </select>
            </div>
            <div className="form-group">
              <label>{t('editBusiness.website')}</label>
              <input
                type="text"
                name="website"
                value={formData.website || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>{t('editBusiness.companyDescription')}</label>
              <textarea
                name="businessDescription"
                value={formData.businessDescription || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <button type="button" className="btn-save" onClick={handleSaveProfile}>
          {t('editBusiness.saveChanges')}
        </button>
      </div>
    </div>
  );
}
