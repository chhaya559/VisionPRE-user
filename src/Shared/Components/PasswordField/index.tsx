import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { FieldValues, UseFormRegister, Path } from 'react-hook-form';
import './style.scss';

type PasswordProps<T extends FieldValues> = {
  id: string;
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
  placeholder?: string;
};

export default function PasswordField<T extends FieldValues>({
  id,
  label,
  name,
  register,
  error,
}: Readonly<PasswordProps<T>>) {
  const [show, setShow] = useState(false);
  const dynPlaceholder = show ? `Enter ${label.toLowerCase()}` : '••••••••••••';

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          placeholder={dynPlaceholder}
          className="with-toggle"
          {...register(name)}
        />

        <button
          type="button"
          className="eye-btn"
          onClick={() => setShow((s: boolean) => !s)}
          tabIndex={-1}
        >
          <FontAwesomeIcon icon={show ? faEye : faEyeSlash} />
        </button>
      </div>

      {error && <span className="error">{error}</span>}
    </div>
  );
}
