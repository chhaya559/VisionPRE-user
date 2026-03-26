import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

type PasswordProps = {
    id: string;
    label: string;
    name: string;
    register?: any;
    error?: string;
    placeholder?: string;

};

export default function PasswordField({
    id,
    label,
    name,
    register,
    error,
    placeholder = "••••••••••",
}: Readonly<PasswordProps>) {
    const [show, setShow] = useState(false);

    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>

            <div className="input-wrap">
                <input
                    id={id}
                    type={show ? "text" : "password"}
                    placeholder={placeholder}
                    className="with-toggle"
                    {...register(name)}
                />

                <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShow((s) => !s)}
                    tabIndex={-1}
                >
                    <FontAwesomeIcon icon={show ? faEye : faEyeSlash} />
                </button>
            </div>

            {error && <span className="error">{error}</span>}
        </div>
    );
}