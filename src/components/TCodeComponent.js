import * as React from 'react';

import {
	Typography,
	TextField,
	Box,
	FormControl,
	Paper,
	IconButton,
	CircularProgress,
	Snackbar,
	Button,
	Alert,
	Tooltip
} from '@mui/material';

import SyncIcon from '@mui/icons-material/Sync';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { Accordion, AccordionDetails, AccordionSummary } from './CustomComponents';

export default function TCodeComponent() {

	// Stato espansione accordion
	const [expanded, setExpanded] = React.useState(false);

	// Stringa di ricerca
	const [search, setSearch] = React.useState('');

	// Caricamento in corso...
	const [isLoading, setIsLoading] = React.useState(false);

	// Array TCodes
	const [data, setData] = React.useState([]);

	// Stati per snackbar retrieve TCodes (conferma o errore)
	const [retrieveNotifOpen, setRetrieveNotifOpen] = React.useState(false);
	const [retrieveError, setRetrieveError] = React.useState(null);

	// Stati per snackbar copia TCode in appunti
	const [copyNotifOpen, setCopyNotifOpen] = React.useState(false);
	const [copyValue, setCopyValue] = React.useState(null);

	// Recupera stringa di ricerca e cache da local storage
	React.useEffect(() => {
		chrome.storage.local.get(["actualSearch", "actualData"], (result) => {
			console.log("Loaded data from Chrome Storage", result)
			setSearch(result.actualSearch || '');
			setData(result.actualData || []);
		});
		return () => { };
	}, []);

	/**
	 * Recupera dati da url e li salva nello stato e nello storage.
	 */
	const retrieveData = () => {

		let url = 'https://github.com/PicciMario/TCodeHelperChrome/raw/master/tcodes.json';

		console.log(`Retrieving data from ${url}...`)
		setIsLoading(true);

		fetch(url)
			.then((res) => {
				console.log(...res.headers);
				return res.json()
			})
			.then(out => {

				setIsLoading(false);

				let formattedData = out.map(item => {
					let keywords = item.keywords.split(' ').map(key => key.toLowerCase())
					return { ...item, keywords }
				})

				console.log("Data retrieved.", formattedData);
				setData(formattedData);
				setRetrieveNotifOpen(true);
				chrome.storage.local.set({ actualData: formattedData }).then(() => { console.log("Saved local cache.") });

			})
			.catch(err => {
				setIsLoading(false);
				setRetrieveError(err);
				setRetrieveNotifOpen(true);
			});
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

	/**
	 * Chiude notifica refresh TCodes.
	 */
	const closeRetrieveNotif = () => {
		setRetrieveNotifOpen(false);
	}

	/**
	 * Chiude notifica avvenuta copia negli appunti del TCode.
	 */
	const closeCopyNotif = () => {
		setCopyNotifOpen(false);
	}

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

	/**
	 * Copia codice in appunti.
	 * @param {*} code 
	 */
	const copyCodeToClipboard = (code) => {
		navigator.clipboard.writeText('/n' + code);
		setCopyValue('/n' + code)
		setCopyNotifOpen(true)
	}

	return (

		<React.Fragment>
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
					<Tooltip title="Download TCODES">
						<IconButton component="label" onClick={retrieveData} sx={{ ml: 1 }}>
							{isLoading ? <CircularProgress size="1rem" /> : <SyncIcon />}
						</IconButton>
					</Tooltip>
				</FormControl>
			</Paper>

			<Box sx={{ pb: "56px", pt: "60px" }}>

				<Snackbar
					open={retrieveNotifOpen}
					autoHideDuration={retrieveError ? null : 4000}
					onClose={closeRetrieveNotif}
					action={
						<Button color="inherit" size="small" onClick={closeRetrieveNotif}>
							Clear
						</Button>
					}
					sx={{ pb: "56px" }}
				>
					<Alert
						onClose={closeRetrieveNotif}
						severity={retrieveError ? "error" : "success"}
						sx={{ width: '100%' }}
					>
						{retrieveError ? `${retrieveError}` : `Retrieved ${data.length} TCODES.`}
					</Alert>
				</Snackbar>

				<Snackbar
					open={copyNotifOpen}
					autoHideDuration={2000}
					onClose={closeCopyNotif}
					action={
						<Button color="inherit" size="small" onClick={closeCopyNotif}>
							Clear
						</Button>
					}
					sx={{ pb: "56px" }}
				>
					<Alert
						onClose={closeCopyNotif}
						severity="success"
						sx={{ width: '100%' }}
					>
						{'Copiato negli appunti: ' + copyValue}
					</Alert>
				</Snackbar>

				{
					checkKeywords()
						.map(item => (

							<Accordion expanded={expanded === item.code} onChange={handleChange(item.code)} key={item.code}>
								
								<AccordionSummary>
									<IconButton
										component="label"
										onClick={(e) => { copyCodeToClipboard(item.code); e.stopPropagation() }}
										style={{ position: 'absolute', left: 0, top: '6px' }}
									>
										<ContentCopyIcon fontSize='small' />
									</IconButton>
									<Typography sx={{ fontWeight: 'bold', ml: 1.5 }}>
										{item.code}
									</Typography>
									<Typography sx={{ ml: 1, mr: 1 }}>
										{item.descr}
									</Typography>
								</AccordionSummary>
								
								<AccordionDetails>
									<Typography>
										{item.descr}
									</Typography>
									<Typography sx={{ fontStyle: 'italic' }}>
										Keywords: {item.keywords.join(" ")} ({item.value})
									</Typography>
								</AccordionDetails>

							</Accordion>

						))
				}

			</Box>
		</React.Fragment>

	)

}