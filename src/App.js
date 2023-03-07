import './App.css';
import * as React from 'react';

import {
  Container,
  BottomNavigationAction,
  Paper,
  BottomNavigation,
} from '@mui/material';

import ArchiveIcon from '@mui/icons-material/Archive';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import TCodeComponent from './components/TCodeComponent';
import AboutComponent from './components/AboutComponent';

const theme = createTheme({
  typography: {
    fontSize: 11,
    fontFamily: "Segoe UI"
  }
});

function App() {

  const [selectedTab, setSelectedTab] = React.useState(1);

  const activeTab = () => {
    switch (selectedTab) {
      case 0:
        return <TCodeComponent />
      case 1:
        return <AboutComponent />
      default:
        break;
    }
  }

  return (

    <div className="App">

      <ThemeProvider theme={theme}>

        <Container disableGutters maxWidth={false}>

          {activeTab()}

          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation
              showLabels
              value={selectedTab}
              onChange={(event, newValue) => {
                setSelectedTab(newValue);
              }}
            >
              <BottomNavigationAction label="TCodes" icon={<ArchiveIcon />} />
              <BottomNavigationAction label="About" icon={<ArchiveIcon />} />
            </BottomNavigation>
          </Paper>

        </Container>

      </ThemeProvider>
    </div>
  );
}

export default App;
