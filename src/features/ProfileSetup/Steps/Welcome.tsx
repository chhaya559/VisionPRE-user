import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useVerifyEmailMutation } from "../../../Services/Api/module/AuthApi";
import "./IntroSteps.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { login } from "../../../Store/Common";

export default function Welcome() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const { t } = useTranslation("profile");
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      verifyEmail(token)
        .unwrap()
        .then((response: any) => {
          console.log("Email verified successfully");
          dispatch(login({
            token: response.data.token,
            refreshToken: response.data.refreshToken,
            email: response.data.email,
            userName: response.data.userName,
            isProfileCompleted: response.data.isProfileCompleted,
          }));
        })
        .catch((error: any) => {
          console.error("Email verification failed:", error);
        });
    }
  }, [token, verifyEmail, dispatch]);

  return (
    <div className="intro-step text-center">
      <div className="icon-badge success-badge">
        <FontAwesomeIcon icon={faCheck} />
      </div>

      <h1>{t('welcome')}</h1>
      <p className="subtitle">{t('welcome_str')}</p>

      <div className="info-box">
        <FontAwesomeIcon
          icon={faBriefcase} />
        <p>{t('profile_welcome_string')}</p>
      </div>

      <button
        className="btn-continue"
        onClick={() => navigate("/setup/ready")}
        disabled={isLoading}
      >
        {isLoading ? t('verify') : t('continue')}
      </button>
    </div>
  );
}
