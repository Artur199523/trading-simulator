import React, { ChangeEvent } from 'react';
import './style.scss';

interface RadioInputProps {
    checked: boolean,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
}

const RadioInput: React.FC<RadioInputProps> = ({ checked, onChange }) => {
    return <input className="radio-input" type="radio" checked={checked} onChange={onChange} />;
};

export default RadioInput;