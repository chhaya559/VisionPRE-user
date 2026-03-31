import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetGalaByIdQuery } from '../../Services/Api/module/GalaApi';
import './GalaGrants.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faDollarSign,
  faTag,
  faCalendar,
  faCheckCircle,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';

export default function GalaGrants() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('private');
  const { data: apiResponse, isLoading, error } = useGetGalaByIdQuery(id || '');

  if (isLoading) {
    return (
      <div
        className="gala-grants-container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <div style={{ color: '#94A3B8' }}>{t('galas.grants.loading')}</div>
      </div>
    );
  }

  if (error || !apiResponse) {
    return (
      <div
        className="gala-grants-container"
        style={{ padding: '2rem', textAlign: 'center' }}
      >
        <h2 style={{ color: '#EF4444' }}>{t('galas.grants.notFound')}</h2>
        <button
          className="btn-continue"
          style={{ marginTop: '1rem', width: 'auto', padding: '10px 20px' }}
          onClick={() => navigate('/dashboard/galas')}
        >
          {t('galas.grants.backToDiscover')}
        </button>
      </div>
    );
  }

  // Map specific fields from the provided API response shape
  const galaData = (apiResponse as any)?.data || apiResponse || {};
  const galaTitle = galaData.name;
  const grants = Array.isArray(galaData.grants) ? galaData.grants : [];

  return (
    <div className="gala-grants-container">
      <div className="gala-grants-top-shell">
        <header className="gala-grants-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faChevronLeft} />
            {t('galas.grants.back')}
          </button>
          <div className="header-copy">
            <span className="header-eyebrow">{t('galas.grants.discoverGrants')}</span>
            <h1>{t('galas.grants.title')}</h1>
            <p>
              {galaTitle
                ? `${t('galas.grants.exploreGrants')} ${galaTitle}.`
                : t('galas.grants.exploreGrantsDescription')}
            </p>
          </div>
        </header>
      </div>

      <div className="grants-list">
        {grants.length === 0 ? (
          <p className="empty-state">{t('galas.grants.noGrants')}</p>
        ) : (
          grants.map((grant: any) => {
            const gId = grant.id;
            const gTitle = grant.name;

            // Basic mapping for status numbers to readable terms if needed
            const statusMap: Record<number, string> = {
              1: 'Upcoming',
              2: 'Published',
              5: 'Active',
            };
            const gStatus =
              typeof grant.status === 'number' && statusMap[grant.status]
                ? statusMap[grant.status]
                : grant.status;

            const gDesc = grant.description;
            const gAmount = grant.prizeAmount;
            const gCategory = grant.category;
            const gDeadline = grant.applicationDeadline
              ? new Date(grant.applicationDeadline).toLocaleDateString()
              : '';

            const requirements = [];
            if (grant.requireBusinessPlanDocument)
              requirements.push(t('galas.grants.businessPlan'));
            if (grant.requireCompanyName) requirements.push(t('galas.grants.companyName'));
            if (grant.requireIndustrySelection)
              requirements.push(t('galas.grants.industrySelection'));
            if (grant.requireInterview) requirements.push(t('galas.grants.interview'));
            if (grant.requireMotivationStatement)
              requirements.push(t('galas.grants.motivationStatement'));
            const gEligibility =
              requirements.length > 0
                ? requirements.join(', ')
                : t('galas.grants.noneSpecified');

            return (
              <div key={gId} className="grant-card">
                <div className="grant-header">
                  <h3>{gTitle}</h3>
                  <span
                    className={`status-badge ${String(gStatus).toLowerCase()}`}
                  >
                    {t(`galas.grants.status${gStatus}`)}
                  </span>
                </div>
                <div className="grant-gala-ref">
                  {t('galas.grants.gala')} <span>{galaTitle}</span>
                </div>

                <p className="grant-desc">{gDesc}</p>

                <div className="grant-pills">
                  <span className="pill">
                    <FontAwesomeIcon
                      icon={faDollarSign}
                      style={{ marginRight: '4px' }}
                    />{' '}
                    {gAmount.toLocaleString()}$
                  </span>
                  <span className="pill">
                    <FontAwesomeIcon
                      icon={faTag}
                      style={{ marginRight: '4px' }}
                    />{' '}
                    {gCategory}
                  </span>
                  <span className="pill">
                    <FontAwesomeIcon
                      icon={faCalendar}
                      style={{ marginRight: '4px' }}
                    />{' '}
                    {gDeadline}
                  </span>
                </div>

                <div className="eligibility-section">
                  <h4>
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green"
                      style={{ marginRight: '8px' }}
                    />
                    {t('galas.grants.eligibilityCriteria')}
                  </h4>
                  <p>{gEligibility}</p>
                </div>

                <button
                  className="btn-apply"
                  onClick={() =>
                    navigate(`/dashboard/galas/${id}/apply/${gId}`)
                  }
                >
                  {t('galas.grants.applyToGrant')}
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    style={{ marginLeft: '8px' }}
                  />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
