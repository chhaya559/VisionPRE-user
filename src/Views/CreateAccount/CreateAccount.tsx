import { useState } from "react";
import "./styles.scss";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import PasswordField from "../../Shared/Components/PasswordField";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../Shared/Components/Modal";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "../../validations/userSchema";
import { ROUTES_CONFIG } from "../../Shared/Constants";
import { useRegisterMutation } from "../../Services/Api/module/AuthApi";
import { useDispatch } from "react-redux";
import { setAuthData } from "../../Store/Common";

export default function CreateAccount() {
    const navigate = useNavigate();
    const [agreed, setAgreed] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [showPolicy, setShowPolicy] = useState(false);
    const { t } = useTranslation();
    const [registerApi, { isLoading }] = useRegisterMutation();

    function handleBack() {
        navigate(-1);
    }

    const { register, handleSubmit, formState: { errors, isValid } } =
        useForm({
            resolver: yupResolver(userSchema),
            mode: "onTouched"
        })

    const dispatch = useDispatch();

    const onSubmit = async (data: any) => {
        if (!agreed) return alert("Please agree to terms");

        const payload = {
            userName: data.userName,
            email: data.email,
            password: data.password,
        };
        console.log(payload)
        try {
            const response = await registerApi(
                payload
            ).unwrap();

            console.log(response);
            if (response.success) {
                dispatch(setAuthData({
                    email: response.data.email,
                    userName: response.data.userName,
                    isProfileCompleted: response.data.isProfileCompleted,
                }));
                navigate(ROUTES_CONFIG.EMAILVERIFICATION.path)
            }
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
                        <h1>Terms & Conditions</h1>
                        <h2>1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using Vision PME, you accept and agree to be bound by the terms and provisions of this agreement.
                        </p>
                        <h2>2. Use License</h2>
                        <p>
                            Permission is granted to temporarily access the materials on Vision PME for personal, non-commercial use only.
                        </p>
                        <h2>3. User Account</h2>
                        <p>
                            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                        </p>
                        <h2>4. Privacy Policy</h2>
                        <p>
                            Your use of Vision PME is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the site.
                        </p>
                        <h2>5. Grant Applications</h2>
                        <p>
                            All grant applications are subject to review and approval. Vision PME reserves the right to accept or reject any application at its sole discretion.
                        </p>
                    </Modal>

                    <Modal
                        isOpen={showPolicy}
                        title="Privacy Policy"
                        onClose={() => setShowPolicy(false)}
                    >
                        <h1>Privacy Policy</h1>
                        <h2>Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us, including your name, email address, company information, and other details you submit through our application.
                        </p>
                        <h2>How We Use Your Information</h2>
                        <p>
                            We use the information we collect to provide, maintain, and improve our services, process grant applications, and send you updates about events and opportunities.
                        </p>
                        <h2>Information Sharing</h2>
                        <p>
                            We do not share your personal information with third parties except as described in this policy or with your consent.
                        </p>
                        <h2>Data Security</h2>
                        <p>
                            We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing.
                        </p>
                        <h2>Your Rights</h2>
                        <p>
                            You have the right to access, update, or delete your personal information at any time through your account settings.
                        </p>
                    </Modal>

                    {/* Create Account CTA */}
                    <button
                        className="btn-create"
                        type="button"
                        disabled={!isValid || !agreed}
                        onClick={handleSubmit(onSubmit)}
                    >
                        {isLoading ? t('creating_acc') : t('create_acc')}
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
                    <button type="button" onClick={() => navigate(ROUTES_CONFIG.LOGIN.path)}>
                        {t('sign_in')}
                    </button>
                </div>

            </div>
        </div>
    );
}