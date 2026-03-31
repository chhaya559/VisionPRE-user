import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export default function ErrorBoundary() {
  const error = useRouteError();

  let errorMessage = 'An unexpected error occurred.';
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message || 'Route error';
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'sans-serif',
        backgroundColor: '#F9FAFB',
      }}
    >
      <h1 style={{ color: '#EF4444', fontSize: '2rem', marginBottom: '1rem' }}>
        Oops! Something went wrong.
      </h1>
      <p
        style={{
          color: '#6B7280',
          fontSize: '1.125rem',
          maxWidth: '600px',
          marginBottom: '2rem',
        }}
      >
        {errorMessage}
      </p>
      <button
        onClick={() => (window.location.href = '/')}
        style={{
          padding: '10px 24px',
          backgroundColor: '#3B82F6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '500',
          transition: 'background-color 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3B82F6')}
      >
        Go back home
      </button>
    </div>
  );
}
