import React from 'react';
import './panel.css';

interface PanelProps {
    children: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({ children }) => {
    return (
        <div className="panel">
            {children}
        </div>
    );
};

export default Panel;