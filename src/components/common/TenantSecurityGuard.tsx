import React, { useState } from 'react';
import { TenantId } from '../../types';

interface TenantSecurityGuardProps {
  activeTenantId: TenantId;
  targetCaseTenantId: TenantId;
}

export const TenantSecurityGuard: React.FC<TenantSecurityGuardProps> = ({
  activeTenantId,
  targetCaseTenantId
}) => {
  const [dismissed, setDismissed] = useState(false);
  const isAllowed = activeTenantId === targetCaseTenantId;

  if (isAllowed || dismissed) {
    return null;
  }

  return (
    <div className="banner show" role="alert">
      <div>
        <strong>Security access violation — IDOR defense</strong>
        <p>
          Tenant <strong>{activeTenantId.toUpperCase()}</strong> attempted to access a record belonging to <strong>{targetCaseTenantId.toUpperCase()}</strong>. Access blocked by VERITAS tenant-context middleware; cross-tenant queries are logged to the SIEM audit stream.
        </p>
      </div>
      <button className="close" aria-label="Dismiss" onClick={() => setDismissed(true)}>
        ✕
      </button>
    </div>
  );
};
