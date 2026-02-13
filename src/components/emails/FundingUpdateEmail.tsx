import * as React from 'react';

interface FundingUpdateEmailProps {
  projectName: string;
  amount: string;
  date: string;
  status: 'Received' | 'Pending' | 'Committed';
}

export const FundingUpdateEmail: React.FC<FundingUpdateEmailProps> = ({
  projectName,
  amount,
  date,
  status,
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

  const statusBadge = {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: status === 'Received' ? '#dcfce7' : status === 'Pending' ? '#fef9c3' : '#dbeafe',
    color: status === 'Received' ? '#166534' : status === 'Pending' ? '#854d0e' : '#1e40af',
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>Funding Update for {projectName}</h1>
        <p style={textStyle}>
          We have an update regarding the funding status for your project.
        </p>
        <div style={{ marginBottom: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px 0', color: '#6b7280' }}>Amount</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>{amount}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', color: '#6b7280' }}>Date</td>
                <td style={{ padding: '8px 0', textAlign: 'right' }}>{date}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', color: '#6b7280' }}>Status</td>
                <td style={{ padding: '8px 0', textAlign: 'right' }}>
                  <span style={statusBadge}>{status}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={textStyle}>
          You can view more details in your Kiwiko dashboard.
        </p>
        <hr style={{ borderTop: '1px solid #e5e7eb', margin: '32px 0' }} />
        <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center' }}>
          Kiwiko Financial Services
        </p>
      </div>
    </div>
  );
};
