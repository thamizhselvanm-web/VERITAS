import React from 'react';
import { SignatureCardSequence } from './SignatureCardSequence';

interface VeritasLoaderProps {
  onComplete: () => void;
}

export const VeritasLoader: React.FC<VeritasLoaderProps> = ({ onComplete }) => {
  return <SignatureCardSequence onComplete={onComplete} />;
};
