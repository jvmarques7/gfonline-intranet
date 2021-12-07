import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Box, FormControl, ClickAwayListener, InputLabel, MenuItem, Select, TextField, Button, Backdrop, IconButton, Menu, Divider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Accordion } from '@material-ui/core';
import { Seccion, Tittle } from './style';
import { useHistory, useParams } from 'react-router-dom';
import api from '../../config/services/api';
import cep from 'cep-promise';
import { CpfFormatCustom, PhoneFormatNumber, TelFormatNumber, NumericFormat } from '../../components/mask/maskCpf';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Moment from 'react-moment';
import { Typography } from '@mui/material';
import validator from 'validator'
import { CriarHistorico } from './historico/criar';
import { EditarHistorico } from './historico/editar';
import CheckIcon from '@mui/icons-material/Check';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

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


export default function EditarClient() {

  const notify = () => toast.error(textError, {theme: 'colored'});
  let textError = '';

  const notifySuccess = () => toast.success(text, {theme: 'colored'});
  let text = '';

  const [nomeCompleto, setNomeCompleto] = useState();
  const [rg, setRg] = useState();
  const [cpf, setCpf] = useState();
  const [nacionalidade, setNacionalidade] = useState();
  const [dt_nascimento, setDt_Nascimento] = useState();
  const [sexo, setSexo] = useState();
  const [naturalidade, setNaturalidade] = useState();
  const [clube, setClube] = useState();
  const [telefone, setTelefone] = useState();
  const [celular, setCelular] = useState();
  const [passaporte, setPassaporte] = useState();
  const [email, setEmail] = useState();
  const [zipCode, setZipCode] = useState("");
  const [adress, setAdress] = useState({});
  const [logradouro, setLogradouro] = useState();
  const [bairro, setBairro] = useState();
  const [cidade, setCidade] = useState();
  const [estado, setEstado] = useState();
  const [numero, setNumero] = useState();
  const [complemento, setComplemento] = useState();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [federacao, setFederacao] = useState({});
  const [reload, setReload] = useState(false)

  const [openEditarEvento, setOpenEditarEvento] = useState();
  const [openEditarCampeonato, setOpenEditarCampeonato] = useState();
  const [historico, setHistorico] = useState({});
  const [descricao, setDescricao] = useState();

  const [position, setPosition] = useState(0);

  const [confirmExcluirEvento, setConfirmExcluirEvento] = useState(false);
  const [confirmExcluirCampeonato, setConfirmExcluirCampeonato] = useState(false);

  const [eventos, setEventos] = useState([]);
  const [campeonatos, setCampeonatos] = useState([]);
  
  const [atuacao_id, setAtuacao] = useState('');
  const handleAtuacao = (event) => {
  setAtuacao(event.target.value);
  };
  
  const [modalidade_id, setModalidade] = useState('');
  const handleModalidade = (event) => {
  setModalidade(event.target.value);
  };
  
  const [categoria_id, setCategoria] = React.useState('');
  const handleCategoria = (event) => {
  setCategoria(event.target.value);
  };

  // const [userById, setUserById] = useState();
  const [enderecoById, setEnderecoById] = useState();

  // useState -> Masks
  const [values, setValues] = useState({
    cpf: '',
    telefone: '',
    celular: '',
    // colocacao: ''
  });

  const handleCpf = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
    setCpf(e.target.value)
  };
  const handleTel = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
    setTelefone(e.target.value)
  };
  const handleCel = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
    setCelular(e.target.value)
  };

  useEffect(()=>{
    async function buscarCadastro(){
      const { data } = await api.get(`edit_user/${sessionStorage.getItem('id_client')}`);
      setNomeCompleto(data.nomeCompleto);
      setRg(data.rg);
      setNacionalidade(data.nacionalidade)
      setDt_Nascimento(data.dt_nascimento)
      setSexo(data.sexo)
      setNaturalidade(data.naturalidade)
      setClube(data.clube)
      setPassaporte(data.passaporte)
      setEmail(data.email)
      setAtuacao(data.atuacao_id)
      setModalidade(data.modalidade_id)
      setCategoria(data.categoria_id)
      setValues({...values, 
        cpf: data.cpf,
        telefone: data.telefone,
        celular: data.celular})
    }
    async function buscarEndereco(){
      const { data } = await api.get(`endereco/${sessionStorage.getItem('id_client')}`);
      setEnderecoById(data)
      setZipCode(data.cep)
      setNumero(data.numero)
      setComplemento(data.complemento)
    }
    async function verifyFederation(){
      const { data } = await api.get(`federacao/${sessionStorage.getItem('id_client')}`)
      if(data){
          const is_ativo = data.is_ativo;
          const is_federado = data.is_federado
          const user_id = data.user_id
          setFederacao( { is_ativo, is_federado, user_id } );
      }else{
          setFederacao()
      }
    }
    async function buscarEventos(){
      const user_id = sessionStorage.getItem('id_client');
      const { data } = await api.put('historico_list', {tipo: 'e', user_id})
      setEventos(data) 
    }
    async function buscarCampeonatos(){
      const user_id = sessionStorage.getItem('id_client');
      const { data } = await api.put('historico_list', {tipo: 'c', user_id})
      setCampeonatos(data) 
    }
    buscarCadastro()
    buscarEndereco()
    verifyFederation()
    buscarEventos()
    buscarCampeonatos()
  }, [reload])
  

  const [validObject, setValidObject] = useState();
  const id = sessionStorage.getItem('id_client')
  
  let history = useHistory();

  const [show, setShow] = useState(false);

  async function handleCadastro(){

    setValidObject({
      id,
      cpf,
      rg,
      email,
      name: nomeCompleto,
      dt_nascimento,
      naturalidade,
      clube,
      sexo,
      telefone,
      celular,
      passaporte,
      nacionalidade,
      atuacao_id,
      modalidade_id,
      categoria_id,
      cep : zipCode,
      logradouro: adress.street,
      complemento,
      bairro: adress.neighborhood,
      numero,
      cidade: adress.city,
      estado: adress.state,
      user_id: id
    })

    if(await validate()){
      console.log(await validate())
      try{
        await api.put('completar_cadastro', {
          id,
          cpf,
          rg,
          email,
          name: nomeCompleto,
          dt_nascimento,
          naturalidade,
          clube,
          sexo,
          telefone,
          celular,
          passaporte,
          nacionalidade,
          atuacao_id,
          modalidade_id,
          categoria_id,
          cep : zipCode,
          logradouro: adress.street,
          complemento,
          bairro: adress.neighborhood,
          numero,
          cidade: adress.city,
          estado: adress.state,
          user_id: id
        });
        text = 'Cadastro atualizado com sucesso'
        notifySuccess();
      }catch(err){
        textError = err
        notify();
      }
    }else{
      const uniqueCpf = await api.get(`find_cpf/${cpf}`);
      const uniqueRg = await api.get(`find_rg/${rg}`);
      const uniqueEmail = await api.get(`find_email/${email}`);
      if(cpf === "" || cpf.length < 14){
        textError = 'Campo CPF é obrigatório!'
        notify();
      }if(uniqueCpf.data.cpf && uniqueCpf.data.id !== id){
        textError = 'CPF já está cadastrado!'
        notify();
      }
      if(rg === ""){
        textError = 'Campo RG é obrigatório!'
        notify();
      }if(uniqueRg.data.rg && uniqueRg.data.id !== id){
        textError = 'RG já está cadastrado!'
        notify();
      }if(email === ""){
        textError = 'Campo Email é obrigatório!'
        notify();
      }if(uniqueEmail.data.email && uniqueEmail.data.id !== id){
        textError = 'Email já está cadastrado!'
        notify();
      }if(!validator.isEmail(email)){
        textError = 'Insira um Email Válido'
        notify();
      }
      if(nomeCompleto === ""){
        textError = 'Campo Nome Completo é obrigatório!'
        notify();
      }if(dt_nascimento === ""){
        textError = 'Campo Data de nascimento é obrigatório!'
        notify();
      }if(sexo === ""){
        textError = 'Campo Sexo é obrigatório!'
        notify();
      }if(celular === ""){
        textError = 'Campo Celular é obrigatório!'
        notify();
      }if(nacionalidade === ""){
        textError = 'Campo RG obrigatório!'
        notify();
      }if(atuacao_id === ""){
        textError = 'A Atuação é obrigatória!'
        notify();
      }if(modalidade_id === ""){
        textError = 'A Modalidade é obrigatória!'
        notify();
      }if(categoria_id === ""){
        textError = 'A Categoria é obrigatória!'
        notify();
      }if(zipCode === "" || zipCode.length !== 8){
        textError = 'Campo CEP é obrigatório!'
        notify();
      }if(adress.street === ""){
        textError = 'Campo Logradouro é obrigatório!'
        notify();
      }if(adress.neighborhood === ""){
        textError = 'Campo Bairro é obrigatório!'
        notify();
      }if(adress.city === ""){
        textError = 'Campo Cidade é obrigatório!'
        notify();
      }if(adress.state === ""){
        textError = 'Campo Estado é obrigatório!'
        notify();
      }
    }
            
}

async function handleBack(){
    window.location.reload()
}

async function validate(){
    const uniqueCpf = await api.get(`find_cpf/${cpf}`);
    const uniqueRg = await api.get(`find_rg/${rg}`);
    const uniqueEmail = await api.get(`find_email/${email}`);
    if(cpf === "" || cpf.length < 14){
      return false;
    }if(uniqueCpf.data.cpf && uniqueCpf.data.id !== id){
      return false;
    }
    if(rg === ""){
      return false;
    }if(uniqueRg.data.rg && uniqueRg.data.id !== id){
      return false;
    }if(email === ""){
      return false;
    }if(uniqueEmail.data.email && uniqueEmail.data.id !== id){
      return false;
    }if(nomeCompleto === ""){
      return false;
    }if(dt_nascimento === ""){
      return false;
    }if(sexo === ""){
      return false;
    }if(celular === ""){
      return false;
    }if(nacionalidade === ""){
      return false;
    }if(atuacao_id === ""){
      return false;
    }if(modalidade_id === ""){
      return false;
    }if(categoria_id === ""){
      return false;
    }if(zipCode === "" || zipCode.length !== 8){
      return false;
    }if(adress.street === ""){
      return false;
    }if(adress.neighborhood === ""){
      return false;
    }if(adress.city === ""){
      return false;
    }if(adress.state === ""){
      return false;
    }if(adress.street === ""){
      return false;
    }
    console.log('true')
    return true;
}

  const classes = useStyles();

  useEffect(() => {
    async function getAddressData(){
      try{
        if(zipCode.length >= 8 ){
          const response = await cep(zipCode);
          setAdress(response);
          setShow(true)
        }else{
          setShow(false)
        }
      }catch(err){
      }
    }
    
    getAddressData();
  }, [zipCode])

  function BasicMenu(){
    const [anchorEl, setAnchorEl] = React.useState(null);
        const openMenu = Boolean(anchorEl);
        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
        };
        const handleClose = () => {
            setAnchorEl(null);
        };
        
        return (
            <div>
            <Button
                variant="contained"
                color="info"
                id="basic-button"
                aria-controls="basic-menu"
                aria-haspopup="true"
                aria-expanded={openMenu ? 'true' : undefined}
                onClick={handleClick}
                endIcon={<ManageAccountsIcon />}
                // endIcon={<ArrowDropDownIcon />}
            >
                Mais Opções
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
                elevation={2}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem>
                  <CriarHistorico/>
                </MenuItem>
                <MenuItem>
                  <Button color="info" onClick={handleToggle}>
                      Federação
                  </Button>
                </MenuItem>
            </Menu>
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={open}
              onClick={handleClose}
            >
              <Federacao/>
            </Backdrop>
            </div>
        );
  }

  const handleClose = () => {
    setOpenEditarCampeonato(false)
    setOpenEditarEvento(false)
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };
  // const handleOpen = (historico_id) => {
  //   setOpen(!open);
  //   sessionStorage.setItem('historico_id', historico_id)
  // };

  async function controlFederation(){
        setConfirm(true)
  }

  async function confirmCreate(){
    await api.post(`federacao/${sessionStorage.getItem('id_client')}`);
    setConfirm(false)
    setOpen(false)
    setReload(!reload)
    text = 'Federação realizada com sucesso!'
    notifySuccess();
}

    async function confirmAtivacao(){
        const {data} = await api.put(`federacao/${sessionStorage.getItem('id_client')}`);
        setConfirm(false)
        setOpen(false)
        setReload(!reload)
        if(data.is_ativo === 's'){
          text = 'Ativação realizada com sucesso!'
        }else{
          text = 'Inativação realizada com sucesso!'
        }
        notifySuccess();
    }


    // function handleOpen(id){
    //   sessionStorage.setItem('historico_id', id);
    //   sessionStorage.setItem('open', true);
    //   setOpenEditar(sessionStorage.getItem('open'))
    //   setReload(!reload)
    // }

    function closeConfirm(){
      setConfirmSalvarEvento(false)
      setConfirmSalvarCampeonato(false)
      setConfirmExcluirEvento(false)
      setConfirmExcluirCampeonato(false)
      setConfirm(false)
    }

  function Federacao(){

        if(!federacao){
            return(
                <Paper className={classes.paper}>
                    <Box padding="20px" width="400px">
                        <Typography variant="h6"><b>FEDERAÇÃO</b></Typography>
                        <Typography paddingBottom="10px">Situação</Typography>
                        <Button variant="contained" color="error"
                        style={{ cursor: 'default', pointerEvents: 'none' }}>NÃO FEDERADO</Button>
                        <Typography paddingTop="10px" paddingBottom="10px">Este cliente não iniciou o processo de federação.</Typography>
                        <Typography paddingTop="10px" paddingBottom="10px">Deseja iniciar o processo?</Typography>
                        <Divider />
                        <br />
                        <Grid container flex="1" justifyContent="space-between">
                            <Button variant="contained" color="primary"
                            onClick={controlFederation}>Realizar Federação</Button>
                                <Dialog
                                    open={confirm}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                    >
                                    <DialogTitle id="alert-dialog-title">
                                    <b>Confirmar Federação</b>
                                    </DialogTitle>
                                    <DialogContent>
                                    <DialogContentText id="alert-dialog-description"> 
                                    <b>Deseja iniciar o processo de federação deste usuário?</b>
                                    </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                    <Button color="primary" onClick={closeConfirm}>Cancelar</Button>
                                    <Button color="primary" onClick={confirmCreate}>Confirmar</Button>
                                    </DialogActions>
                                </Dialog>
                            <Button variant="contained" color="warning"
                            onClick={handleClose}>Voltar</Button>
                        </Grid>
                    </Box>
                </Paper>
            );
        }else if(federacao.is_ativo === "n"){
            return(
                <Paper className={classes.paper}>
                    <Box padding="20px" width="400px">
                        <Grid container flex="1" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h6"><b>FEDERAÇÃO</b></Typography>
                            </Grid>
                            <Grid item>
                            <IconButton color="inherit" onClick={handleClose} component="span">
                                <CancelIcon/>
                            </IconButton>
                            </Grid>
                        </Grid>
                        <Typography paddingBottom="10px">Situação</Typography>
                        <Button variant="contained" color="warning"
                        style={{ cursor: 'default', pointerEvents: 'none' }}>NÃO ATIVO</Button>
                        <Typography paddingTop="10px" paddingBottom="10px">
                            Federação não ativa.</Typography>
                        <Typography paddingBottom="10px">
                            Essa ativação só deve ser feita com comprovação de regularidade da Federação.
                        </Typography>
                        <Divider />
                        <br />
                        <Grid container flex="1" justifyContent="space-between">
                            <Button variant="contained" color="primary"
                            onClick={controlFederation}>Ativar Federação</Button>
                                <Dialog
                                    open={confirm}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                    >
                                    <DialogTitle id="alert-dialog-title">
                                    <b>Confirmar Ativação da Federação</b>
                                    </DialogTitle>
                                    <DialogContent>
                                    <DialogContentText id="alert-dialog-description"> 
                                    <b>Esta ação irá ativar a federação do usuário. Deseja continuar?</b>
                                    </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                    <Button color="primary" onClick={closeConfirm}>Cancelar</Button>
                                    <Button color="primary" onClick={confirmAtivacao}>Ativar</Button>
                                    </DialogActions>
                                </Dialog>
                            <Button variant="contained" color="warning"
                            onClick={handleClose}>Voltar</Button>
                        </Grid>
                    </Box>
                </Paper>
            );
        }else{
            return(
                <Paper className={classes.paper}>
                    <Box padding="20px" width="200px">
                        <Grid container flex="1" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h6"><b>FEDERAÇÃO</b></Typography>
                            </Grid>
                            <Grid item>
                            <IconButton color="inherit" onClick={handleClose} component="span">
                                <CancelIcon/>
                            </IconButton>
                            </Grid>
                        </Grid>
                        <Grid container flex="1" justifyContent="center">
                          <Grid item>
                            <Typography paddingBottom="10px">Situação</Typography>
                                <Button variant="contained" color="success"
                                style={{ cursor: 'default', pointerEvents: 'none' }}>ATIVO</Button>
                            <Typography paddingTop="10px" paddingBottom="10px">Federação está ativa.</Typography>
                          </Grid>
                          <Grid item>
                              <Button variant="contained" color="warning"
                              onClick={controlFederation}>Inativar</Button>
                              <Dialog
                                    open={confirm}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                    >
                                    <DialogTitle id="alert-dialog-title">
                                    <b>Confirmar a desativação da Federação</b>
                                    </DialogTitle>
                                    <DialogContent>
                                    <DialogContentText id="alert-dialog-description"> 
                                    <b>Esta ação não pode ser desfeita. Deseja continuar?</b>
                                    </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                    <Button color="primary" onClick={closeConfirm}>Cancelar</Button>
                                    <Button color="primary" onClick={confirmAtivacao} autoFocus>
                                        Confirmar
                                    </Button>
                                    </DialogActions>
                                </Dialog>
                          </Grid>
                        </Grid>
                    </Box>
                </Paper>
            );
        }
  }
  
  function dataFormatada(dt){
    var data = new Date(dt),
      dia  = data.getDate().toString(),
      diaF = (dia.length == 1) ? '0'+dia : dia,
      mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length == 1) ? '0'+mes : mes,
      anoF = data.getFullYear();
      return (diaF+"/"+mesF+"/"+anoF)
  }

  function defineTipo(tipo){
    return (tipo === 'e') ? 'Evento' : 'Campeonato'
  }

  

  // const handlePosicao = (e) => {
  // setValues({
  //     ...values,
  //     [e.target.name]: e.target.value,
  // });
  // setPosition(e.target.value)
  // };

  const [confirmSalvarCampeonato, setConfirmSalvarCampeonato] = useState(false);
  const [confirmSalvarEvento, setConfirmSalvarEvento] = useState(false);
  function confirmHistoricoEvento(){
    confirmSalvarEvento === true ? setConfirmSalvarEvento(false) : setConfirmSalvarEvento(true)
  }
  function confirmHistoricoCampeonato(){
    confirmSalvarCampeonato === true ? setConfirmSalvarCampeonato(false) : setConfirmSalvarCampeonato(true)
  }

  function salvarCampeonato(){

    async function salvarHistorico(){
        if(historico.id){
            try{
                const id = historico.id;
                var colocacao = '0';
                if(position!==''){
                  colocacao = parseInt(position)
                }else{
                  colocacao = parseInt(colocacao)
                }
                await api.put("historico", { id, colocacao, descricao})
                setReload(!reload)
                text = 'Histórico Alterado com sucesso!'
                notifySuccess()
            }catch(err){
                throw new Error(err)
            }
        }
        setConfirmSalvarCampeonato(false)
        handleClose();
    }

    return(
        <>
            <Dialog
                open={confirmSalvarCampeonato}
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
                    <Button color="primary" onClick={closeConfirm}>Cancelar</Button>
                    <Button color="primary" onClick={salvarHistorico} autoFocus>
                    Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )

}

function salvarEvento(){

  async function salvarHistorico(){
      if(historico.id){
          try{
              var colocacao = '0';
              if(position!==''){
                colocacao = parseInt(position)
              }else{
                colocacao = parseInt(colocacao)
              }
              await api.put("historico", { id, colocacao, descricao})
              setReload(!reload)
              text = 'Histórico Alterado com sucesso!'
              notifySuccess()
          }catch(err){
              throw new Error(err)
          }
      }
      setConfirmSalvarEvento(false)
      handleClose();
  }

  return(
      <>
          <Dialog
              open={confirmSalvarEvento}
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
                  <Button color="primary" onClick={closeConfirm}>Cancelar</Button>
                  <Button color="primary" onClick={salvarHistorico} autoFocus>
                  Salvar
                  </Button>
              </DialogActions>
          </Dialog>
      </>
  )

}

  async function handleOpen(id){
    if(id){
      const {data} = await api.get(`historico/${id}`)
      setHistorico(data)
      setDescricao(data.descricao)
      setPosition(data.colocacao)
      if(data.tipo==='c'){
        setOpenEditarCampeonato(true)
      }else if(data.tipo==='e'){
        setOpenEditarEvento(true)
      }
    }
    
  }

  async function handleExcluir(id){
    if(id){
      const {data} = await api.get(`historico/${id}`)
      setHistorico(data)
      if(data.tipo==='c'){
        setConfirmExcluirCampeonato(true)
      }else if(data.tipo==='e'){
        setConfirmExcluirEvento(true)
      }
    }
    
  }

  function excluirEvento(){
    async function excluirHistorico(){
      console.log(historico.id)
      if(historico.id){
          try{
              const historico_id = historico.id 
              await api.delete(`historico/${historico_id}`)
              setReload(!reload)
              text = 'Histórico deletado!'
              notifySuccess()
          }catch(err){
            text = 'Erro'
            notify()
          }
      }
      handleClose();
      setConfirmExcluirEvento(false)
    }

    return(
      <>
          <Dialog
              open={confirmExcluirEvento}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
          >
              <DialogTitle id="alert-dialog-title">
                  <b>Deseja realmente excluir permanentemente esse histórico?</b>
              </DialogTitle>
              <DialogContent>
                  <DialogContentText id="alert-dialog-description"> 
                  <b>Após excluído não é possível recuperar esse histórico.</b>
                  </DialogContentText>
              </DialogContent>
              <DialogActions>
                  <Button color="primary" onClick={closeConfirm}>Cancelar</Button>
                  <Button color="error" onClick={excluirHistorico} autoFocus>
                  Excluir
                  </Button>
              </DialogActions>
          </Dialog>
      </>
    )
  }

  function excluirCampeonato(){
    async function excluirHistorico(){
      console.log(historico.id)
      if(historico.id){
          try{
              const historico_id = historico.id 
              await api.delete(`historico/${historico_id}`)
              setReload(!reload)
              text = 'Histórico deletado!'
              notifySuccess()
          }catch(err){
            text = 'Erro'
            notify()
          }
      }
      handleClose();
      setConfirmExcluirCampeonato(false)
    }

    return(
      <>
          <Dialog
              open={confirmExcluirCampeonato}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
          >
              <DialogTitle id="alert-dialog-title">
                  <b>Deseja realmente excluir permanentemente esse histórico?</b>
              </DialogTitle>
              <DialogContent>
                  <DialogContentText id="alert-dialog-description"> 
                  <b>Após excluído não é possível recuperar esse histórico.</b>
                  </DialogContentText>
              </DialogContent>
              <DialogActions>
                  <Button color="primary" onClick={closeConfirm}>Cancelar</Button>
                  <Button color="error" onClick={excluirHistorico} autoFocus>
                  Excluir
                  </Button>
              </DialogActions>
          </Dialog>
      </>
    )
  }
  

  return (
    <Box padding="20px">
      <Box justifyContent="space-between" display="flex">
        <Tittle>Editando CPF: {cpf}</Tittle>
        <Box margin="20px">
          <Grid container  display="flex" justifyContent="flex-end">
            <Grid item paddingRight="10px">
              <BasicMenu/>
            </Grid>
            <Grid item paddingRight="10px">
              <Button color="success" variant="contained" onClick={handleCadastro}>
                <CheckIcon />
              </Button>
            </Grid>
            <Grid item>
              <Button color="warning" variant="contained" onClick={handleBack}>
                <KeyboardReturnIcon/>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      
      {/* Atuacao */}
      <Seccion>Atuação</Seccion>
      <Box justifyContent="space-between" display="flex" padding="7px 9px 9px 9px">
        <FormControl variant="outlined" size="small" className={classes.formControl} >
          <InputLabel id="simple-select-filled-label">Atuação*
          </InputLabel>
          <Select
            labelId="simple-select-filled-label"
            id="simple-select-filled"
            label="Atuação*"
            value={atuacao_id}
            onChange={handleAtuacao}
          >
            <MenuItem value={1}>Jogador</MenuItem>
            <MenuItem value={2}>Arbitro</MenuItem>
            <MenuItem value={3}>Técnico</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small" className={classes.formControl}>
          <InputLabel id="simple-select-filled-label">Modalidade*</InputLabel>
          <Select
            labelId="simple-select-filled-label"
            id="simple-select-filled"
            label="Modalidade*"
            value={modalidade_id}
            onChange={handleModalidade}
          >
            <MenuItem value={1}>Adulto</MenuItem>
            <MenuItem value={2}>Paradesporto</MenuItem>
            <MenuItem value={3}>Juvenil</MenuItem>
            <MenuItem value={4}>Mirim</MenuItem>
            <MenuItem value={5}>Infanto-Juvenil</MenuItem>
            <MenuItem value={6}>Infantil</MenuItem>
            <MenuItem value={7}>Master</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small" className={classes.formControl}>
          <InputLabel id="simple-select-filled-label">Categoria*</InputLabel>
          <Select
            labelId="simple-select-filled-label"
            id="simple-select-filled"
            label="Categoria*"
            value={categoria_id}
            onChange={handleCategoria}
          >
            <MenuItem value={1}>Feminino</MenuItem>
            <MenuItem value={2}>Masculino</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Dados Pessoais */}
      <Seccion>Dados Pessoais</Seccion>
      <Grid container paddingBottom="20px" spacing={0}>
        <Grid item xs={10}>
          <Paper className={classes.paper}>
            <FormControl fullWidth> 
                <TextField id="nomeCompleto" value={nomeCompleto} label="Nome Completo*" variant="outlined" onChange={e => setNomeCompleto(e.target.value)}
                inputProps={{maxLength: 80}} InputLabelProps={{shrink: true}}/>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={2}>
          <Paper className={classes.paper}>
            <FormControl fullWidth> 
                <TextField id="sexo" value={sexo} label="Sexo*" variant="outlined" onChange={e => setSexo(e.target.value)}
                inputProps={{maxLength: 12}} InputLabelProps={{shrink: true}}/>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper className={classes.paper}>
            <FormControl fullWidth> 
              <TextField
                label="Data de Nascimento*"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value= {dt_nascimento}
                onChange={e => setDt_Nascimento(e.target.value)}
              >
              </TextField>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper className={classes.paper}>
            <FormControl fullWidth> 
                <TextField id="naturalidade" value={naturalidade} label="Naturalidade" variant="outlined" onChange={e => setNaturalidade(e.target.value)}
                inputProps={{maxLength: 15}} InputLabelProps={{shrink: true}}/>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={5}>
          <Paper className={classes.paper}>
            <FormControl fullWidth> 
                <TextField id="clube" value={clube} label="Clube" variant="outlined" onChange={e => setClube(e.target.value)}
                inputProps={{maxLength: 25}} InputLabelProps={{shrink: true}}/>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper className={classes.paper}>
            <FormControl fullWidth> 
                <TextField id="telefone" defaultValue={values.telefone} label="Telefone" variant="outlined" onChange={handleTel}
                  value={values.telefone}
                  name="telefone"
                  InputProps={{
                    inputComponent: TelFormatNumber,
                  }}
                  InputLabelProps={{shrink: true}}
                />
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper className={classes.paper}>
            <FormControl fullWidth> 
                <TextField id="celular" label="Celular*" variant="outlined" onChange={handleCel}
                  value={values.celular}
                  name="celular"
                  InputProps={{
                    inputComponent: PhoneFormatNumber,
                  }}
                  InputLabelProps={{shrink: true}}
                />
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper className={classes.paper}>
            <FormControl fullWidth> 
                <TextField id="email" label="Email*" value={email} onChange={e => setEmail(e.target.value)}
                inputProps={{maxLength: 35}} InputLabelProps={{shrink: true}}/>
            </FormControl>
          </Paper>
        </Grid>
      </Grid>          
        {/* Documentos */}
        <Seccion>Documentos</Seccion>
        <Grid container paddingBottom="20px" spacing={0}>
        <Grid item xs={12} sm={3}>
          <Paper className={classes.paper}>
            <FormControl fullWidth> 
                <TextField id="cpf" label="CPF*" variant="outlined" onChange={handleCpf}
                  value={values.cpf}
                  name="cpf"
                  InputProps={{
                    inputComponent: CpfFormatCustom,
                  }}
                  InputLabelProps={{shrink: true}}
                />
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper className={classes.paper}>
            <FormControl fullWidth> 
                <TextField id="passaporte" label="Passaporte" variant="outlined" onChange={e => setPassaporte(e.target.value)}
                inputProps={{maxLength: 11}} InputLabelProps={{shrink: true}}/>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper className={classes.paper}>
            <FormControl fullWidth> 
                <TextField id="rg" value={rg} label="RG*" variant="outlined" onChange={e => setRg(e.target.value)}
                inputProps={{maxLength: 9}} InputLabelProps={{shrink: true}}/>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper className={classes.paper}>
            <FormControl fullWidth> 
                <TextField id="nacionalidade" value={nacionalidade} label="Nacionalidade*" variant="outlined" onChange={e => setNacionalidade(e.target.value)}
                inputProps={{maxLength: 25}} InputLabelProps={{shrink: true}}/>
            </FormControl>
          </Paper>
        </Grid>
        </Grid>

        {/* Endereço */}
        <Seccion>Endereço</Seccion>
        <Grid container paddingBottom="20px" spacing={0}>
          <Grid item xs={2}>
            <Paper className={classes.paper}>
              <FormControl fullWidth> 
                  <TextField id="cep" label="CEP*" value={zipCode} variant="outlined" 
                  onChange={(e) => {setZipCode(e.target.value)}}
                  inputProps={{maxLength: 8, inputMode: 'numeric', pattern: '[0-9]*' }}/>
              </FormControl>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <FormControl fullWidth> 
                  <TextField id="logradouro" label="Logradouro*" variant="outlined" 
                    InputLabelProps={show ? {shrink: true} : {shrink: false}} value={show ? (adress.street) : ''} 
                    onChange={e => setLogradouro(e.target.value)}
                    inputProps={{maxLength: 35}}
                  />
              </FormControl>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <FormControl fullWidth> 
                  <TextField id="bairro" label="Bairro*" variant="outlined"
                    InputLabelProps={show ? {shrink: true} : {shrink: false}} value={show ? (adress.neighborhood) : ''} 
                    onChange={e => setBairro(e.target.value)}
                    inputProps={{maxLength: 25}}
                  />
              </FormControl>
            </Paper>
          </Grid>
          <Grid item xs={5}>
            <Paper className={classes.paper}>
              <FormControl fullWidth> 
                  <TextField id="complemento" label="Complemento" variant="outlined"
                    value={show ? (complemento) : ''} 
                    onChange={e => setComplemento(e.target.value)}
                    inputProps={{maxLength: 70}}
                  />
              </FormControl>
            </Paper>
          </Grid>
          <Grid item xs={2}>
            <Paper className={classes.paper}>
              <FormControl fullWidth> 
                  <TextField id="numero" label="Número" variant="outlined"
                    value={show ? (numero) : ''}
                    onChange={e => setNumero(e.target.value)}
                    inputProps={{maxLength: 4}}
                  />
              </FormControl>
            </Paper>
          </Grid>
          <Grid item xs={2}>
            <Paper className={classes.paper}>
              <FormControl fullWidth> 
                  <TextField id="estado" label="Estado*" variant="outlined"
                    InputLabelProps={show ? {shrink: true} : {shrink: false}} value={show ? (adress.state) : ''}
                    onChange={e => setEstado(e.target.value)}
                    inputProps={{maxLength: 2}}
                  />
              </FormControl>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.paper}>
              <FormControl fullWidth> 
                  <TextField id="cidade" label="Cidade*" variant="outlined"
                    InputLabelProps={show ? {shrink: true} : {shrink: false}} value={show ? (adress.city) : ''} 
                    onChange={e => setCidade(e.target.value)}
                    inputProps={{maxLength: 20}}
                  />
              </FormControl>
            </Paper>
          </Grid>
        </Grid>

        {/* -----> Histórico <------ */}
        <Tittle>Histórico</Tittle>
        <Grid container rowSpacing={1.5} columnSpacing={2}>
            <Grid item xs={12}>
              <Seccion>Campeonatos</Seccion>
              {campeonatos.map(c=>(
                  <Box key={c.id} padding="10px">
                  <Accordion variant="outlined" >
                      <Box padding="10px" sx={{ flexGrow: 1 }}>
                          <Grid container padding="15px 20px 10px 10px" flex="1" justifyContent="space-between" alignItems="center">
                              <Grid item xs={6}>
                                  <Typography sx={{fontSize: "18px"}}><b>Título:</b> {c.titulo}</Typography>
                              </Grid>
                              <Grid item>
                                  <Typography><b>{c.colocacao}° Lugar</b></Typography>
                              </Grid> 
                              <Grid item>
                                  <Typography><b>Data:</b> {dataFormatada(c.data_evento)}</Typography>
                              </Grid>                             
                          </Grid>
                          <Divider />
                          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}
                          padding="15px 20px 10px 10px" flex="1" justifyContent="space-between" alignItems="end">
                              <Grid item md={8}>
                                <Box>
                                  <Grid container flex="1" justifyContent="flex-start" alignItems="start">
                                    <Grid item md={2}>
                                      <Typography sx={{fontSize: "18px"}}><b>Descricao:</b></Typography>
                                    </Grid>
                                    <Grid item md={10} paddingLeft="5px">
                                      <Typography sx={{fontSize: "18px"}}>{c.descricao}</Typography>
                                    </Grid>
                                  </Grid>
                                </Box>
                              </Grid>
                              <Grid item>
                                <Button color="info" value={c.id} variant="contained" size="small"
                                onClick={(event) => handleOpen(event.target.value)}
                                >Editar</Button>{' '}
<Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={openEditarCampeonato}
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
            justifyContent="space-between"
            paddingTop="20px"
            spacing={2}
            >
                <Grid item md={10} paddingRight="10px">
                    <FormControl fullWidth>
                        <TextField size="small" disabled
                        value={`Título do `+defineTipo(historico.tipo)+`: ${historico.titulo}`}></TextField>
                    </FormControl>
                </Grid>
                <Grid item md={2}>
                    <FormControl display="flex" fullWidth>
                        <TextField
                        size="small"
                        name="colocacao"
                        onChange={event=>setPosition(event.target.value)}
                        value={position}
                        InputProps={{
                            endAdornment: "°"
                        }}
                        label='Colocação'
                        />
                    </FormControl>
                </Grid>
            </Grid>
            <Grid
            container
            flex="1"
            justifyContent="flex-end"
            paddingBottom="10px"
            >
                <Grid item md={12} paddingTop="10px">
                    <FormControl fullWidth>
                        <TextField multiline rows={4} inputProps={{ maxLength: 500 }} value={descricao}
                        label="Descrição..." onChange={(event) => setDescricao(event.target.value)}/>
                    </FormControl>
                </Grid>
                <Grid item md={12} fullWidth paddingTop="10px">
                    <FormControl fullWidth>
                        <TextField disabled
                        variant="outlined" size="small"
                        value={`Data do Evento: ${dataFormatada(historico.data_evento)}`}/>
                    </FormControl>
                </Grid>
            </Grid>
            <Divider/>
            <Grid container paddingTop="20px" flex="1" justifyContent="flex-end">
                <Grid item paddingRight="5px">
                    <Button color="primary" variant="contained" onClick={confirmHistoricoCampeonato}>Salvar</Button>
                    {salvarCampeonato()}
                </Grid>
                <Grid item>
                    <Button color="error" variant="contained" onClick={handleClose}>Cancelar</Button>
                </Grid>
            </Grid>
        </Box>
    </Paper>
</Backdrop>
                                <Button color="error" value={c.id} variant="contained"
                                onClick={event=>handleExcluir(event.target.value)} size="small"
                                >Excluir</Button>
                                {excluirCampeonato()}
                              </Grid>
                          </Grid>
                      </Box>
                  </Accordion>
                  <br />
                </Box>
                ))}
            </Grid>
            <Grid item xs={12}>
                <Seccion>Eventos</Seccion>
                {eventos.map(e=>(
                  <Box key={e.id} padding="10px">
                  <Accordion variant="outlined">
                      <Box padding="10px" sx={{ flexGrow: 1 }}>
                          <Grid container padding="15px 20px 10px 10px" flex="1" justifyContent="space-between" alignItems="center">
                              <Grid item xs={6}>
                                  <Typography sx={{fontSize: "18px"}}><b>Título:</b> {e.titulo}</Typography>
                              </Grid>
                              <Grid item>
                                  <Typography><b>Data:</b> {dataFormatada(e.data_evento)}</Typography>
                              </Grid>
                              
                          </Grid>
                          <Divider />
                          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}
                          padding="15px 20px 10px 10px" flex="1" justifyContent="space-between" alignItems="end">
                              <Grid item>
                                <Box>
                                  <Grid container flex="1" justifyContent="flex-start" alignItems="start">
                                    <Grid item>
                                      <Typography sx={{fontSize: "18px"}}><b>Descricao:</b></Typography>
                                    </Grid>
                                    <Grid item paddingLeft="5px">
                                      <Typography sx={{fontSize: "18px"}}>{e.descricao}</Typography>
                                    </Grid>
                                  </Grid>
                                </Box>
                              </Grid>
                              <Grid item>
                                <Button color="info" value={e.id} variant="contained"
                                onClick={(event) => handleOpen(event.target.value)} size="small"
                                >Editar</Button>{' '}
<Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={openEditarEvento}
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
            justifyContent="space-between"
            paddingTop="20px"
            spacing={2}
            >
                <Grid item md={12} paddingRight="10px">
                    <FormControl fullWidth>
                        <TextField size="small" disabled
                        value={`Título do `+defineTipo(historico.tipo)+`: ${historico.titulo}`}></TextField>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid
            container
            flex="1"
            justifyContent="flex-end"
            paddingBottom="10px"
            >
                <Grid item md={12} paddingTop="10px">
                    <FormControl fullWidth>
                        <TextField multiline rows={4} inputProps={{ maxLength: 500 }} value={descricao}
                        label="Descrição..." onChange={(event) => setDescricao(event.target.value)}/>
                    </FormControl>
                </Grid>
                <Grid item md={12} fullWidth paddingTop="10px">
                    <FormControl fullWidth>
                        <TextField disabled
                        variant="outlined" size="small"
                        value={`Data do Evento: ${dataFormatada(historico.data_evento)}`}/>
                    </FormControl>
                </Grid>
            </Grid>
            <Divider/>
            <Grid container paddingTop="20px" flex="1" justifyContent="flex-end">
                <Grid item paddingRight="5px">
                    <Button color="primary" variant="contained" onClick={confirmHistoricoEvento}>Salvar</Button>
                    {salvarEvento()}
                </Grid>
                <Grid item>
                    <Button color="error" variant="contained" onClick={handleClose}>Cancelar</Button>
                </Grid>
            </Grid>
        </Box>
    </Paper>
</Backdrop>    
                                <Button color="error" value={e.id} variant="contained"
                                onClick={event=>handleExcluir(event.target.value)} size="small"
                                >Excluir</Button>
                                {excluirEvento()}
                              </Grid>
                          </Grid>
                      </Box>
                  </Accordion>
                  <br />
                </Box>
                ))}
            </Grid>
        </Grid>
    </Box>
  );
}