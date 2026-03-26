import "../CreateAccount/styles.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import PasswordField from "../../Components/Atom/PasswordField";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";


export default function LoginPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();


    const {
        register,
        handleSubmit,
    } = useForm();

    const onSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <div className="login-card__logo">
                    {/* <div className="logo-bubble"> */}
                    <img src="../../assets/logoGreen.png" alt="logo" />
                    {/* </div> */}
                </div>

                <div className="login-card__heading">
                    <h1>{t('welcome_string')}</h1>
                    <p>{t('login_str')}</p>
                </div>

                {/* Form */}
                <div className="login-card__form">
                    <div className="form-group">
                        <label htmlFor="email">{t('email')}</label>
                        <div className="input-wrap">
                            <input
                                id="email"
                                type="email"
                                placeholder="your.email@example.com"
                                {...register("email")}
                            />
                        </div>
                    </div>
                    <PasswordField
                        id="password"
                        label={t('password')}
                        name="password"
                        register={register}
                    />

                    <button className="forgot-link" type="button" onClick={() => navigate("/forgot-password")}>
                        {t('forgot_pass')}
                    </button>

                    {/* Sign In CTA */}
                    <button className="btn-signin" type="button" onClick={handleSubmit(onSubmit)}>
                        {t('sign_in')}
                    </button>

                    <div className="or-divider">
                        <span>{t('social_option')}</span>
                    </div>

                    <div className="social-btns">
                        <button className="btn-social" type="button">
                            <img src="../../assets/icons/google.png" alt="google-icon" className="google-icon" />
                            {t('google')}
                        </button>
                        <button className="btn-social btn-social--apple" type="button">
                            <FontAwesomeIcon icon={faApple} className="apple-icon" />
                            {t('apple')}
                        </button>
                    </div>

                </div>

                {/* Footer */}
                <div className="login-footer">
                    {t('dont_account')}{" "}
                    <button type="button" onClick={() => navigate("/create-account")}>{t('sign_up')}</button>
                </div>

            </div>
        </div>
    );
}