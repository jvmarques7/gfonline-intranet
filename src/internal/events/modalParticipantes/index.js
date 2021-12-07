import { 
    Button,
    FormControl,
    Grid,
    Paper, 
    Popover, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Typography,
    Tooltip,
    Menu,
    MenuItem,
    Divider,
    SvgIcon,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
 } from '@mui/material'
import { Box } from '@mui/system'
import DeleteIcon from '@mui/icons-material/Delete';
import HelpIcon from '@mui/icons-material/Help';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import React, { Fragment, useEffect, useState } from 'react'
import api from '../../../config/services/api';
import XLSX from 'xlsx'
import { ExportSheet } from 'react-xlsx-sheet'
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, ReactPDF, PDFViewer } from '@react-pdf/renderer';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { toast } from 'react-toastify';


function Participantes(){

    const notifyError = () => toast.error(text, {theme: 'colored'});
    let text = '';

    const notifySuccess = () => toast.success(text, {theme: 'colored'});

    const styles = StyleSheet.create({
        page: {
          flexDirection: 'column',
          backgroundColor: 'white',
          fontSize: '12px'
        },
        section: {
            paddingLeft: 10,
            marginLeft: 10
        },
        section2: {
            paddingTop: 10,
            paddingRight: 10
        },
        block: {
            paddingLeft: 10
        },
        header: {
            paddingLeft: 10,
            paddingTop: 10
        },
        text: {
            fontSize: '9px',
            paddingBottom: 20,
            textAlign: 'right'
        }
      });    

    const [participantes, setParticipantes] = useState([]);
    const [event, setEvent] = useState({});
    const [state, setState] = useState(false);
    const [confirm, SetConfirm] = useState(false);

    useEffect(()=>{
        async function carregarParticipantes(){
            try{
                const event_id = (sessionStorage.getItem('id_event'))
                const {data} = await api.put("inscricao", {event_id})
                const response = await api.get(`event/${event_id}`)
                setEvent(response.data)
                setParticipantes(data)
            }catch(err){

            }
        }
        carregarParticipantes();
    }, [state])

    function handleBack(){
        window.location.reload()
    }

    function controlSituacao(c){
        if(c === "s"){
            return(
                <Button variant="outlined" color="success"
                style={{ cursor: 'default', pointerEvents: 'none' }}>ATIVO</Button>
            )
        }else{
            return(
                <Button variant="outlined" color="warning"
                style={{ cursor: 'default', pointerEvents: 'none' }}>INATIVO</Button>
            )
        }
    }

    function BasicMenu() {
        const [anchorEl, setAnchorEl] = React.useState(null);
        const open = Boolean(anchorEl);
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
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                endIcon={<SaveAltIcon />}
                // endIcon={<ArrowDropDownIcon />}
            >
                Exportar
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
                elevation={2}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleClose}>
                    <ExportSheet 
                        fileName={`lista_`+event.id}
                        dataSource={data} 
                        header={head}
                        xlsx={XLSX}
                    >
                        <Button color="success" endIcon={<BackupTableIcon/>}>
                            .xlsx
                        </Button>
                    </ExportSheet>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <PDFDownloadLink document={<MyDocument />} fileName={`lista_`+event.id} style={{textDecoration: 'none'}}>
                        <Button color="error" endIcon={<PictureAsPdfIcon />}>
                            .pdf
                        </Button>
                    </PDFDownloadLink>
                </MenuItem>
            </Menu>
            </div>
        );
        }

    function buttonConfirm(id){

        function hendleConfirm(){
            SetConfirm(true)
        }
        function hendleCancel(){
            SetConfirm(false)
        }

        async function handleDelete(){
            try{
                await api.delete(`inscricao/${id}`);
                text = 'Inscrção removida com sucesso!';
                notifySuccess()
            }catch(err){
                text = 'Erro: Falha na remoção.'
                notifyError()
            }
            setState(true)
            SetConfirm(false)
        }

        const tab = (<>&nbsp;&nbsp;&nbsp;&nbsp;</>)
        
        return(
            <Grid container flex="1" alignItems="center" justifyContent="center">
                <Grid item padding="0 5px 0 5px">
                    <Button color="error" variant="outlined" startIcon={<DeleteIcon />}
                    onClick={hendleConfirm}>
                        <b>X</b>
                    </Button>
                    <Dialog
                        open={confirm}
                        fullWidth={false}
                        maxWidth="md"
                        >
                        <Box
                            noValidate
                            component="form"
                            sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            m: 'auto',
                            width: 'fit-content',
                            }}
                        >
                        <DialogTitle id="alert-dialog-title">
                        <b>Confirmar Remoção da Inscrição?</b>
                        </DialogTitle>
                        <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                        Esta remoção só deve ser feita caso seja comprovada o débito do usuário por:<br/>
                        {tab}-Não efetuar o pagamento para o evento (caso possua);<br/>
                        {tab}-Vencimento da Federação após a inscrição e o não pagamento da mesma;<br/>
                        {tab}-Irregularidades no cadastro que desqualificam o usuário para o evento.<br/>
                        </DialogContentText>
                        <DialogContentText id="alert-dialog-description"> 
                        <br/><b>Esta ação não pode ser desfeita. Deseja continuar?</b>
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button color="primary" onClick={hendleCancel}>Cancelar</Button>
                        <Button color="primary" onClick={handleDelete} autoFocus>
                            Confirmar
                        </Button>
                        </DialogActions>
                    </Box>
                    </Dialog>
                </Grid>
            </Grid>
        )
    }

    const head = [
        { title: "Nome Completo", dataIndex: "users_nomeCompleto" },
        { title: "CPF", dataIndex: "users_cpf" },
        { title: "Email", dataIndex: "users_email" }
    ];
    const data = participantes;
    

    //controle do PopOver
    // const [anchorEl, setAnchorEl] = useState(null);
    // const handlePopoverOpen = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };
    // const handlePopoverClose = () => {
    //     setAnchorEl(null);
    // };
    // const open = Boolean(anchorEl);

    function showTable(){

        const tooltipText = "Remoção de inscrição para aqueles que estiverem em débito com a Federação.";

        return(
            <Box width="100%">
                <TableContainer component={Paper}>
                    <Table sx={{ width: "100%" }} size="small" aria-label="a dense table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell align="right">CPF</TableCell>
                            <TableCell align="right">N° Contato</TableCell>
                            <TableCell align="right">Federaçao</TableCell>
                            <TableCell align="center">
                                Remover Inscrição 
                                <Tooltip title={tooltipText} placement="top">
                                    <HelpIcon sx={{width: 15}}/>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {participantes.map((p) => (
                            <TableRow
                            key={p.users_id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {p.users_nomeCompleto}
                            </TableCell>
                            <TableCell align="right">{p.users_cpf}</TableCell>
                            <TableCell align="right">{p.users_celular}</TableCell>
                            <TableCell align="right">{controlSituacao(p.federacao_is_ativo)}</TableCell>
                            <TableCell align="center">{buttonConfirm(p.inscricao_id)}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        )
    }

    function getDate(dt) {
        const data = new Date();
        var hours = parseInt(data.getHours());
        var min = parseInt(data.getUTCMinutes());
        var sec = parseInt(data.getUTCSeconds());
        
        var month = parseInt(data.getMonth())+1;
        if(month < 10){
            month = '0'+(month)
        }

        if(hours < 10){
            hours = '0'+hours
        }
        if(min<10){
            min = '0'+min
        }
        if(sec<10){
            sec = '0'+sec
        }

        const day = data.getDate()+'/'+month+'/'+data.getFullYear();
        const time = hours+':'+min+':'+sec;

        const today = {
            day, time
        }

        return today;
    }

    const MyDocument = () => (
        <Document>
            <Page size="A4" style={styles.page}>
            <View style={styles.section2}>
                <Text style={styles.text}>
                    Data emissão: {getDate().day+' '+getDate().time}
                </Text>
            </View>
            <View style={styles.section}>
                <Text>
                    Lista de Participantes Evento #{event.id}
                </Text>
                <Text>
                    {event.titulo}
                </Text>
                {participantes.map((entry, num=0)=>(
                <>
                    <Text key={num} style={styles.header}>
                        Participante: #{num=num+1}
                    </Text>
                    <Text style={styles.block}>
                        Nome Completo: {entry.users_nomeCompleto}
                    </Text>
                    <Text style={styles.block}>
                        CPF: {entry.users_cpf}
                    </Text>
                    <Text style={styles.block}>
                        Celular: {entry.users_celular}
                    </Text>
                    <Text>
                        _______________________________________________
                    </Text>
                </>
                ))}
            </View>
            <View style={styles.section}>
                
            </View>
            </Page>
        </Document>
    );

    return(
        <>
            <Box padding="20px" minWidth="650px" minHeight="400px">
                <Grid container flex="1" paddingTop="20px" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">
                            Lista de Participantes - Evento #{event.id}
                        </Typography>
                        <Typography variant="h6" paddingBottom="20px">
                            {event.titulo}
                        </Typography>
                        </Grid>
                    <Grid item display="flex" justifyContent="flex-end">
                        <Grid item>
                            <BasicMenu />
                        </Grid>
                        <Grid item paddingLeft="10px">
                            <Button color="warning" variant="contained" onClick={handleBack}>Voltar</Button>
                        </Grid>
                    </Grid>
                </Grid>
                {showTable()}
                {/* <PDFViewer>
                    <MyDocument/>
                </PDFViewer> */}
            </Box>
        </>
    )

}

export {Participantes}