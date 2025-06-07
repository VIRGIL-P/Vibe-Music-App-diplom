// import { useEffect, useState } from 'react';
// import { Moon, Sun } from 'lucide-react';

// const ThemeToggle = () => {
//   const [dark, setDark] = useState(() => {
//     return localStorage.getItem('theme') === 'dark';
//   });

//   useEffect(() => {
//     const root = window.document.documentElement;
//     if (dark) {
//       root.classList.add('dark');
//       localStorage.setItem('theme', 'dark');
//     } else {
//       root.classList.remove('dark');
//       localStorage.setItem('theme', 'light');
//     }
//   }, [dark]);

//   return (
//     <button
//       onClick={() => setDark(!dark)}
//       className="flex items-center gap-1 px-3 py-1 rounded-md text-sm bg-zinc-700 hover:bg-zinc-600 text-white transition"
//     >
//       {dark ? <Sun size={16} /> : <Moon size={16} />}
//       {dark ? 'Светлая' : 'Тёмная'}
//     </button>
//   );
// };

// export default ThemeToggle;
