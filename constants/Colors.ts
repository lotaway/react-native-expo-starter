/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#fa436a'; // Mall primary color
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#303133',
    background: '#f8f8f8',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#C0C4CC',
    tabIconSelected: tintColorLight,
    border: '#E4E7ED',
    primary: '#fa436a',
    secondary: '#4399fc',
    success: '#4cd964',
    warning: '#f0ad4e',
    error: '#dd524d',
    fontColorDark: '#303133',
    fontColorBase: '#606266',
    fontColorLight: '#909399',
    fontColorDisabled: '#C0C4CC',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: '#303133',
    primary: '#fa436a',
    secondary: '#4399fc',
    success: '#4cd964',
    warning: '#f0ad4e',
    error: '#dd524d',
  },
};
