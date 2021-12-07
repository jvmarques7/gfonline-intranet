import React, { useEffect, useState } from 'react'
import { Backdrop, Button, Divider, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, Input, InputAdornment, InputLabel, Paper, Radio, RadioGroup, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { Box } from '@material-ui/system';
import { NumericFormat } from '../../../components/mask/maskCpf';
import SearchIcon from '@mui/icons-material/Search';
import api from '../../../config/services/api';
import { toast } from 'react-toastify';

function EditarHistorico (){

    const notifyError = () => toast.error(text, {theme: 'colored'});
    const notify = () => toast.success(text, {theme: 'colored'})
    let text = '';

    const [open, setOpen] = useState(false);
    const [descricao, setDescricao] = useState();
    const [busca, setBusca] = useState(false);
    const [historico, setHistorico] = useState({});

    useEffect(() => {
        async function buscarHistorico(){
            try{
                const id = sessionStorage.getItem('historico_id')
                setOpen(sessionStorage.getItem('open'))
                const {data} = await api.get(`historico/${id}`)
                setHistorico(data)
            }catch(err){
                text = 'Insira um id válido'
                notifyError()
            }
        }
        buscarHistorico();
    }, [busca, open])

    // function buscar(){
    //     busca === true ? setBusca(false) : setBusca(true);
    // }

    function handleOpen(){
        setOpen(true);
    }  

    function handleClose(){
        setOpen(false);
        sessionStorage.removeItem('historico_id')
        sessionStorage.removeItem('open')
    }

    const [position, setPosition] = useState(0);

    const handlePosicao = (e) => {
    setValues({
        ...values,
        [e.target.name]: e.target.value,
    });
    setPosition(e.target.value)
    };

    const [values, setValues] = useState({
    colocacao: ''
    });

    const [confirm, setConfirm] = useState();
    function useConfirm(){
        confirm === true ? setConfirm(false) : setConfirm(true)
    }

    function salvar(){

        async function salvarHistorico(){
            if(sessionStorage.getItem('historico_id')){
                try{
                    const user_id = sessionStorage.getItem('id_client');
                    const colocacao = parseInt(position);
                    await api.put("historico", { user_id, colocacao, descricao})
                    sessionStorage.removeItem('historico_id')
                    text = 'Histórico Alterado com sucesso!'
                    notify()
                }catch(err){
                    text=err.response.data.error
                    notifyError();
                }
            }
            handleClose();
            setConfirm(false)
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

    function defineTipo(tipo){
        return (tipo === 'e') ? 'Evento' : 'Campeonato'
    }

    return(
        <>
        {/* <Button color="info" variant="contained" onClick={handleOpen}>Editar</Button> */}
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
        >
            <Paper>
                <Box padding="30px" minWidth="800px">
                    <Typography variant="h4" paddingBottom="20px">
                        <b>{`Editando Histórico...`}</b>
                    </Typography>
                    <Divider />
                    <Grid 
                    container
                    flex="1"
                    justifyContent="flex-start"
                    paddingTop="20px"
                    >
                        <Grid item xs={8} paddingRight="10px">
                            <FormControl fullWidth>
                                <TextField size="small" disabled
                                value={`Título: ${historico.titulo}`}></TextField>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                            <FormControl >
                                <TextField size="small" disabled
                                value={'Tipo:'+defineTipo(historico.tipo)}></TextField>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2}>
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
                                label={`Colocação`}
                                />
                            </FormControl>
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
                                <TextField multiline rows={4} inputProps={{ maxLength: 500 }} value={historico.descricao}
                                label="Descrição..." onChange={(event) => setDescricao(event.target.value)}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                        <br/>
                            <FormControl fullWidth>
                                <TextField disabled
                                variant="outlined" size="small"
                                value={`Data do Evento: ${historico.data_evento}`}/>
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

export {EditarHistorico}