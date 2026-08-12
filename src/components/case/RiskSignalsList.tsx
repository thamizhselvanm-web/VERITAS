import React from 'react';
import { ExplainabilityPanel } from './ExplainabilityPanel';
import { TrustSignal } from '../../types';

interface RiskSignalsListProps {
  signals: TrustSignal[];
}

export const RiskSignalsList: React.FC<RiskSignalsListProps> = ({ signals }) => {
  return <ExplainabilityPanel signals={signals} />;
};
