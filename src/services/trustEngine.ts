import { TrustProfile, DecisionState, TrustSignal, RiskSeverity } from '../types';

export class TrustEngine {
  /**
   * Recalculates Trust Profile based on TRD Section 11 score contract
   */
  public static calculateTelemetry(
    invoiceId: string,
    riskSignals: TrustSignal[],
    evidenceScore: number = 70
  ): TrustProfile {
    // Calculate base trust score from active risk impacts
    let baseScore = 95;
    const reasons: string[] = [];

    riskSignals.forEach(signal => {
      baseScore += signal.scoreImpact;
      reasons.push(`${signal.title}: ${signal.description}`);
    });

    const trustScore = Math.max(0, Math.min(100, Math.round(baseScore)));
    const confidenceScore = Math.round(Math.max(40, Math.min(99, 90 - riskSignals.length * 8)));
    const evidenceCompleteness = evidenceScore;

    // Determine risk level
    let riskLevel: RiskSeverity = 'LOW';
    if (trustScore < 30 || riskSignals.some(s => s.severity === 'CRITICAL')) {
      riskLevel = 'CRITICAL';
    } else if (trustScore < 60 || riskSignals.some(s => s.severity === 'HIGH')) {
      riskLevel = 'HIGH';
    } else if (trustScore < 85 || riskSignals.some(s => s.severity === 'MEDIUM')) {
      riskLevel = 'MEDIUM';
    }

    // Determine recommendation state per PRD Section 6 & TRD Section 11
    let recommendation: DecisionState = 'APPROVE_RECOMMENDATION';
    if (riskLevel === 'CRITICAL') {
      recommendation = 'BLOCK_BY_POLICY';
    } else if (evidenceCompleteness < 50) {
      recommendation = 'REQUEST_MORE_EVIDENCE';
    } else if (riskLevel === 'HIGH' || riskLevel === 'MEDIUM') {
      recommendation = 'MANUAL_REVIEW';
    }

    return {
      id: `tp-${Date.now()}`,
      invoiceId,
      trustScore,
      confidenceScore,
      evidenceCompleteness,
      riskLevel,
      recommendation,
      modelVersion: 'risk-0.3.0',
      featureSchemaVersion: 'feat-v1.4',
      reasons
    };
  }
}
