import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../../config/services/api";
import {Grid, Paper, Snackbar, Stack, TextField, Typography, Button, FormControl} from "@mui/material";
import { Container } from "@material-ui/core";
import MuiAlert from '@mui/material/Alert';
import { Box } from "@mui/system";
import logoImg from "../../../src/FGB.png";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

export function InternalLogin(props){

    let history = useHistory();

    const [username, setUsuario] = useState();
    const [password, setPassword] = useState();

    const [open, setOpen] = useState(false)

   async function handleLogin(){
      const {data} = await api.post('intranet', {username, password});
      if(data.token){
        sessionStorage.setItem('token', data.token);
        history.push('/');
      }else{
          handleClickOpen();
      }
    }
        const handleClickOpen = () => {
        setOpen(true);
        };

        const handleClose = () => {
        setOpen(false);
        };

    return (
        <Container sx={{display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 4,
            zIndex: 99,
            width: '100%',
            height: '100%'}}>
            <Paper sx={{margin: 1, width: 400, height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Box padding="30px">
                    <FormControl fullWidth>
                        <img src={logoImg}/>
                    </FormControl>
                </Box>
            </Paper>
            <Paper sx={{width: 400, height: 400}}>
                <Box padding="30px">
                    <Grid container flex="1" justifyContent="center" padding="10px">
                        <Typography variant="h5" gutterBottom component="div">
                            <b>Intranet GFO</b></Typography>
                    </Grid>
                    <Grid container flex="1" justifyContent="center" padding="10px">
                        <Typography variant="h5" gutterBottom component="div">
                            <b>Faça seu Login</b></Typography>
                    </Grid>
                    <Grid container flex="1" justifyContent="center" padding="10px">
                        <Grid item xs={12} padding="10px">
                            <FormControl fullWidth>
                                <TextField type="text" name="usuario" placeholder="Usuário" onChange={e => setUsuario(e.target.value)}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} padding="10px">
                            <FormControl fullWidth>
                                <TextField type="password" name="senha" placeholder="Senha" onChange={e => setPassword(e.target.value)}/>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container flex="1" justifyContent="center" padding="10px">
                        <Button variant="contained" size="large" type="button" className="btn" onClick={handleLogin}>
                            Login
                        </Button>
                        <Stack spacing={2} sx={{ width: '100%' }}>
                        <Snackbar open={open} anchorOrigin={{vertical: "top", horizontal: "right"}} autoHideDuration={3000} onClose={handleClose}>
                            <Alert 
                            onClose={handleClose} 
                            severity="error" 
                            sx={{ width: '100%' }}>
                            Usuário/Senha incorreta! Tente novamente.
                            </Alert>
                        </Snackbar>
                    </Stack>
                    </Grid>
                    {/* <a href="blank"><h5>Esqueci minha senha</h5></a> */}
                </Box>
            </Paper>
        </Container>
    );

}



// <br />
//                     <Typography className="header">Intranet GFO</Typography>
                    
//                     <Typography className="header">Intranet GFO</Typography>
//                     <div className="header">Faça seu login</div>
//                     <div className="content">
//                     {/* <div className="image">
//                         <img src={loginImg} />
//                     </div> */}
//                     <div className="form">
//                         <div className="form-group">
//                         <label htmlFor="username">Usuário</label>
//                         <input type="text" name="usuario" onChange={e => setUsuario(e.target.value)} />
//                         </div>
//                         <div className="form-group">
//                         <label htmlFor="password">Senha</label>
//                         <input type="password" name="senha" onChange={e => setPassword(e.target.value)}/>
//                         </div>
//                     </div>
//                     </div>
//                     <div className="footer">
//                     <button type="button" className="btn" onClick={handleLogin}>
//                         Login
//                     </button>
                    
//                     </div>
//                     <br />