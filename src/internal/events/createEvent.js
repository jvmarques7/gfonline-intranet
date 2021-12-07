import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { Button, TextField, Grid, Paper, InputLabel, MenuItem, OutlinedInput, Select, Box, Divider, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { Backdrop } from "@mui/material";
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import api from '../../config/services/api';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

//Estilização StyleSwwitch
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};
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

export function CreateEvent() {

  const notify = () => toast.error(textError, {theme: 'colored'});
  let textError = '';

  let history = useHistory();
  
  const [atuacao, setAtuacao] = React.useState([]);
  const [modalidade, setModalidade] = React.useState([]);
  const [categoria, setCategoria] = React.useState([]);

  const [ativo, setAtivo] = React.useState("Ativado");

  const ativacao = (e) => {
    if (e.target.checked === true) {
      setAtivo("Ativado");
      setEstado("a")
    } else {
      setAtivo("Desativado");
      setEstado("d")
    }
  };

  const atuacaoChange = (event) => {
    const {
      target: { value }
    } = event;
    setAtuacao(
      // On autofill we get a the stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const modalidadeoChange = (event) => {
    const {
      target: { value }
    } = event;
    setModalidade(
      // On autofill we get a the stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const categoriaChange = (event) => {
    const {
      target: { value }
    } = event;
    setCategoria(
      // On autofill we get a the stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const [confirm, setConfirm] = React.useState(false);

  async function salvarEvento() {
    
    if (validate()) {
      await api.post('event', {
        titulo,
        estado,
        decricao: descricao,
        tipo,
        data,
        atuacoes,
        modalidades,
        categorias
      });
      setOpen(false)
      localStorage.setItem('reload', "yes")
      window.location.reload(true);
    } else {
      if (titulo === undefined) {
        textError = 'O título é obrigatório!'
        notify();
      } if (descricao === undefined) {
        textError = 'A descrição é obrigatória!'
        notify();
      } if (tipo === undefined) {
        textError = 'O tipo de evento é obrigatório!'
        notify();
      } if (data === undefined) {
        textError = 'A data é obrigatória!'
        notify();
      }
    }


    function validate() {
      if (titulo === undefined) {
        return false;
      } if (descricao === undefined) {
        return false;
      } if (tipo === undefined) {
        return false;
      } if (data === undefined) {
        return false;
      }
      return true;
    }
    setConfirm(false);

  };

  const closeConfirm = () => {
    setConfirm(false);
  };

  const atuacaoList = ["Jogador", "Técnico", "Árbitro"];
  const modalidadeList = ["Adulto", "Paradesporto", "Juvenil", "Mirim", "Infanto-Juvenil", "Infantil", "Master"];
  const categoriaList = ["Feminino", "Masculino"];

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  const [titulo, setTitulo] = useState();
  const [estado, setEstado] = useState("a");
  const [descricao, setDescricao] = useState();
  const [tipo, setTipo] = useState();
  const [data, setData] = useState();
  const [atuacoes, setAtuacoes] = useState();
  const [modalidades, setModalidades] = useState();
  const [categorias, setCategorias] = useState();

  var text = ""

  async function openConfirm() {
    await atuacao.forEach((entry) => {
      if (entry === "Jogador") {
        text += "1"
      } else if (entry === "Técnico") {
        text += "2"
      } else if (entry === "Árbitro") {
        text += "3"
      }
    })
    await setAtuacoes(text)
    text = ""
    // console.log(atuacoes)

    await modalidade.forEach((entry) => {
      if (entry === "Adulto") {
        text += "1"
      } else if (entry === "Paradesporto") {
        text += "2"
      } else if (entry === "Juvenil") {
        text += "3"
      } else if (entry === "Mirim") {
        text += "4"
      } else if (entry === "Infanto-Juvenil") {
        text += "5"
      } else if (entry === "Infantil") {
        text += "6"
      } else if (entry === "Master") {
        text += "7"
      }
    })
    await setModalidades(text)
    text = ""
    // console.log(modalidades)

    await categoria.forEach((entry) => {
      if (entry === "Feminino") {
        text += "1"
      } else if (entry === "Masculino") {
        text += "2"
      }
    })
    await setCategorias(text)
    text = ""
    // console.log(categorias)

    setConfirm(true);
  }

  return (
    <div>
      <Box flex="1">
        <Button onClick={handleToggle} variant="contained">+Novo Evento</Button>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <Paper>
            <Box padding="20px" minWidth="800px">
              <Typography variant="h4" paddingBottom="20px">
                Cadastrando novo evento...
              </Typography>
              <Typography variant="button">Preencha os dados abaixo:</Typography>
              <Divider />
              <Grid
                container
                flex="1"
                justifyContent="space-between"
                paddingTop="10px"
              >
                <Grid item xs={8}>
                  <FormControl fullWidth>
                    <TextField placeholder="Evento..." inputProps={{ maxLength: 50 }}
                      onChange={event => setTitulo(event.target.value)}></TextField>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl component="fieldset" variant="standard" fullWidth>
                    <FormLabel component="legend">Estado</FormLabel>
                    <FormControlLabel
                      label={ativo}
                      control={<StyleSwitch onChange={ativacao} defaultChecked sx={{ m: 1 }} />}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <Grid container flex="1" justifyContent="space-between">
                <Grid item xs={12} paddingBottom="10px">
                  <FormControl fullWidth>
                    <TextField multiline rows={4} inputProps={{ maxLength: 500 }} placeholder="Descrição..."
                      onChange={event => setDescricao(event.target.value)}></TextField>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid
                paddingTop="20px"
                paddingBottom="30px"
                container
                flex="1"
                justifyContent="space-between"
              >
                <Grid item xs={5}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Tipo</FormLabel>
                    <RadioGroup
                      row
                      aria-label="gender"
                      name="row-radio-buttons-group"
                      onChange={event => setTipo(event.target.value)}
                    >
                      <FormControlLabel
                        value="e"
                        control={<Radio />}
                        label="Evento"
                      />
                      <FormControlLabel
                        value="c"
                        control={<Radio />}
                        label="Campeonato"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <TextField
                      id="outlined-number"
                      label="Data de início"
                      type="date"
                      InputLabelProps={{
                        shrink: true
                      }}
                      variant="outlined"
                      onChange={event => setData(event.target.value)}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Typography variant="button">
                Selecione quem pode participar do evento:
              </Typography>
              <Divider />
              <Grid
                container
                flex="1"
                paddingTop="10px"
                justifyContent="space-between"
              >
                {/* Selecionar Atuacao */}
                <Grid item xs={3.5} >
                  <FormControl fullWidth>
                    <InputLabel id="atuacao">Atuação</InputLabel>
                    {/* <p>{atuacao}</p> */}
                    <Select
                      id="atuacao"
                      multiple
                      value={atuacao}
                      onChange={atuacaoChange}
                      input={<OutlinedInput label="Atuacao" />}
                      renderValue={(selected) => selected.join(",")}
                      MenuProps={MenuProps}
                    >
                      {atuacaoList.map((name) => (
                        <MenuItem key={name} value={name}>
                          <Checkbox checked={atuacao.indexOf(name) > -1} />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/* Selecionar Modalidade */}
                <Grid item xs={3.5}>
                  <FormControl fullWidth>
                    <InputLabel id="modalidade">Modalidade</InputLabel>
                    <Select
                      id="modalidade"
                      multiple
                      value={modalidade}
                      onChange={modalidadeoChange}
                      input={<OutlinedInput label="Modalidade" />}
                      renderValue={(selected) => selected.join(", ")}
                      MenuProps={MenuProps}
                    >
                      {modalidadeList.map((name) => (
                        <MenuItem key={name} value={name}>
                          <Checkbox checked={modalidade.indexOf(name) > -1} />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/* Selecionar Categoria */}
                <Grid item xs={3.5}>
                  <FormControl fullWidth>
                    <InputLabel id="categoria">Categoria</InputLabel>
                    <Select
                      id="categoria"
                      multiple
                      value={categoria}
                      onChange={categoriaChange}
                      input={<OutlinedInput label="Categoria" />}
                      renderValue={(selected) => selected.join(", ")}
                      MenuProps={MenuProps}
                    >
                      {categoriaList.map((name) => (
                        <MenuItem key={name} value={name}>
                          <Checkbox checked={categoria.indexOf(name) > -1} />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container display="flex" paddingTop="20px">
                <Grid item xs="auto" paddingRight="10px">
                  <Button variant="contained" onClick={openConfirm}>Salvar</Button>
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
                      <Button color="primary" onClick={closeConfirm}>Cancelar</Button>
                      <Button color="primary" onClick={salvarEvento} autoFocus>
                        Salvar
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
                <Grid item xs="auto">
                  <Button color="warning" variant="contained" onClick={handleClose}>Cancelar</Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Backdrop>
      </Box>
    </div>
  );
}
