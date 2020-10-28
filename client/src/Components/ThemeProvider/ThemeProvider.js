import {
  createContext,
  useState,
  useCallback,
  useEffect,
  useContext,
} from 'react';
import {
  createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { indigo, pink, grey } from '@material-ui/core/colors';

const themes = {
  light: createMuiTheme({
    palette: {
      primary: {
        main: indigo[500],
      },
      secondary: {
        main: pink['A400'],
      },
    },
  }),
  dark: createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        main: indigo[200],
      },
      secondary: {
        main: pink[200],
      },
    },
  }),
};

const ToggleThemeContext = createContext();

const storedThemeType = localStorage.getItem('themeType');

export const ThemeProvider = ({ children }) => {
  const prefersDarkMode = useMediaQuery('@media (prefers-color-scheme: dark)');
  const preferredThemeType = prefersDarkMode ? 'dark' : 'light';

  const [themeType, setThemeType] = useState(
    storedThemeType || preferredThemeType
  );

  const toggleTheme = useCallback(() => {
    setThemeType((themeType) => (themeType === 'light' ? 'dark' : 'light'));
  }, []);

  useEffect(() => {
    localStorage.setItem('themeType', themeType);
    const themeMetaTag = document.querySelector('meta[name="theme-color"]');
    if (themeMetaTag) {
      themeMetaTag.setAttribute(
        'content',
        themeType === 'dark' ? grey[800] : indigo[500]
      );
    }
  }, [themeType]);

  return (
    <MuiThemeProvider theme={themes[themeType]}>
      <ToggleThemeContext.Provider value={toggleTheme}>
        {children}
      </ToggleThemeContext.Provider>
    </MuiThemeProvider>
  );
};

export const useToggleTheme = () => useContext(ToggleThemeContext);
