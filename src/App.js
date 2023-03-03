import './App.css';
import * as React from 'react';
import { Container, Typography, TextField, Box, FormControl, BottomNavigationAction, Paper, BottomNavigation } from '@mui/material';
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import ArchiveIcon from '@mui/icons-material/Archive';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { tcodes } from './data';

const tcodesElab = tcodes.map(item => {
  let keywords = item.keywords.split(' ').map(key => key.toLowerCase())
  return { ...item, keywords }
})

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    // expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(0),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const theme = createTheme({
  typography: {
    fontSize: 11,
    fontFamily: "Segoe UI"
  }
});

function App() {

  const [expanded, setExpanded] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const checkKeywords = () => {

    let searchKeys = search.split(' ').filter(word => word.length >= 2);

    let tcodesWeights = tcodesElab
      .map(tcodeToCheck => {

        let value = 0;

        if (searchKeys.length == 0) return { ...tcodeToCheck, value };

        tcodeToCheck.keywords.forEach(keyToCheck => {
          searchKeys.forEach(searchKey => {
            if (keyToCheck.includes(searchKey)) value++;
          })
        });

        return { ...tcodeToCheck, value };

      })

    return tcodesWeights
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);

  }

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (

    <div className="App">

      <ThemeProvider theme={theme}>

        <Container disableGutters maxWidth={false}>

          <Paper square sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10 }} elevation={1}>
            <FormControl sx={{ m: 1, mt: 2, width: "-webkit-fill-available" }} fullWidth>
              <TextField
                id="outlined-basic"
                label="Ricerca TCODE"
                variant="outlined"
                size="small"
                onChange={e => setSearch(e.target.value)}
              />
            </FormControl>
          </Paper>

          <Box sx={{ pb: "56px", pt: "60px" }}>
            {
              checkKeywords()
                .map(item => (
                  <Accordion expanded={expanded === item.code} onChange={handleChange(item.code)} key={item.code}>
                    <AccordionSummary>
                      <Typography sx={{ fontWeight: 'bold' }}>{item.code}</Typography>
                      <Typography sx={{ ml: 1 }}>{item.descr}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{item.descr}</Typography>
                      <Typography sx={{ fontStyle: 'italic' }}>Keywords: {item.keywords.join(" ")} ({item.value})</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))
            }
          </Box>

          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation
              showLabels
            // value={value}
            // onChange={(event, newValue) => {
            //   setValue(newValue);
            // }}
            >
              <BottomNavigationAction label="Recents" icon={<ArchiveIcon />} />
              <BottomNavigationAction label="Favorites" icon={<ArchiveIcon />} />
              <BottomNavigationAction label="Archive" icon={<ArchiveIcon />} />
            </BottomNavigation>
          </Paper>

        </Container>

      </ThemeProvider>
    </div>
  );
}

export default App;
