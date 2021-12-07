import React, { useEffect } from "react";
import {useStyles} from "./style"
import {Main} from "./style.js";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import {Header} from "../../components/header";
import Card from "@material-ui/core/Card";
import NavBarAdmin from "../components/NavMenuAdmin";
import { useHistory } from "react-router-dom";
import {getWithExpiry} from "../../config/auth/isAuthenticated"
import { List, ListItem, Typography } from "@material-ui/core";
import logoImg from "../../../src/logo.png";

function Home (){

    let history = useHistory();

    // try{
    //     if(getWithExpiry('token', 'username')===null){
    //         history.push("/intranet");
    //     }
    // }catch(err){
        
    // }

    useEffect(() => {
        async function verifyUser(){
                if(sessionStorage.getItem('token') && sessionStorage.getItem('token') !== undefined){
                    history.push('/')
                }else{
                    history.push('/intranet');
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
                        <Card className={classes.card} sx={{justifyContent: 'center'}}>
                            <Box padding="50px 100px 100px 100px" maxWidth="450px" sx={{display: 'flex', justifyContent: 'center'}}>
                                <List dense={true}>
                                    <ListItem sx={{display: 'flex', justifyContent: 'center'}}>
                                        <img src={logoImg}/>
                                    </ListItem>
                                    <ListItem sx={{display: 'flex', justifyContent: 'center'}}>
                                        <Typography sx={{textAlign: 'center'}} variant="subtitle1">
                                            Sistema de gerenciamento para Federações Esportivas.
                                        </Typography>
                                    </ListItem>
                                    <ListItem sx={{display: 'flex', justifyContent: 'center'}}>
                                        <Typography variant="body2">
                                            Versão 1.0.0
                                        </Typography>
                                    </ListItem>
                                </List>
                            </Box>
                        </Card>
                    </Box>
                </Container>
            </Main>
        </div>
    );
}

export {Home}