import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

export function handleBack() {
  navigate(-1);
}
