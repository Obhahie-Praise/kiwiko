import * as React from 'react';

interface TeamInviteEmailProps {
  orgName?: string;
  projectName?: string;
  inviterName: string;
  role: string;
  inviteLink: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
}

export const TeamInviteEmail: React.FC<TeamInviteEmailProps> = ({
  orgName,
  projectName,
  inviterName,
  role,
  inviteLink,
  logoUrl,
  bannerUrl,
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
  };

  const headerStyle = {
    textAlign: 'center' as const,
    marginBottom: '32px',
  };

  const bannerStyle = bannerUrl ? {
    width: '100%',
    height: '150px',
    objectFit: 'cover' as const,
    borderRadius: '4px',
    marginBottom: '24px',
  } : {};

  const logoStyle = {
    margin: '0 auto',
    borderRadius: '50%',
    marginBottom: '16px',
  };

  const titleStyle = {
    fontSize: '24px',
    lineHeight: '1.3',
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center' as const,
  };

  const textStyle = {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#4b5563',
    marginBottom: '24px',
  };

  const buttonContainer = {
    textAlign: 'center' as const,
    marginTop: '32px',
    marginBottom: '32px',
  };

  const buttonStyle = {
    backgroundColor: '#000000',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 24px',
  };

  const footerStyle = {
    color: '#9ca3af',
    fontSize: '14px',
    textAlign: 'center' as const,
    marginTop: '48px',
  };

  const contextName = orgName || projectName || 'the team';

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        {bannerUrl && <img src={bannerUrl} alt="Banner" style={bannerStyle} />}
        <div style={headerStyle}>
          {logoUrl && <img src={logoUrl} width="64" height="64" alt="Kiwiko Logo" style={logoStyle} />}
          <h1 style={titleStyle}>Join {inviterName} on Kiwiko</h1>
        </div>
        <p style={textStyle}>
          Hello! <strong>{inviterName}</strong> has invited you to join <strong>{contextName}</strong> as a <strong>{role}</strong>.
        </p>
        <p style={textStyle}>
          Kiwiko is the platform where founders and investors connect to build the future. We&apos;d love to have you on board!
        </p>
        <div style={buttonContainer}>
          <a href={inviteLink} style={buttonStyle}>
            Accept Invitation
          </a>
        </div>
        <p style={textStyle}>
          If the button above doesn&apos;t work, copy and paste this link into your browser:
          <br />
          <a href={inviteLink} style={{ color: '#2563eb' }}>{inviteLink}</a>
        </p>
        <hr style={{ borderTop: '1px solid #e5e7eb', margin: '32px 0' }} />
        <p style={footerStyle}>
          &copy; {new Date().getFullYear()} Kiwiko. All rights reserved.
        </p>
      </div>
    </div>
  );
};
