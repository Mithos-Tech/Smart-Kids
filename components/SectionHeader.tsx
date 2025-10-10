import React from 'react';
import { Link } from 'react-router-dom';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  textColor?: 'light' | 'dark';
  hideLink?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, textColor = 'light', hideLink = false }) => {
  const titleColor = textColor === 'light' ? 'text-light' : 'text-darker';
  const subtitleColor = textColor === 'light' ? 'text-light/60' : 'text-dark/70';

  return (
    <div className="flex justify-between items-baseline mb-12">
      <h2 className={`font-heading text-4xl font-bold ${titleColor}`}>{title}</h2>
      {!hideLink ? (
        <Link to="/episodes" className={`hidden sm:block text-md hover:text-primary transition-colors ${subtitleColor}`}>
          {subtitle} &rarr;
        </Link>
      ) : (
        <p className={`hidden sm:block text-md ${subtitleColor}`}>{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeader;
