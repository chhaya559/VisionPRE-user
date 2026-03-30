import "../CreateAccount/styles.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import PasswordField from "../../Shared/Components/PasswordField";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../../Services/Api/module/AuthApi";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../validations/userSchema";
import { Bounce, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../../Store/Common";


export default function LoginPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [loginApi, { isLoading }] = useLoginMutation();

    const {
        register,
        handleSubmit, formState: { errors }
    } = useForm(
        {
            resolver: yupResolver(loginSchema),
            mode: "onTouched"
        });

    const onSubmit = async (data: any) => {
        const payload = {
            email: data.email,
            password: data.password,
        };
        console.log(payload)
        try {
            const response = await loginApi(
                payload
            ).unwrap();

            console.log("Login Response (Full):", response);
            const token = response.data?.accessToken;
            const refreshToken = response.data?.refreshToken;
            const email = response.data?.email;
            const userName = response.data?.username;
            const isProfileCompleted = response.data?.isProfileCompleted;

            console.log("Dispatching Login with:", { token, refreshToken, email, userName, isProfileCompleted });

            dispatch(login({
                token,
                refreshToken,
                email,
                userName,
                isProfileCompleted,
            }));
        } catch (err: any) {
            console.log("error-", err);
            toast(err?.data?.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
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
                            {errors.email && (
                                <span className="error">{errors.email.message}</span>
                            )}
                        </div>
                    </div>
                    <PasswordField
                        id="password"
                        label={t('password')}
                        name="password"
                        register={register}
                        error={errors.password?.message}
                    />

                    <button className="forgot-link" type="button" onClick={() => navigate("/forgot-password")}>
                        {t('forgot_pass')}
                    </button>

                    {/* Sign In CTA */}
                    <button
                        type="button" className="btn-signin"
                        onClick={handleSubmit(onSubmit)}>
                        {isLoading ? t('signing_in') : t('sign_in')}
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
        </div >
    );
}