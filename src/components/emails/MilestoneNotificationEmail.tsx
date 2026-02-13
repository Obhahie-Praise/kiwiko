import * as React from 'react';

interface MilestoneNotificationEmailProps {
  projectName: string;
  milestoneTitle: string;
  date: string;
}

export const MilestoneNotificationEmail: React.FC<MilestoneNotificationEmailProps> = ({
  projectName,
  milestoneTitle,
  date,
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

  const iconStyle = {
    fontSize: '48px',
    textAlign: 'center' as const,
    marginBottom: '16px',
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center' as const,
    marginBottom: '24px',
  };

  const textStyle = {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#4b5563',
    textAlign: 'center' as const,
    marginBottom: '24px',
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={iconStyle}>🎉</div>
        <h1 style={titleStyle}>Milestone Achieved!</h1>
        <p style={textStyle}>
          Congratulations! <strong>{projectName}</strong> has reached a new milestone:
          <br />
          <strong style={{ fontSize: '20px', color: '#111827' }}>{milestoneTitle}</strong>
        </p>
        <p style={textStyle}>
          Date: {date}
        </p>
        <p style={textStyle}>
          Keep up the great work. Every step brings you closer to your vision.
        </p>
        <hr style={{ borderTop: '1px solid #e5e7eb', margin: '32px 0' }} />
        <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center' }}>
          Celebrating your success on Kiwiko
        </p>
      </div>
    </div>
  );
};
