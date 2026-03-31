import { useNavigate } from 'react-router-dom';
import './AuthScreens.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faLock,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { emailSchema } from '../../validations/userSchema';
import { useForgotPasswordMutation } from '../../Services/Api/module/AuthApi';
import { ROUTES_CONFIG } from '../../Shared/Constants';
import Modal from '../../Shared/Components/Modal';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [ForgotPasswordApi, { isLoading }] = useForgotPasswordMutation();
  const { t } = useTranslation('common');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(emailSchema),
    mode: 'onTouched',
  });

  const [showModal, setShowModal] = useState(false);

  let buttonText = t('send_reset_link');

  if (isLoading) {
    buttonText = t('sending');
  }

  const onSubmit = async (data: any) => {
    console.log(data);
    try {
      const respone = await ForgotPasswordApi({
        email: data.email,
      }).unwrap();
      console.log(respone);
      if (respone?.success) {
        setShowModal(true);
        reset();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="illustration-circle">
          <FontAwesomeIcon icon={faLock} className="main-icon" />{' '}
        </div>
        <h1>{t('forgot_pass?')}</h1>
        <p className="instruction-text">{t('forgot_pass_str')}</p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="signup-email">{t('email')}</label>
            <div className="input-wrap">
              <input
                id="signup-email"
                type="email"
                placeholder={t('email_Placeholder')}
                {...register('email')}
              />

              {errors.email && (
                <span className="error">{errors.email.message}</span>
              )}
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {buttonText}
          </button>

          <div className="back-btn" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} />
            {t('back_signin')}
          </div>
        </form>

        <Modal
          isOpen={showModal}
          showFooter={false}
          onClose={() => {
            setShowModal(false);
            navigate(ROUTES_CONFIG.LOGIN.path);
          }}
          title={t('reset_link_sent_title')}
        >
          <div className="success-modal">
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faCircleCheck} />
            </div>
            <p>{t('check_inbox_msg')}</p>
            <button
              className="btn-primary"
              onClick={() => {
                setShowModal(false);
                navigate(ROUTES_CONFIG.LOGIN.path);
              }}
            >
              {t('go_to_login')}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
