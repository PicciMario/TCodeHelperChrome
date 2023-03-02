import './App.css';
import * as React from 'react';
import { Container, Typography, TextField, Box, FormControl } from '@mui/material';
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { tcodes } from './data';

function App() {

  const [expanded, setExpanded] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  let theme = createTheme({
    typography: {
      fontSize: 11,
      fontFamily: "Segoe UI"
    }
  });

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

  return (

    <div className="App">

      <ThemeProvider theme={theme}>

        <Container disableGutters maxWidth={false}>

          <FormControl sx={{ m: 1, width:"-webkit-fill-available" }}>
            <TextField id="outlined-basic" label="Ricerca TCODE" variant="outlined" onChange={e => setSearch(e.target.value)} />
          </FormControl>

          {
            tcodes
              .filter(item => item.keywords.toLowerCase().includes(search.toLowerCase()))
              .map(item => (
                <Accordion expanded={expanded === item.code} onChange={handleChange(item.code)} key={item.code}>
                  <AccordionSummary>
                    <Typography sx={{ fontWeight: 'bold' }}>{item.code}</Typography>
                    <Typography sx={{ ml: 1 }}>{item.descr}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{item.descr}</Typography>
                    <Typography sx={{ fontStyle: 'italic' }}>Keywords: {item.keywords}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))
          }

        </Container>

      </ThemeProvider>
    </div>
  );
}

export default App;
