import React, { useEffect, useState } from 'react'
import { Backdrop, Tooltip, Button, Divider, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, Input, InputAdornment, InputLabel, Paper, Radio, RadioGroup, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { Box } from '@material-ui/system';
import { NumericFormat } from '../../../components/mask/maskCpf';
import SearchIcon from '@mui/icons-material/Search';
import api from '../../../config/services/api';
import { toast } from 'react-toastify';

function CriarHistorico (){

    const notifyError = () => toast.error(text, {theme: 'colored'});
    const notify = () => toast.success(text, {theme: 'colored'})
    let text = '';

    const [open, setOpen] = useState(false);
    const [evento_id, setEvento_id] = useState();
    const [descricao, setDescricao] = useState();
    const [busca, setBusca] = useState(false);
    const [inscricoes, setInscricoes] = useState([]);
    const [evento, setEvento] = useState({
        id: '',
        titulo: '', 
        tipo: '', 
        data: ''  
    })

    useEffect(() => {
        async function buscarEvento(){
            try{
                if(evento.id !== evento_id && evento_id){
                    const {data} = await api.get(`event/${evento_id}`);
                    data.tipo === 'c' ? data.tipo = 'Campeonato' : data.tipo = 'Evento'
                    const d = new Date(data.data);
                    if(data.data){
                        setEvento({...evento, data: d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear(),
                        titulo: data.titulo, tipo: data.tipo, id: evento_id})
                    }
                }else if(!evento){
                    setEvento({...evento, data: '', titulo: '', tipo: ''});
                    text = 'Insira um id válido'
                    notifyError()
                }
            }catch(err){
                setEvento({...evento, data: '', titulo: '', tipo: ''});
                text = 'Insira um id válido'
                notifyError()
            }
        }
        async function inscricoes(){
            const id = sessionStorage.getItem('id_client')
            const dt_inicial = "";
            const dt_final = "";
            const tipo = "";
            const {data} = await api.put("event_partof", {dt_inicial, dt_final, id, tipo})
            setInscricoes(data);
        }
        buscarEvento();
        inscricoes();
    }, [busca])

    function buscar(){
        busca === true ? setBusca(false) : setBusca(true);
    }

    function handleOpen(){
        setOpen(true);
    }  

    function handleClose(){
        setOpen(false);
    }

    const [position, setPosition] = useState(0);
    
    const handleId = (e) => {
        setValues({
          ...values,
          [e.target.name]: e.target.value,
        });
        // setEvento(evento.id = e.target.value)
        setEvento_id(e.target.value)
      };

    const handlePosicao = (e) => {
    setValues({
        ...values,
        [e.target.name]: e.target.value,
    });
    setPosition(e.target.value)
    };

    const [values, setValues] = useState({
    id: '',
    colocacao: ''
    });

    const [confirm, setConfirm] = useState();
    function useConfirm(){
        confirm === true ? setConfirm(false) : setConfirm(true)
    }

    function salvar(){

        async function salvarHistorico(){
            if(evento.id){
                try{
                    const event_id = evento.id;
                    const user_id = sessionStorage.getItem('id_client');
                    const colocacao = parseInt(position);
                    await api.post("historico", {event_id, user_id, colocacao, descricao})
                    text = 'Histórico adicionado com sucesso!'
                    notify()
                }catch(err){
                    text=err.response.data.error
                    notifyError();
                }
            }
            handleClose();
            setConfirm(false)
            buscar();
        }

        return(
            <>
                <Dialog
                    open={confirm}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        <b>Deseja realmente salvar?</b>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description"> 
                        <b>Após ser salvo só será possível ativar, desativar ou excluir o evento.</b>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={useConfirm}>Cancelar</Button>
                        <Button color="primary" onClick={salvarHistorico} autoFocus>
                        Salvar
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        )

    }

    const tooltipText = ("Insira aqui o id do evento para preencher o cadastro." 
    +" É necessário inserir um evento que o usuário esteja inscrito. "
    +"(Inscrições: "+inscricoes.map(i => ("#"+i.event_id+" ")))+")"

    return(
        <>
        <Button color="info" onClick={handleOpen}>Histórico</Button>
        <Backdrop
                  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                  open={open}
        >
            <Paper>
                <Box padding="30px" minWidth="800px">
                    <Grid container flex="1" justifyContent="space-between" alignItems="center">
                        <Grid item xs={8}>
                            <Typography variant="h4" paddingBottom="20px">
                                <b>Criar Histórico</b>
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Tooltip title={tooltipText} placement="top">
                                <FormControl>
                                    <TextField
                                    size="small"
                                    name="id"
                                    onChange={handleId}
                                    value={values.id}
                                    InputProps={{
                                        inputComponent: NumericFormat
                                    }}
                                    label="Id Evento"
                                    />
                                </FormControl>
                            </Tooltip>
                        </Grid>
                        <Grid>
                            <Button color="info" variant="contained" onClick={buscar}>
                                <SearchIcon /></Button>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid 
                    container
                    flex="1"
                    justifyContent="space-between"
                    paddingTop="20px"
                    >
                        <Grid item xs={8}>
                            <FormControl fullWidth>
                                <TextField size="small" disabled
                                value={`Título: ${evento.titulo}`}></TextField>
                                <br />
                            </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                            {(evento.tipo==="Campeonato")?(
                            <FormControl display="flex" fullWidth>
                                <TextField
                                
                                size="small"
                                name="colocacao"
                                onChange={handlePosicao}
                                value={values.colocacao}
                                InputProps={{
                                    inputComponent: NumericFormat,
                                    endAdornment: "°"
                                }}
                                label="Colocação"
                                />
                            </FormControl>):<></>}
                        </Grid>
                    </Grid>
                    <Grid
                    container
                    flex="1"
                    justifyContent="space-between"
                    paddingBottom="10px"
                    >
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <TextField multiline rows={4} inputProps={{ maxLength: 500 }} 
                                label="Descrição..." onChange={(event) => setDescricao(event.target.value)}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                        <br/>
                            <FormControl >
                                <TextField size="small" disabled
                                value={`Tipo: ${evento.tipo}`}></TextField>
                                <br />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                        <br/>
                            <FormControl fullWidth>
                                <TextField disabled
                                variant="outlined" size="small"
                                value={`Data do Evento: ${evento.data}`}/>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Divider/>
                    <Grid container paddingTop="20px" flex="1" justifyContent="flex-end">
                        <Grid item paddingRight="5px">
                            <Button color="primary" variant="contained" onClick={useConfirm}>Salvar</Button>
                            {salvar()}
                        </Grid>
                        <Grid item>
                            <Button color="error" variant="contained" onClick={handleClose}>Cancelar</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Backdrop>
        
        </>
    )
}

export {CriarHistorico}