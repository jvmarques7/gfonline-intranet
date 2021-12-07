import React, { Fragment, useEffect } from "react";
import {useStyles} from "./style"
import {Main} from "./style.js";
import Container from "@material-ui/core/Container";
import {Header} from "../../components/header";
import Card from "@material-ui/core/Card";
import NavBarAdmin from "../components/NavMenuAdmin";
import { Grid } from "@mui/material";
import { Box } from '@mui/system';
import { ListClients } from "./listClients";
import { useHistory } from "react-router-dom";

function Clients (){

    let history = useHistory();
    useEffect(() => {
        async function verifyUser(){
            try{
                if(sessionStorage.getItem('token') && sessionStorage.getItem('token') !== undefined){
                    history.push('/clientes')
                }else{
                    history.push('/intranet');
                }
            }catch(err){
                
            }
                }
                verifyUser();
        },[])

    const classes = useStyles();

    return(
        <div>
            <Header />
            <Main>
                <Container maxWidth='xl'>
                    <Box display='flex' className={classes.box}>
                        <NavBarAdmin />
                        <Card className={classes.card}>
                            <Box width="100%" paddingRight="20px">
                                <Grid container flex="1" justifyContent="space-between">
                                    <Grid item xs={12} padding="20px">
                                        <ListClients></ListClients>
                                    </Grid>
                                </Grid>
                            </Box>
                            
                        </Card>
                    </Box>
                </Container>
            </Main>
        </div>
    );
}

export {Clients}