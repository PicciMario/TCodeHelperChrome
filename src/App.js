import './App.css';
import * as React from 'react';

import { Container, Typography, TextField, Box, FormControl, BottomNavigationAction, Paper, BottomNavigation, IconButton, CircularProgress } from '@mui/material';

import ArchiveIcon from '@mui/icons-material/Archive';
import SyncIcon from '@mui/icons-material/Sync';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Accordion, AccordionDetails, AccordionSummary } from './CustomComponents';

const theme = createTheme({
  typography: {
    fontSize: 11,
    fontFamily: "Segoe UI"
  }
});

function App() {

  // Stato espansione accordion
  const [expanded, setExpanded] = React.useState(false);

  // Stringa di ricerca
  const [search, setSearch] = React.useState('');

  const [isLoading, setIsLoading] = React.useState(false);

  const [data, setData] = React.useState([]);

  // Recupera stringa di ricerca e cache da local storage
  React.useEffect(() => {
    console.log('Will mount');
    chrome.storage.local.get(["actualSearch", "actualData"], (result) => {
      console.log("Recuperato result ", result)
      setSearch(result.actualSearch || '');
      setData(result.actualData || []);
    });
    return () => {
      console.log('Will unmount');
    };
  }, []);

  /**
   * Effettua filtraggio.
   * 
   * Confronta le chiavi estratte dalla stringa di ricerca (variabile `search`) 
   * e le chiavi di ciascuno dei tcode in `tcodesElab`. Per ciascun TCode 
   * calcola un punteggio mediante il match (anche parziale) tra i due set di 
   * keywords. Restituisce array filtrato per punteggio > 0, ordinato per 
   * punteggio in ordine descrescente.
   * @returns 
   */
  const checkKeywords = () => {

    let searchKeys = (search || '').split(' ').filter(word => word.length >= 2);

    let tcodesWeights = data
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

  const retrieveData = () => {

    let url = 'https://github.com/PicciMario/TCodeHelper/raw/master/tcodes.json';

    setIsLoading(true) <
      fetch(url)
        .then(res => res.json())
        .then(out => {

          setIsLoading(false);

          let formattedData = out.map(item => {
            let keywords = item.keywords.split(' ').map(key => key.toLowerCase())
            return { ...item, keywords }
          })

          setData(formattedData)

          chrome.storage.local.set({ actualData: formattedData }).then(() => { console.log("Saved local cache...") });

          console.log('Checkout this JSON! ', out)

        })
        .catch(err => { throw err });
  }

  /**
   * Gestisce apertura/chiusura accordion.
   * @param {*} panel 
   * @returns 
   */
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  /**
   * Gestisce modifica stringa ricerca.
   * 
   * La stringa inserita nel componente viene salvata nello stato e nel 
   * local storage (chiave "actualSearch").
   * @param {*} e 
   */
  const handleSearchChange = (e) => {
    chrome.storage.local.set({ actualSearch: e.target.value }).then(() => { });
    setSearch(e.target.value)
  }

  return (

    <div className="App">

      <ThemeProvider theme={theme}>

        <Container disableGutters maxWidth={false}>

          <Paper square sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10 }} elevation={1}>
            <FormControl sx={{ m: 1, mt: 2, width: "-webkit-fill-available", display: "flex", flexDirection: 'row' }} fullWidth>
              <TextField
                id="outlined-basic"
                label="Ricerca TCODE"
                variant="outlined"
                size="small"
                value={search}
                onChange={handleSearchChange}
                sx={{ flexGrow: 1 }}
              />
              <IconButton component="label" onClick={retrieveData} sx={{ ml: 1 }}>
                {isLoading ? <CircularProgress size="1rem" /> : <SyncIcon />}
              </IconButton>
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
