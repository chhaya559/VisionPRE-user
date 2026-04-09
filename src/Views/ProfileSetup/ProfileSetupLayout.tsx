import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './ProfileSetupLayout.scss';
import { useTranslation } from 'react-i18next';

const PROGRESS_STEPS = [
  '/setup/name',
  '/setup/company',
  '/setup/industry',
  '/setup/stage',
  '/setup/profile',
  '/setup/describe',
  '/setup/goal',
  '/setup/phone',
  '/setup/ready',
];

export interface SetupFormData {
  firstName: string;
  lastName: string;
  companyName: string;
  industry: string[];
  stage: string | null;
  profileType: string[];
  businessDescription: string;
  goal: string;
  phone: string;
}

export interface SetupContextProps {
  currentStepIndex: number;
  totalSteps: number;
  formData: SetupFormData;
  updateForm: (updates: Partial<SetupFormData>) => void;
}

export default function ProfileSetupLayout() {
  const { t } = useTranslation('profile');
  const location = useLocation();

  const [formData, setFormData] = useState<SetupFormData>({
    firstName: '',
    lastName: '',
    companyName: '',
    industry: [],
    stage: null,
    profileType: [],
    businessDescription: '',
    goal: '',
    phone: '',
  });

  const updateForm = (updates: Partial<SetupFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const isIntroScreen = location.pathname.includes('/welcome');
  const isReadyScreen = location.pathname.includes('/ready');

  // Calculate Progress
  const currentStepIndex = PROGRESS_STEPS.indexOf(location.pathname);
  const totalStepsDisplay = PROGRESS_STEPS.length - 1; // 8 total interactive steps
  let displayStepIndex = currentStepIndex;
  if (isReadyScreen) {
    displayStepIndex = totalStepsDisplay - 1; // Show Step 8 of 8
  }

  const progressPercent =
    currentStepIndex >= 0
      ? ((displayStepIndex + 1) / totalStepsDisplay) * 100
      : 0;

  return (
    <div className="profile-setup-layout">
      <div className="profile-setup-container">
        {/* Only show top header/progress if not on intro or ready screens */}
        {!isIntroScreen && !isReadyScreen && (
          <header className="profile-setup-header">
            <div className="step-count">
              {displayStepIndex >= 0
                ? `${t('step')} ${displayStepIndex + 1} ${t(
                    'of'
                  )} ${totalStepsDisplay}`
                : ''}
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="progress-percentage">
              {displayStepIndex >= 0 ? `${Math.round(progressPercent)}%` : ''}
            </div>
          </header>
        )}

        <div className="profile-setup-content">
          <Outlet
            context={
              {
                currentStepIndex,
                totalSteps: totalStepsDisplay,
                formData,
                updateForm,
              } satisfies SetupContextProps
            }
          />
        </div>
      </div>
    </div>
  );
}
