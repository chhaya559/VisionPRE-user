import { useNavigate } from "react-router-dom";
import "./IntroSteps.scss";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";

export default function AlmostReady() {
  const navigate = useNavigate();
  const { t } = useTranslation("profile")

  return (
    <div className="intro-step">
      <div className="rocket-icon-wrapper">
        <FontAwesomeIcon icon={faRocket} className="rocket-icon-fa" />
      </div>

      <h1>{t('almost_ready')}</h1>
      <p className="subtitle">
        {t('almost_ready_str')}   </p>

      <div className="stats-grid">
        <div className="stat-card large">
          <h2>{t('grant_price')}</h2>
          <p>{t('grant_price2')}</p>
        </div>

        <div className="stat-card large">
          <h2>{t('grants_str')}</h2>
          <p>{t('grants_str2')}</p>
        </div>
      </div>

      <button className="btn-continue" onClick={() => navigate("/setup/name")}>
        {t('continue')}
      </button>
    </div>
  );
}
