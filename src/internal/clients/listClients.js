import React, { Fragment, useEffect, useState } from "react";
import { Accordion, Typography, Grid, FormControlLabel, FormControl, FormLabel, Divider, Button, Paper, RadioGroup, InputLabel, Select, MenuItem, Checkbox } from "@mui/material";
import { makeStyles } from '@material-ui/styles';
import api from '../../config/services/api';
import { Tittle } from './style';
import { Box } from '@mui/system';
import { TextField } from "@material-ui/core";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import EditarClient from "./editClient";
import Radio from "@mui/material/Radio";

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
    //   margin: 16
    },
  }));

export function ListClients(){

    const classes = useStyles();

    //Contrução da lista de clientes trazidos pela API
    const [nomeCompleto, setNomeCompleto] = useState("");
    const [cpf, setCpf] = useState("");
    const [rg, setRg] = useState("");
    const [situacao, setSituacao] = useState("");
    const [atuacao, setAtuacao] = useState("");
    const [categoria, setCategoria] = useState("");
    const [modalidade, setModalidade] = useState("");
    const [clientId, setClientId] = useState("");
    const [clientList, setClientList] = React.useState([]);
    const [open, setOpen] = React.useState();
    const [principal, setPrincipal] = useState()
    const [msg, setMsg] = useState();
    const [openEditar, setOpenEditar] = useState(false);
    const [federacao, setFederacao] = useState({});

    useEffect(() => {
        async function atualizarClientes() {
            if(rg !== '' || cpf !== '' || nomeCompleto !== '' || situacao !== ''
            || atuacao !== '' || modalidade !== '' || categoria !== ''){
                setMsg()   
                const { data } = await api.put('filtrar_usuario', 
                {nomeCompleto, cpf, rg, situacao, atuacao, modalidade, categoria});
                if(data.length === 0){
                    setMsg(
                        <Fragment>
                            <Box padding="50px" display="flex" justifyContent="center">
                                <Paper variant="outlined">
                                    <Box padding="20px 100px 20px 100px">
                                        <FormControl fullWidth>
                                            <Button variant="contained" display="flex" color="primary" 
                                            style={{ cursor: 'default', pointerEvents: 'none' }}>
                                                NADA A MOSTRAR POR AQUI! TENTE OUTRA BUSCA.
                                            </Button>
                                        </FormControl>
                                    </Box>
                                </Paper>
                            </Box>
                        </Fragment>
                    )
                    setClientList(data)
                }else{
                    setMsg()
                    setClientList(data);
                }
                
            }else{
                setMsg()
                const { data } = await api.get('users_completo')
                setClientList(data);    
            }
            if(openEditar === true){
                sessionStorage.setItem('id_client', clientId);
                setPrincipal(
                    <Fragment>
                        <EditarClient></EditarClient>
                    </Fragment>
                )
            }
            
        }
        atualizarClientes();
    },[nomeCompleto, cpf, rg, situacao, atuacao, modalidade, categoria, openEditar]);

    function definirAtuacao(id){
        if(id === "1"){
            return "Jogador"
        }else if(id === "2"){
            return "Árbitro"
        }else if(id === "3"){
            return "Técnico"
        }else{
            return null
        }
    }

    function abrirEditor(id){
        setOpenEditar(true)
        setClientId(id);
    }

    function controlSituacao(c){
        if(c === "s"){
            return(
                <Button variant="contained" color="success"
                style={{ cursor: 'default', pointerEvents: 'none' }}>ATIVO</Button>
            )
        }else{
            return(
            <Button variant="contained" color="warning"
            style={{ cursor: 'default', pointerEvents: 'none' }}>INATIVO</Button>
            )
        }
    }

const WindowListClient = (
    <Fragment>
    <Tittle>Clientes Cadastrados</Tittle>
        <Box paddingLeft="20px">
                <Box>
                    <Grid container flex="1" justifyContent="space-between" alignItems="center">
                        <Grid item xs={12} >
                            <FormControl fullWidth> 
                                <Paper variant="outlined" >
                                    <Grid container padding="10px 0 0 20px" flex="1" alignItems="center" justifyContent="flex-start">
                                        <Grid item width="10%">
                                            <Button padding="10px" style={{ cursor: 'default', pointerEvents: 'none' }} 
                                            startIcon={<FilterAltIcon />}>filtros</Button>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}
                                    padding="10px 20px 10px 20px" flex="1" justifyContent="space-between" >
                                        <Grid item xs={1} sm={2} md={5}>
                                            <FormControl fullWidth> 
                                                <TextField id="nome-search" label="Nome" type="search" inputProps={{maxLength: 25}} 
                                                size="small" onChange={(event) => setNomeCompleto(event.target.value)}/>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={1} sm={1} md={4}>
                                            <FormControl fullWidth> 
                                                <TextField id="cpf-search" label="CPF" type="search" inputProps={{maxLength: 14}}
                                                size="small" onChange={(event) => setCpf(event.target.value)}/>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={1} sm={1} md={3}>
                                            <FormControl fullWidth> 
                                                <TextField id="rg-search" label="RG" type="search" inputProps={{maxLength: 10}}
                                                size="small" onChange={(event) => setRg(event.target.value)}/>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        padding="10px 20px 10px 20px"
                                        container
                                        flex="1"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Grid item>
                                        <FormControl component="fieldset" fullWidth>
                                            <FormLabel component="legend" size="small">Situação</FormLabel>
                                            <RadioGroup
                                            row
                                            aria-label="gender"
                                            name="row-radio-buttons-group"
                                            onChange={(event) => setSituacao(event.target.value)}
                                            >
                                            <FormControlLabel
                                                value="s"
                                                control={<Radio size="small"/>}
                                                label="Ativo"
                                            />
                                            <FormControlLabel
                                                value="n"
                                                control={<Radio size="small"/>}
                                                label="Inativo"
                                            />
                                            <FormControlLabel
                                                value=""
                                                control={<Radio size="small"/>}
                                                label="Todos"
                                            />
                                            </RadioGroup>
                                        </FormControl>
                                        </Grid>
                                        <Grid item xs={2.5}>
                                            <FormControl fullWidth variant="outlined" size="small" className={classes.formControl}>
                                                <InputLabel id="simple-select-filled-label">Atuação
                                                </InputLabel>
                                                <Select
                                                    labelId="simple-select-filled-label"
                                                    id="simple-select-filled"
                                                    label="Atuação"
                                                    onChange={(event) => setAtuacao(event.target.value)}
                                                >
                                                    <MenuItem value={""}>Selecione</MenuItem>
                                                    <MenuItem value={"1"}>Jogador</MenuItem>
                                                    <MenuItem value={"2"}>Arbitro</MenuItem>
                                                    <MenuItem value={"3"}>Técnico</MenuItem>
                                                </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={2.5}>
                                                <FormControl fullWidth variant="outlined" size="small" className={classes.formControl}>
                                                    <InputLabel id="simple-select-filled-label">Modalidade</InputLabel>
                                                    <Select
                                                        labelId="simple-select-filled-label"
                                                        id="simple-select-filled"
                                                        label="Modalidade"
                                                        onChange={(event) => setModalidade(event.target.value)}
                                                    >
                                                        <MenuItem value={""}>Selecione</MenuItem>
                                                        <MenuItem value={"1"}>Adulto</MenuItem>
                                                        <MenuItem value={"2"}>Paradesporto</MenuItem>
                                                        <MenuItem value={"3"}>Juvenil</MenuItem>
                                                        <MenuItem value={"4"}>Mirim</MenuItem>
                                                        <MenuItem value={"5"}>Infanto-Juvenil</MenuItem>
                                                        <MenuItem value={"6"}>Infantil</MenuItem>
                                                        <MenuItem value={"7"}>Master</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={2.5}>
                                                <FormControl fullWidth variant="outlined" size="small" className={classes.formControl}>
                                                    <InputLabel id="simple-select-filled-label">Categoria</InputLabel>
                                                    <Select
                                                        labelId="simple-select-filled-label"
                                                        id="simple-select-filled"
                                                        label="Categoria"
                                                        onChange={(event) => setCategoria(event.target.value)}
                                                    >
                                                        <MenuItem value={""}>Selecione</MenuItem>
                                                        <MenuItem value={"1"}>Feminino</MenuItem>
                                                        <MenuItem value={"2"}>Masculino</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                </Paper>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
        <br />
        {msg}
        </Box>
            {clientList.map(c =>(
            <Box key={c.users_id} paddingLeft="20px">
                <Accordion variant="outlined">
                    <Box padding="10px" sx={{ flexGrow: 1 }}>
                        <Grid container padding="15px 20px 10px 10px" flex="1" justifyContent="space-between">
                            <Grid item xs={6}>
                                <Typography sx={{fontSize: "18px"}}><b>Nome:</b> {c.users_nomeCompleto}</Typography>
                            </Grid>
                            <Grid item xs={2.5}>
                                <Typography><b>CPF:</b> {c.users_cpf}</Typography>
                            </Grid>
                            <Grid item xs={1.5}>
                                <Typography><b>RG:</b> {c.users_rg}</Typography>
                            </Grid>
                            <Grid item display="flex" xs={1}>
                                {controlSituacao(c.federacao_is_ativo)}
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}
                        padding="15px 20px 10px 10px" flex="1" justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Typography sx={{fontSize: "12px"}}><b>{definirAtuacao(c.users_atuacao_id)}: #{c.users_id}</b></Typography>
                            </Grid>
                            <Grid item>
                                <Button color="primary" variant="contained" value={c.users_id} 
                                onClick={(event) => abrirEditor(event.target.value)}>Editar</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Accordion>
                <br />
            </Box>)
            )}
    </Fragment>
)

if(openEditar === false){
    return (
        <>
        {WindowListClient}
        </>
    )
}else{
    return (
        <>
        {principal}
        </>
    )
}

}
