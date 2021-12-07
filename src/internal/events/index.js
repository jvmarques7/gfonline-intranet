import React, { useEffect } from "react";
import {useStyles} from "./style"
import {Main} from "./style.js";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import {Header} from "../../components/header";
import Card from "@material-ui/core/Card";
import NavBarAdmin from "../components/NavMenuAdmin";
import { CreateEvent } from "./createEvent";
import { Grid } from "@material-ui/core";
import Button from 'react-bootstrap/Button';
import { Backdrop } from "@mui/material";
import { ListEvent } from "./listEvents";
import { useHistory } from "react-router-dom";

export function EventRegister() {

    let history = useHistory();
    useEffect(() => {
        async function verifyUser(){
                if(sessionStorage.getItem('token') && sessionStorage.getItem('token') !== undefined){
                    history.push('/eventos')
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
                        <Card className={classes.card} sx={{direction:"column", justifyContent:"flex-start", padding: 3, minHeight:500}}>
                            <Box width="100%">
                            <Grid container flex="1" justifyContent="center">
                                <Grid item xs={12} paddingRight="20px">
                                    <ListEvent></ListEvent>
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
