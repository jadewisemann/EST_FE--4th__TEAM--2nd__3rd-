import { create } from 'zustand';

const getInitialTheme = () => {
  // 시스템 설정 테마 값 다크모드 여부 확인
  const isBrowserDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches;

  // localStorage theme 값 가져오기
  const storedTheme = localStorage.getItem('theme');

  // localStorage에 값이 있으면 초기 값으로 대입
  return storedTheme
    ? JSON.parse(storedTheme)
    : isBrowserDarkMode
      ? 'dark'
      : '';
};

const useDarkModeStore = create(set => ({
  darkMode: getInitialTheme(),
  toggleDarkMode: () =>
    set(state => {
      const newDarkMode = state.darkMode === 'dark' ? '' : 'dark';
      localStorage.setItem('theme', JSON.stringify(newDarkMode));

      document.body.classList.toggle('dark', newDarkMode === 'dark');

      return { darkMode: newDarkMode };
    }),
}));

// 초기에 body에 class 값 지정
document.body.classList.toggle(
  'dark',
  useDarkModeStore.getState().darkMode === 'dark',
);

export default useDarkModeStore;
