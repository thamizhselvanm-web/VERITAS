import React, { useState } from 'react';
import { CreditCard, Lock, ArrowRight, CheckCircle2, KeyRound, ShieldCheck } from 'lucide-react';
import { TenantId } from '../../types';

interface LoginPageProps {
  onLoginSuccess: (tenantId: TenantId) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [selectedTenant, setSelectedTenant] = useState<TenantId>('tenant-a');
  const [mfaCode, setMfaCode] = useState('849201');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(selectedTenant);
    }, 800);
  };

  return (
    <div className="veritas-login min-h-screen relative overflow-hidden flex items-center justify-center px-5 py-12 sm:px-8">
      <div className="veritas-login__texture pointer-events-none" aria-hidden="true" />
      <div className="veritas-card-ghost pointer-events-none" aria-hidden="true">
        <div className="veritas-card-ghost__brand">VERITAS</div>
        <div className="veritas-card-ghost__chip" />
        <div className="veritas-card-ghost__number">5284&nbsp;&nbsp; 1048&nbsp;&nbsp; 7731&nbsp;&nbsp; 9026</div>
        <div className="veritas-card-ghost__footer"><span>TRUST INTELLIGENCE</span><span>VALID THRU 08/29</span></div>
      </div>

      <main className="veritas-login__layout relative z-10 w-full max-w-[1120px]">
        <section className="veritas-login__intro">
          <p className="veritas-kicker">PRIVATE ACCESS / 08.2026</p>
          <h1>Trust, made<br /><em>verifiable.</em></h1>
          <p className="veritas-login__lead">A secure intelligence layer for financing decisions, built around evidence you can inspect.</p>
          <div className="veritas-login__rule" />
          <div className="veritas-login__signal"><span /><span /><span /><span /><span /><span /><span /></div>
          <p className="veritas-login__caption">Continuous verification<br />for every transaction.</p>
        </section>

        <section className="veritas-login__panel" aria-labelledby="login-title">
          <div className="veritas-login__brand"><span className="veritas-login__mark"><ShieldCheck /></span><span>VERITAS</span><small>SECURE GATEWAY</small></div>
          <div className="veritas-login__heading"><p className="veritas-kicker">AUTHORIZED PERSONNEL</p><h2 id="login-title">Enter workspace</h2><p>Confirm your tenant and identity to continue.</p></div>

          <form onSubmit={handleSubmit} className="veritas-login__form">
            <div className="veritas-field-group">
              <label>Tenant entity</label>
              <div className="veritas-tenant-grid">
              <button
                type="button"
                onClick={() => setSelectedTenant('tenant-a')}
                aria-pressed={selectedTenant === 'tenant-a'}
                className={`veritas-tenant ${
                  selectedTenant === 'tenant-a'
                    ? 'is-selected'
                    : ''
                }`}
              >
                <span>Apex Capital</span><small>TENANT A</small>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTenant('tenant-b')}
                aria-pressed={selectedTenant === 'tenant-b'}
                className={`veritas-tenant ${
                  selectedTenant === 'tenant-b'
                    ? 'is-selected'
                    : ''
                }`}
              >
                <span>Nexus Trade</span><small>TENANT B</small>
              </button>
              </div>
            </div>

            <div className="veritas-field-group">
              <label htmlFor="identity">Underwriter identity</label>
            <input
              id="identity"
              type="text"
              readOnly
              autoComplete="username"
              value="alex.morgan@apexcapital.com"
              className="veritas-input"
            />
            </div>

            <div className="veritas-field-group">
              <label htmlFor="mfa-code">
                <span>Hardware MFA code</span>
                <span className="veritas-status"><CheckCircle2 /> AUTO-FILLED DEMO</span>
              </label>
              <div className="relative">
                <KeyRound className="veritas-input-icon" />
                <input
                  id="mfa-code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="one-time-code"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="veritas-input veritas-input--code"
                />
              </div>
            </div>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="veritas-submit"
          >
            {loading ? (
              <span aria-live="polite">Verifying credentials...</span>
            ) : (
              <>
                <span>Access VERITAS workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          </form>
          <div className="veritas-login__secure"><Lock /><span>OIDC SSO + hardware MFA enforced</span><span className="veritas-login__secure-line" /></div>
        </section>
      </main>
      <footer className="veritas-login__footer"><span>VERITAS / TRUST INTELLIGENCE PLATFORM</span><span>© 2026 VERITAS GLOBAL</span></footer>
    </div>
  );
};
