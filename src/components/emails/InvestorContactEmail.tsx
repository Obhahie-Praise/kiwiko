import * as React from 'react';

interface InvestorContactEmailProps {
  investorName: string;
  projectName: string;
  message: string;
  contactEmail: string;
}

export const InvestorContactEmail: React.FC<InvestorContactEmailProps> = ({
  investorName,
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
    backgroundColor: '#f0f9ff',
    padding: '20px',
    borderRadius: '6px',
    border: '1px solid #e0f2fe',
    marginBottom: '24px',
    color: '#0c4a6e',
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>Investment Interest: {projectName}</h1>
        <p style={textStyle}>
          <strong>{investorName}</strong> is interested in your project <strong>{projectName}</strong> and has sent you a message:
        </p>
        <div style={messageBoxStyle}>
          &ldquo;{message}&rdquo;
        </div>
        <p style={textStyle}>
          This could be a great opportunity! You can reach back to the investor at:
          <br />
          <a href={`mailto:${contactEmail}`} style={{ color: '#2563eb' }}>{contactEmail}</a>
        </p>
        <hr style={{ borderTop: '1px solid #e5e7eb', margin: '32px 0' }} />
        <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center' }}>
          Sent via Kiwiko Investor Relations
        </p>
      </div>
    </div>
  );
};
