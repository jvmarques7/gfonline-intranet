import React, { Fragment, useEffect, useState } from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, Grid, Checkbox, FormControlLabel, FormGroup, FormControl, FormLabel, Divider, Button, Backdrop, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, RadioGroup, Radio, MenuItem, InputLabel, Select, Stack, Pagination } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from '../../config/services/api';
import { Tittle } from './style';
import { Box } from '@mui/system';
import Moment from 'react-moment';
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { CreateEvent } from './createEvent';
import { makeStyles } from '@material-ui/styles';
import { Participantes } from './modalParticipantes';

const StyleSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
        padding: 0,
        margin: 2,
        transitionDuration: "300ms",
        "&.Mui-checked": {
            transform: "translateX(16px)",
            color: "#fff",
            "& + .MuiSwitch-track": {
                backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
                opacity: 1,
                border: 0
            },
            "&.Mui-disabled + .MuiSwitch-track": {
                opacity: 0.5
            }
        },
        "&.Mui-focusVisible .MuiSwitch-thumb": {
            color: "#33cf4d",
            border: "6px solid #fff"
        },
        "&.Mui-disabled .MuiSwitch-thumb": {
            color:
                theme.palette.mode === "light"
                    ? theme.palette.grey[100]
                    : theme.palette.grey[600]
        },
        "&.Mui-disabled + .MuiSwitch-track": {
            opacity: theme.palette.mode === "light" ? 0.7 : 0.3
        }
    },
    "& .MuiSwitch-thumb": {
        boxSizing: "border-box",
        width: 22,
        height: 22
    },
    "& .MuiSwitch-track": {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
        opacity: 1,
        transition: theme.transitions.create(["background-color"], {
            duration: 500
        })
    }
}));

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      marginTop: 35,
      marginBottom: 35
    },
    paper: {
      margin: 10,
      textAlign: 'center'
    },
    display: {
      display: 'flex',
      width: '100%'
    },
    formControl: {
      width: '30%',
    },
  }));

export function ListEvent() {

    const classes = useStyles();

    const notifyError = () => toast.error(text, {theme: 'colored'});
    let text = '';

    const notify = () => toast.warning(textWarning, {theme: 'colored'});
    let textWarning = '';

    const notifySuccess = () => toast.success(text, {theme: 'colored'});
    

    //Expansão do Accordion
    const [expanded, setExpanded] = React.useState(false);
    const handleChange = (panel) => (e, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    
    //Contrução da lista de eventos trazidos pela API
    const [eventsList, setEventsList] = useState([]);
    const [openExcluir, setOpenExcluir] = useState(false);
    const [openControl, setOpenControl] = useState(false);
    const [eventId, setEventId] = useState("");
    const [atuacoes, setAtuacoes] = useState("");
    const [modalidades, setModalidades] = useState("");
    const [categorias, setCategorias] = useState("");
    const [tipo, setTipo] = useState("");
    const [estado, setEstado] = useState("");
    const [dt_inicial, setDt_inicial] = useState("");
    const [dt_final, setDt_final] = useState("");
    const [buscar, setBuscar] = useState('off');
    const [openParticipantes, setOpenParticipantes] = useState(false);
    const [modal, setModal] = useState();
    const [page, setPage] = useState(1);
    const [list, setList] = useState();
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        if(localStorage.getItem('reload')){
            text = "Evento salvo com sucesso!";
            notifySuccess();
            localStorage.removeItem('reload');
        }
        async function atualizarEventos() {
            const { data } = await api.put('listar_eventos', {eventId, tipo, estado, dt_inicial, dt_final, atuacoes, modalidades, categorias});
            setCount(data.pages)
            setEventsList(data.events[page-1])
        }
        if(openParticipantes === true){
            setModal(
                <Fragment>
                    <Participantes></Participantes>
                </Fragment>
            )
        }
        atualizarEventos();
    }, [openExcluir, openControl, openParticipantes, buscar, page]);

    //Atualização do estado dos eventos
    function definirEstado(e) {
        if (e === 'a') {
            return "Ativo"
        } else {
            return "Desativado"
        }
    }
    //Logo abaixo segue a atualização do estado
    //para qual será alterado
    function estadoFuturo(e) {
        if (e === 'a') {
            return "desativar"
        } else {
            return "ativar"
        }
    }

    //Definição do tipo de evento de acordo
    //o que é trazido pela API
    function definirTipo(e) {
        if (e === 'c') {
            return "Campeonato"
        } else {
            return "Evento"
        }
    }

    //Listar atuações definidas para o evento
    function definirAtuacao(e) {
        let arr = [];
        const atuacao = e.split("");
        atuacao.forEach((entry) => {
            if (entry === "1") {
                arr[0] = "Jogador"
            } else if (entry === "2") {
                arr[1] = "Árbitro"
            } else if (entry === "3") {
                arr[2] = "Técnico"
            }
        })
        return (arr.map(entrada => (
            <FormControlLabel disableTypography disabled control={<Checkbox defaultChecked />} label={entrada} />
        )))
    }

    //Listar modalidades definidas para o evento
    function definirModalidade(e) {
        let arr = [];
        const modalidade = e.split("");
        modalidade.forEach((entry) => {
            if (entry === "1") {
                arr[0] = "Adulto"
            } else if (entry === "2") {
                arr[1] = "Paradesporto"
            } else if (entry === "3") {
                arr[2] = "Juvenil"
            } else if (entry === "4") {
                arr[3] = "Mirim"
            } else if (entry === "5") {
                arr[4] = "Infanto-Juvenil"
            } else if (entry === "6") {
                arr[5] = "Infantil"
            } else if (entry === "7") {
                arr[6] = "Master"
            }
        })
        return (arr.map(entrada => (
            <FormControlLabel disableTypography disabled control={<Checkbox defaultChecked />} label={entrada} />
        )))
    }

    //Listar categorias definidas para o evento
    function definirCategoria(e) {
        let arr = [];
        const categoria = e.split("");
        categoria.forEach((entry) => {
            if (entry === "1") {
                arr[0] = "Feminino"
            } else if (entry === "2") {
                arr[1] = "Masculino"
            }
        })
        return (arr.map(entrada => (
            <FormControlLabel disableTypography disabled control={<Checkbox defaultChecked />} label={entrada} />
        )))
    }

    //Fechando e abrindo BackDrop
    const handleClose = () => {
        setOpenControl(false);
        setOpenExcluir(false);
        setOpenParticipantes(false);
    };

    const handleToggleControl = () => {
        setOpenControl(true);
    };

    const handleToggleExcluir = () => {
        setOpenExcluir(true);
    };

    const handleParticipantes = (event) => {
        sessionStorage.setItem('id_event', event.target.value);
        setOpenParticipantes(true);
    }

    const openBackDrop = (id, est) => {

        async function salvarEvento(){
            await api.put(`control_event/${id}`);
            setOpenControl(false);
            text = "Evento alterado com sucesso!";
            notifySuccess();
        }

        return(
            <Fragment>
                <Paper>
                    <Box padding="20px">
                        <Typography variant="h6" paddingBottom="20px">
                            O evento {id} está {definirEstado(est).toLowerCase()}.
                        </Typography>
                        <Typography variant="h6" paddingBottom="20px">
                            Deseja realmente {estadoFuturo(est)}?
                        </Typography>
                        <Grid container display="flex" paddingTop="20px">
                            <Grid item xs="auto" paddingRight="10px">
                                {/* {carregarControle(e)} */}
                                <Button variant="contained" onClick={salvarEvento}>{estadoFuturo(est)}</Button>
                            </Grid>
                            <Grid item xs="auto">
                                <Button color="warning" variant="contained" onClick={handleClose}>Cancelar</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Fragment>
        )
    }

    const openDeleteEvent = (id) => {

        async function excluirEvento(){
            try{
                await api.delete(`delete_event/${id}`);
                setOpenExcluir(false);
                textWarning = "Evento excluído!";
                notify();
            }catch(err){
                setOpenExcluir(false);
                text = "Remova as inscrições para excluir este evento!"
                notifyError()
            }
        }

        return(
            <Fragment>
                <Paper>
                    <Box padding="20px">
                        <Typography variant="h6" paddingBottom="20px">
                            O evento {id} será excluído <b>PERMANENTEMENTE</b>.
                        </Typography>
                        <Typography variant="h6" paddingBottom="20px">
                            Deseja realmente excluir?
                        </Typography>
                        <Grid container display="flex" paddingTop="20px">
                            <Grid item xs="auto" paddingRight="10px">
                                <Button variant="contained" onClick={excluirEvento}>Excluir</Button>
                            </Grid>
                            <Grid item xs="auto">
                                <Button color="warning" variant="contained" onClick={handleClose}>Cancelar</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Fragment>
        )
    }

    function ativarLista(ativacao){
        if(ativacao === 'a'){
            return false;
        }else{
            return true;
        }
    }

    function setDataInicial(dt) {
        var date = new Date(dt);
        setDt_inicial(
            dt+' 21:00:00'
        )
    }

    function setDataFinal(dt) {
        setDt_final(
            dt+' 21:00:00'
        )
    }

    function realizarBusca(){
        if(buscar === 'on'){
            setBuscar('off')
        }else{
            setBuscar('on')
        }
    }

    const changePage = (event, value) => {
        setPage(value);
      };

    function pagination(){

            return (
            <>
                {eventsList.map(e =>
                (<Box key={e.id} paddingLeft="20px" style={{ listStyleType: "none" }}>
                    <Accordion TransitionProps={{ unmountOnExit: true }} expanded={expanded === e.id} onChange={handleChange(e.id)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Typography sx={{ width: '10%', flexShrink: 0 }}>
                                #{e.id}
                            </Typography>
                            <Typography sx={{ width: '45%', flexShrink: 0 }}>
                                {e.titulo}
                            </Typography>
                            <Typography sx={{ width: '30%', color: 'text.secondary' }}>
                                Tipo: {definirTipo(e.tipo)}
                            </Typography>
                            <Typography sx={{ width: '15%', color: 'text.secondary' }}>
                                {definirEstado(e.estado)}
                            </Typography>
                        </AccordionSummary>
                        <Divider />
                        <AccordionDetails >
                            <Grid container paddingTop="10px">
                                    <Grid item xs={10}>
                                        {"Data do evento: "}
                                        <Moment format="DD/MM/YYYY">
                                            {e.data}
                                        </Moment>
                                    </Grid>
                            </Grid>
                            <br />
                            <Grid container flex="1" justifyContent="space-between">
                                <Grid item xs={12}>Descrição: {e.decricao}</Grid>
                            </Grid>
                            <Grid container paddingTop="20px" flex="1" justifyContent="space-between">
                                <Grid item xs={3}>
                                    <p>Atuação</p>
                                    <FormGroup >
                                        {definirAtuacao(e.atuacoes)}
                                    </FormGroup>
                                </Grid>
                                <Grid item xs={3}>
                                    <p>Modalidade</p>
                                    <FormGroup>
                                        {definirModalidade(e.modalidades)}
                                    </FormGroup>
                                </Grid>
                                <Grid item xs={3}>
                                    <p>Categoria</p>
                                    <FormGroup>
                                        {definirCategoria(e.categorias)}
                                    </FormGroup>
                                </Grid>
                            </Grid>
                            <Divider />
                            <Grid container paddingTop="20px" flex="1" justifyContent="center">
                                <Grid item paddingRight="10px">
                                    <Button variant="contained" onClick={handleToggleControl}>{estadoFuturo(e.estado)}</Button>
                                    <Backdrop
                                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                        open={openControl}
                                    >
                                        {openBackDrop(e.id, e.estado)}
                                    </Backdrop>  
                                </Grid>
                                <Grid item paddingRight="50px">
                                    <Button color="error" variant="contained" onClick={handleToggleExcluir}>Excluir</Button>
                                    <Backdrop
                                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                        open={openExcluir}
                                    >
                                        {openDeleteEvent(e.id)}
                                    </Backdrop>
                                </Grid>
                                <Grid item>
                                    <Button color="info" value={e.id} variant="contained" onClick={(event) => handleParticipantes(event)}>Particpantes</Button>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                    <br />
                </Box>)
                )}
            </>
        )
    }

    const windowListEvents = (
        <>
        <Box>
            <Grid container flex="1" alignItems="center" justifyContent="space-between">
                <Grid item>
                    <Tittle>Lista de Eventos</Tittle>
                </Grid>
                <Grid item>
                    <CreateEvent></CreateEvent>
                </Grid>
            </Grid>
            <Box padding="0 0 20px 20px">
                <Grid container flex="1" justifyContent="space-between" >
                    <Grid item xs={12}>
                        <FormControl fullWidth> 
                            <Paper variant="outlined" >
                                <Grid container padding="10px 0 0 20px" flex="1" alignItems="center" justifyContent="flex-start">
                                    <Grid item width="10%"> 
                                        <Button padding="10px" style={{ cursor: 'default', pointerEvents: 'none' }} 
                                        startIcon={<FilterAltIcon />}>filtros</Button>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={{ xs: 2, md: 3 }}
                                padding="10px 20px 20px 20px" flex="1" justifyContent="flex-start" alignItems="center">
                                    <Grid item xs={3}>
                                        <FormControl fullWidth> 
                                            <TextField id="inicial-date" label="Inicial" type="date" 
                                            size="small" InputLabelProps={{shrink: true}}
                                            onChange={(event) => setDataInicial(event.target.value)}/>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormControl fullWidth> 
                                            <TextField id="final-date" label="Final" type="date"
                                            size="small" InputLabelProps={{shrink: true}}
                                            onChange={(event) => setDataFinal(event.target.value)}/>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Box justifyContent="space-between" display="flex" alignItems="center">
                                            <FormControl size="small" variant="outlined" className={classes.formControl}> 
                                                <InputLabel id="simple-select-filled-label">Situação</InputLabel>
                                                <Select
                                                    size="small"
                                                    labelId="simple-select-filled-label"
                                                    id="simple-select-filled"
                                                    label="Situação"
                                                    value={estado}
                                                    onChange={(event) => setEstado(event.target.value)}
                                                >
                                                    <MenuItem value={''}>Selecione</MenuItem>
                                                    <MenuItem value={'a'}>Ativado</MenuItem>
                                                    <MenuItem value={'d'}>Desativado</MenuItem>
                                                </Select>
                                            </FormControl>

                                            <FormControl size="small" variant="outlined" className={classes.formControl}>
                                                <InputLabel id="simple-select-outlined-label">Tipo</InputLabel>
                                                <Select
                                                    labelId="simple-select-outlined-label"
                                                    id="simple-select-outlined"
                                                    label="Tipo"
                                                    value={tipo}
                                                    onChange={(event) => setTipo(event.target.value)}
                                                >
                                                    <MenuItem value={''}>Selecione</MenuItem>
                                                    <MenuItem value={'e'}>Evento</MenuItem>
                                                    <MenuItem value={'c'}>Campeonato</MenuItem>
                                                </Select>
                                            </FormControl>

                                            <FormControl size="small" variant="outlined" className={classes.formControl}>
                                                <TextField id="id-search" label="#Id" type="search" inputProps={{maxLength: 9}} 
                                                size="small" onChange={(event) => setEventId(event.target.value)}/>
                                            </FormControl>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={10}>
                                        <Box justifyContent="space-between" display="flex">
                                            <FormControl size="small" variant="outlined" className={classes.formControl} >
                                            <InputLabel id="simple-select-filled-label">Atuacao</InputLabel>
                                            <Select
                                                labelId="simple-select-filled-label"
                                                id="simple-select-filled"
                                                label="Atuacao"
                                                value={atuacoes}
                                                onChange={(event) => setAtuacoes(event.target.value)}
                                            >
                                                <MenuItem value={''}>Selecione</MenuItem>
                                                <MenuItem value={1}>Jogador</MenuItem>
                                                <MenuItem value={2}>Arbitro</MenuItem>
                                                <MenuItem value={3}>Técnico</MenuItem>
                                            </Select>
                                            </FormControl>

                                            <FormControl size="small" variant="outlined" className={classes.formControl}>
                                            <InputLabel id="simple-select-filled-label">Modalidade</InputLabel>
                                            <Select
                                                labelId="simple-select-filled-label"
                                                id="simple-select-filled"
                                                label="Modalidade"
                                                value={modalidades}
                                                onChange={(event) => setModalidades(event.target.value)}
                                            >
                                                <MenuItem value={''}>Selecione</MenuItem>
                                                <MenuItem value={1}>Adulto</MenuItem>
                                                <MenuItem value={2}>Paradesporto</MenuItem>
                                                <MenuItem value={3}>Juvenil</MenuItem>
                                                <MenuItem value={4}>Mirim</MenuItem>
                                                <MenuItem value={5}>Infanto-Juvenil</MenuItem>
                                                <MenuItem value={6}>Infantil</MenuItem>
                                                <MenuItem value={7}>Master</MenuItem>
                                            </Select>
                                            </FormControl>

                                            <FormControl size="small" variant="outlined" className={classes.formControl}>
                                            <InputLabel id="simple-select-filled-label">Categoria</InputLabel>
                                            <Select
                                                labelId="simple-select-filled-label"
                                                id="simple-select-filled"
                                                label="Categoria"
                                                value={categorias}
                                                onChange={(event) => setCategorias(event.target.value)}
                                            >
                                                <MenuItem value={''}>Selecione</MenuItem>
                                                <MenuItem value={1}>Feminino</MenuItem>
                                                <MenuItem value={2}>Masculino</MenuItem>
                                            </Select>
                                            </FormControl>
                                        </Box>
                                    </Grid>
                                    <Grid item >
                                        <Button variant="contained"
                                        onClick={realizarBusca}>Buscar</Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </FormControl>
                    </Grid>
                </Grid>
                <br />
                <Divider />
            </Box>
                <Stack spacing={2}>
                    <Grid container flex="1" justifyContent="center">
                        <Grid item xs={12}>
                            {pagination()}
                        </Grid>
                        <Grid item>
                            <Pagination count={count} page={page} onChange={changePage} />
                        </Grid>
                    </Grid>
                </Stack>
        </Box>
        </>
    );

    if(openParticipantes === false){
        return (
            <>
            {windowListEvents}
            </>
        )
    }else{
        return (
            <>
            {modal}
            </>
        )
    }
}