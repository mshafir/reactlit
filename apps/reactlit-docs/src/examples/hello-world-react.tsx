import { useState } from 'react';

export default function HelloWorldReact() {
  const [name, setName] = useState('');
  let display = <div>Hello {name}</div>;
  if (!name) {
    display = <div style={{ color: 'red' }}>Name is required</div>;
  }
  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
      {display}
    </div>
  );
}
