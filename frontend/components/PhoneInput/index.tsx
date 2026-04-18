import React from 'react';

type ChangeEvent = {
  phone: string;
  country: string;
  error: boolean;
};

interface Props {
  value: string;
  onChange: (v: ChangeEvent) => void;
  label?: string;
}

const PhoneInput: React.FC<Props> = ({ value, onChange, label }) => {
  const [phone, setPhone] = React.useState<string>(value || '');
  const [country, setCountry] = React.useState<string>('US');
  const [error, setError] = React.useState<boolean>(false);

  React.useEffect(() => {
    onChange({ phone, country, error });
  }, [phone, country, error]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {label && <label>{label}</label>}
      <div style={{ display: 'flex', gap: 8 }}>
        <select value={country} onChange={e => setCountry(e.target.value)}>
          <option value="US">US</option>
          <option value="GB">GB</option>
          <option value="FR">FR</option>
          <option value="DE">DE</option>
        </select>
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder={'+1 555 555 5555'}
        />
      </div>
      {error && <span style={{ color: 'red' }}>Invalid phone</span>}
    </div>
  );
};

export { PhoneInput };
export default PhoneInput;
