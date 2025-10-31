import React from 'react';

type IconProps = {
  className?: string;
};

export const AvocadoIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.11 12.42a1 1 0 0 0-1.42-1.42l-2.5 2.5a1 1 0 0 0 0 1.42l2.5 2.5a1 1 0 0 0 1.42-1.42z" />
        <path d="M12 2a9.9 9.9 0 0 0-8.33 5.37c-1.12 2.76-1.12 7.49 0 10.26A9.9 9.9 0 0 0 12 23a9.9 9.9 0 0 0 8.33-5.37c1.12-2.76 1.12-7.49 0-10.26A9.9 9.9 0 0 0 12 2z" />
    </svg>
);


export const UploadIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const ArrowPathIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12c0-3.75 3.0-6.75 6.75-6.75s6.75 3.0 6.75 6.75c0 3.75-3.0 6.75-6.75 6.75s-6.75-3.0-6.75-6.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v3.75m0 7.5v3.75M4.5 12h3.75m7.5 0h3.75" />
    </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
