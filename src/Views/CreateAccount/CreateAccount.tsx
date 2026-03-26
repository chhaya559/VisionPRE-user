import { useState } from "react";
import "./styles.scss";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import PasswordField from "../../Components/Atom/PasswordField";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../Shared/Modal";
import { useTranslation } from "react-i18next";
import { useRegisterMutation } from "../../Services/Api/api";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "../../validations/userSchema";

export default function CreateAccount() {
    const navigate = useNavigate();
    const [agreed, setAgreed] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [showPolicy, setShowPolicy] = useState(false);
    const { t } = useTranslation();
    const [registerApi] = useRegisterMutation();

    function handleBack() {
        navigate(-1);
    }

    const { register, handleSubmit, formState: { errors, isValid } } =
        useForm({
            resolver: yupResolver(userSchema),
            mode: "onChange"
        })

    const onSubmit = async (data: any) => {
        if (!agreed) return alert("Please agree to terms");

        try {
            const response = await registerApi({
                userName: data.userName,
                email: data.email,
                password: data.password,
            }).unwrap();

            console.log(response);
        } catch (err) {
            console.log("error-", err);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <button className="login-card__back" type="button" onClick={handleBack}>
                    <FontAwesomeIcon icon={faArrowLeft} />{t('back')}
                </button>

                <div className="login-card__heading">
                    <h1>{t("create_acc")}</h1>
                    <p>{t('signup_str')}</p>
                </div>

                {/* Form */}
                <div className="login-card__form">
                    <div className="form-group">
                        <label htmlFor="fullName">{t('Username')}</label>
                        <div className="input-wrap">
                            <input
                                id="fullName"
                                type="text"
                                placeholder="Marc-Antoine Blais"
                                {...register("userName")}
                            />
                            {errors.userName && (
                                <span className="error">{errors.userName.message}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="signup-email">{t('email')}</label>
                        <div className="input-wrap">
                            <input
                                id="signup-email"
                                type="email"
                                placeholder="marc@example.com"
                                {...register("email")}
                            />

                            {errors.email && (
                                <span className="error">{errors.email.message}</span>
                            )}
                        </div>
                    </div>

                    <PasswordField
                        id="signup-pass"
                        label={t('password')}
                        register={register}
                        name="password"
                        error={errors.password?.message}
                    />



                    <PasswordField
                        id="signup-confirm"
                        label={t('confirm_pass')}
                        register={register}
                        name="confirmPassword"
                        error={errors.confirmPassword?.message}
                    />


                    {/* Terms */}
                    <div className="terms-row">
                        <input
                            type="checkbox"
                            id="terms"
                            className="terms-checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                        />
                        <label htmlFor="terms">
                            {t('agree')}{" "}
                            <button className="policy-btn"
                                type="button"
                                onClick={(e) => {
                                    setShowTerms(true)
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}>{t('terms_str')}</button> {t('and')}{" "}
                            <button className="policy-btn"
                                type="button"
                                onClick={(e) => {
                                    setShowPolicy(true)
                                    e.stopPropagation();
                                }}>{t('privacy_str')}</button>
                        </label>
                    </div>
                    <Modal
                        isOpen={showTerms}
                        title="Terms & Conditions"
                        onClose={() => setShowTerms(false)}
                    >
                        <h2>1. Acceptance of Terms</h2>
                        <h2>2. Use License</h2>
                        <h2>3. User Account</h2>
                        <h2>4. Privacy Policy</h2>
                        <h2>5. Grant Applications</h2>

                    </Modal>
                    <Modal
                        isOpen={showPolicy}
                        title="Privacy Policy"
                        onClose={() => setShowPolicy(false)}
                    >
                        <h2>Information We Collect</h2>
                        <h2>How We Use Your Information</h2>
                        <h2>Information Sharing</h2>
                        <h2>Data Security</h2>
                        <h2>Your Rights</h2>

                    </Modal>
                    {/* Create Account CTA */}
                    <button
                        className="btn-create"
                        type="button"
                        disabled={!isValid || !agreed}
                        onClick={handleSubmit(onSubmit)}
                    >
                        {t('create_acc')}
                    </button>

                    {/* Divider */}
                    <div className="or-divider">
                        <span>{t('social_option')}</span>
                    </div>

                    {/* Social */}
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
                    {t('already_account')}{" "}
                    <button type="button" onClick={handleBack}>
                        {t('sign_in')}
                    </button>
                </div>

            </div>
        </div>
    );
}