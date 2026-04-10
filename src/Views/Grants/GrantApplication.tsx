import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import {
  useGetGalaByIdQuery,
  useApplyGrantMutation,
} from '../../Services/Api/module/GalaApi';
import { useUploadFileMutation } from '../../Services/Api/module/UserApi';
import { ensureAbsoluteUrl } from '../../Shared/Utils';
import { useWalletContext } from '../../Context/WalletContext';
import './GrantApplication.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faCalendar,
  faInfoCircle,
  faPaperPlane,
  faCheckCircle,
  faCloudUploadAlt,
  faSpinner,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

import Skeleton from '../../Shared/Components/Skeleton/Skeleton';

interface FileUploaderProps {
  label: string;
  onUploadSuccess: (url: string) => void;
  required?: boolean;
  t: any;
}

function FileUploader({
  label,
  onUploadSuccess,
  required,
  t,
}: FileUploaderProps) {
  const [uploadFile, { isLoading }] = useUploadFileMutation();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setError(null);
      const file = acceptedFiles[0];
      setFileName(file.name);

      try {
        const result = await uploadFile({ file, type: 'Document' }).unwrap();
        const url = (result as any)?.data || result;
        setFileUrl(url);
        onUploadSuccess(url);
      } catch (err) {
        console.error('Upload failed:', err);
        setError(t('grants.application.uploadFailed'));
      }
    },
    [uploadFile, onUploadSuccess]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileUrl(null);
    setFileName(null);
    onUploadSuccess('');
  };

  return (
    <div className="form-group">
      <label>
        {label} {required && '*'}
      </label>
      <div
        {...getRootProps()}
        className={`dropzone-container ${isDragActive ? 'active' : ''} ${
          fileUrl ? 'has-file' : ''
        }`}
      >
        <input {...getInputProps()} />

        {isLoading ? (
          <div className="uploader-status">
            <FontAwesomeIcon icon={faSpinner} spin />
            <span>{t('grants.application.uploading')}</span>
          </div>
        ) : fileUrl ? (
          <div className="uploader-status success">
            <div className="file-info">
              <FontAwesomeIcon icon={faCheckCircle} />
              <span className="file-name text-truncate">{fileName}</span>
            </div>
            <button type="button" className="clear-btn" onClick={clearFile}>
              <FontAwesomeIcon icon={faTimesCircle} />
            </button>
          </div>
        ) : (
          <div className="uploader-status empty">
            <FontAwesomeIcon icon={faCloudUploadAlt} />
            <p>
              {isDragActive
                ? 'Drop here'
                : 'Drop your file here or click to upload'}
            </p>
          </div>
        )}
      </div>
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}

export default function GrantApplication() {
  const { id, grantId } = useParams<{ id: string; grantId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('private');
  const { data: apiResponse, isLoading: isFetching } = useGetGalaByIdQuery(
    id || ''
  );
  const [applyGrant, { isLoading: isSubmitting }] = useApplyGrantMutation();
  const { account } = useWalletContext();

  const now = new Date();
  const [selectedDay, setSelectedDay] = useState(now.getDate());
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [isSuccess, setIsSuccess] = useState(false);

  const [businessPlanUrl, setBusinessPlanUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  if (isFetching) {
    return (
      <div className="grant-app-container loading-state">
        <header className="grant-app-header">
          <div className="header-shell">
            <Skeleton variant="text" width={80} height={20} />
            <Skeleton variant="text" width={200} height={32} />
            <Skeleton variant="text" width={300} height={20} />
          </div>
        </header>

        <div className="grant-summary-box">
          <Skeleton variant="text" width={250} height={28} />
          <Skeleton variant="text" width={180} height={20} />
          <Skeleton variant="text" width="100%" height={60} />
        </div>

        <div className="grant-form">
          {[1, 2, 3].map((i) => (
            <div key={i} className="form-group">
              <Skeleton variant="text" width={120} />
              <Skeleton variant="rect" height={45} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const galaData = (apiResponse as any)?.data || apiResponse || {};
  const rawGrants = galaData?.grants || galaData?.Grants;
  const grants = Array.isArray(rawGrants) ? rawGrants : [];
  const grant = grants.find((g: any) => (g.id || g.Id) === grantId);

  if (!galaData || !grant) {
    return (
      <div className="grant-app-container grant-app-state error">
        <h2 className="grant-app-error-title">
          {t('grants.application.notFound')}
        </h2>
        <button
          type="button"
          className="btn-continue grant-app-back-btn"
          onClick={() => navigate(-1)}
        >
          {t('grants.application.goBack')}
        </button>
      </div>
    );
  }

  const gTitle = grant.title || grant.Title;
  const gAmount = grant.prizeAmount ?? grant.amount ?? grant.Amount ?? 0;

  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  const timeSlots = [
    '9:00 AM',
    '10:30 AM',
    '12:00 PM',
    '2:00 PM',
    '4:00 PM',
    '8:00 PM',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const payload = {
      grantId,
      companyName: formData.get('companyName'),
      industry: formData.get('industry'),
      motivationStatement: formData.get('motivationStatement'),
      businessPlanDocumentUrl: ensureAbsoluteUrl(businessPlanUrl),
      videoUrl: videoUrl ? ensureAbsoluteUrl(videoUrl) : null,
      interviewDate: `${now.getFullYear()}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${selectedDay
        .toString()
        .padStart(2, '0')}T00:00:00.000Z`,
      interviewStartTime: selectedTime,
      isDraft: false,
      confirmInformation: formData.get('confirmInformation') === 'on',
      agreeToTerms: formData.get('agreeToTerms') === 'on',
      walletAddress: account || '',
      transactionHash: galaData.blockchainTransactionHash || '',
    };

    try {
      // Direct Backend Synchronization (Skipping Blockchain as per user request)
      await applyGrant(payload).unwrap();
      setIsSuccess(true);
      setTimeout(() => navigate('/dashboard/grants'), 2000);
    } catch (err) {
      console.error('Failed to apply:', err);
      const errorMessage =
        (err as any)?.data?.message ||
        (err as any)?.message ||
        'Failed to apply for the grant. Please try again.';
      toast.error(errorMessage);
    }
  };

  if (isSuccess) {
    return (
      <div className="grant-app-container grant-app-state success">
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="grant-app-success-icon"
        />
        <h2>{t('grants.application.submitted')}</h2>
        <p className="grant-app-success-copy">
          {t('grants.application.redirecting')}
        </p>
      </div>
    );
  }

  return (
    <div className="grant-app-container">
      <header className="grant-app-header">
        <div className="header-shell">
          <div className="back-link" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faChevronLeft} />
            {t('grants.application.back')}
          </div>
          <h1>{t('grants.application.title')}</h1>
          <p>{t('grants.application.description')}</p>
        </div>
      </header>

      <div className="grant-summary-box">
        <h2>{gTitle}</h2>
        <span className="prize-info">
          ${gAmount.toLocaleString()} {t('grants.application.prize')} • 5{' '}
          {t('grants.application.winners')}
        </span>
      </div>

      <form className="grant-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t('grants.application.companyName')}</label>
          <input
            name="companyName"
            type="text"
            placeholder={t('grants.application.companyNamePlaceholder')}
            required
          />
        </div>

        <div className="form-group">
          <label>{t('grants.application.industry')}</label>
          <select name="industry" defaultValue="" required>
            <option value="" disabled>
              {t('grants.application.selectIndustry')}
            </option>
            <option value="Technology">
              {t('grants.application.technology')}
            </option>
            <option value="Healthcare">
              {t('grants.application.healthcare')}
            </option>
            <option value="E-commerce">
              {t('grants.application.ecommerce')}
            </option>
            <option value="Other">{t('grants.application.other')}</option>
          </select>
        </div>

        <div className="form-group">
          <label>{t('grants.application.motivation')}</label>
          <span className="motivation-hint">
            {t('grants.application.motivationPlaceholder')}
          </span>
          <textarea
            name="motivationStatement"
            placeholder={t('grants.application.motivationExample')}
            required
          />
        </div>

        <FileUploader
          label={t('grants.application.businessPlan')}
          onUploadSuccess={setBusinessPlanUrl}
          t={t}
        />

        <FileUploader
          label={t('grants.application.videoUrl')}
          onUploadSuccess={setVideoUrl}
          t={t}
        />

        <div className="scheduler-section">
          <div className="scheduler-header">
            <div className="icon-bg">
              <FontAwesomeIcon icon={faCalendar} />
            </div>
            <div className="header-text">
              <h3>{t('grants.application.scheduleInterview')}</h3>
              <p>{t('grants.application.scheduleDescription')}</p>
            </div>
          </div>

          <div className="calendar-mock">
            <div className="cal-header">
              <FontAwesomeIcon icon={faChevronLeft} />
              {now.toLocaleString('default', { month: 'long' })}{' '}
              {now.getFullYear()}
              <FontAwesomeIcon icon={faChevronLeft} className="cal-next-icon" />
            </div>
            <div className="cal-grid">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d) => (
                <span key={d} className="day-name">
                  {d}
                </span>
              ))}
              <span className="day empty" />
              <span className="day empty" />
              <span className="day empty" />
              <span className="day empty" />
              <span className="day empty" />
              {days.map((d) => (
                <span
                  key={d}
                  className={`day ${selectedDay === d ? 'selected' : ''}`}
                  onClick={() => setSelectedDay(d)}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          <p className="time-slots-label">
            {t('grants.application.chooseTime')}
          </p>
          <div className="time-slots">
            {timeSlots.map((slot) => (
              <div
                key={slot}
                className={`time-slot ${selectedTime === slot ? 'active' : ''}`}
                onClick={() => setSelectedTime(slot)}
              >
                {slot === '9:00 AM'
                  ? t('grants.application.time9')
                  : slot === '10:30 AM'
                  ? t('grants.application.time1030')
                  : slot === '12:00 PM'
                  ? t('grants.application.time12')
                  : slot === '2:00 PM'
                  ? t('grants.application.time2')
                  : slot === '4:00 PM'
                  ? t('grants.application.time4')
                  : slot === '8:00 PM'
                  ? t('grants.application.time8')
                  : slot}
              </div>
            ))}
          </div>
        </div>

        <div className="checkbox-group">
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="confirm"
              name="confirmInformation"
              required
            />
            <label htmlFor="confirm">
              {t('grants.application.confirmInfo')}
            </label>
          </div>
          <div className="checkbox-item">
            <input type="checkbox" id="terms" name="agreeToTerms" required />
            <label htmlFor="terms">
              {t('grants.application.agreeTo')}
              <a href="#">{t('grants.application.terms')}</a>
              {t('grants.application.and')}{' '}
              <a href="#">{t('grants.application.privacy')}</a>
            </label>
          </div>
        </div>

        <div className="actions">
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span>{t('grants.application.submitting')}</span>
            ) : (
              <>
                <FontAwesomeIcon icon={faPaperPlane} className="submit-icon" />
                {t('grants.application.submit')}
              </>
            )}
          </button>
        </div>

        <div className="notice-box">
          <div className="notice-icon">
            <FontAwesomeIcon icon={faInfoCircle} />
          </div>
          <div className="notice-content">
            <h4>{t('grants.application.reviewTime')}</h4>
            <p>{t('grants.application.reviewDescription')}</p>
          </div>
        </div>
      </form>
    </div>
  );
}
