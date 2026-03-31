import { Link } from 'react-router-dom';
import ProgressDots from './ProgressDots';
import './styles.scss';
import { useTranslation } from 'react-i18next';

type OnboardingFlowProps = {
  step: number;
  total: number;
  data: any;
  onNext: () => void;
  onSkip: () => void;
  isLast: boolean;
};

export default function OnboardingLayout({
  step,
  total,
  data,
  onNext,
  onSkip,
  isLast,
}: Readonly<OnboardingFlowProps>) {
  const { t } = useTranslation('common');

  return (
    <div className="onboarding-page">
      <div className="onboarding-sidebar">
        <div className="illustration-wrapper">
          <img src={data.image} alt={data.title} />
        </div>
      </div>

      <div className="onboarding-main">
        <div className="onboarding-card">
          <div className="mobile-illustration">
            <img src={data.image} alt={data.title} />
          </div>

          <h2>{t(data.title)}</h2>
          <p>{t(data.description)}</p>

          <ProgressDots total={total} current={step} />

          <div className="ActionSection">
            <button className="btn-primary" onClick={onNext}>
              {isLast ? t('getStarted_string') : t('continue')}
            </button>

            {isLast ? (
              <p className="signin-text">
                {t('already_account')}
                <Link to="/login" className="link-text">
                  {t('sign_in')}
                </Link>
              </p>
            ) : (
              <button className="btn-skip" onClick={onSkip}>
                {t('skip')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
