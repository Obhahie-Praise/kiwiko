import * as React from 'react';

interface FounderContactEmailProps {
  founderName: string;
  projectName: string;
  message: string;
  contactEmail: string;
}

export const FounderContactEmail: React.FC<FounderContactEmailProps> = ({
  founderName,
  projectName,
  message,
  contactEmail,
}) => {
  const containerStyle = {
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
  };

  const contentStyle = {
    width: '580px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
  } as const;

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '24px',
  };

  const textStyle = {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#4b5563',
    marginBottom: '16px',
  };

  const messageBoxStyle = {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '6px',
    border: '1px solid #f3f4f6',
    fontStyle: 'italic',
    marginBottom: '24px',
    color: '#1f2937',
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>New Message from {founderName}</h1>
        <p style={textStyle}>
          You have received a new message regarding <strong>{projectName}</strong>.
        </p>
        <div style={messageBoxStyle}>
          &ldquo;{message}&rdquo;
        </div>
        <p style={textStyle}>
          You can reply directly to this email or reach out to {founderName} at: 
          <a href={`mailto:${contactEmail}`} style={{ color: '#2563eb', marginLeft: '4px' }}>{contactEmail}</a>
        </p>
        <hr style={{ borderTop: '1px solid #e5e7eb', margin: '32px 0' }} />
        <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center' }}>
          Sent via Kiwiko
        </p>
      </div>
    </div>
  );
};
