import Link from 'next/link';

export const Menu = () => {
  return (
    <>
      <Link href="/hello-world">Hello World</Link>
      <Link href="/hello-world-vanilla">Hello World Vanilla</Link>
      <Link href="/radix-inputs">Radix Inputs</Link>
      <Link href="/todo-list">Todo List</Link>
    </>
  );
};
