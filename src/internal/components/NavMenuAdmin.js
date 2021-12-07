import React from 'react';
import { makeStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
import {ListItem } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import SvgIcon from '@material-ui/core/SvgIcon';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { Paper } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';

function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

const useStyles = makeStyles((theme) => ({
  navBar: {
    width:'100%',
    maxWidth: 300,
    height: '100%',
  },
  paper:{
    margin: 16,
    padding: 16,
    width: 225,
    maxHeight: 300,
    // background: 'green'
  },
  card:{
    margin: 16,
    width: '100%',
    maxWidth: '1280',
    display: 'flex',
  } 
}));

export default function NavBarAdmin() {

  var history = useHistory();

  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState([]);

  function handleListItemClick(event, index){
    setSelectedIndex(selectedIndex => [...selectedIndex, index]
      );

      if(index == 0){
        history.push('/');
      }
      if(index == 1){
        history.push('/clientes');
      }
      if(index == 2){
        history.push('/eventos');
      }
    //   if(index == 3){
    //     history.push('/calendario');
    //   }
      if(index === 3){
        sessionStorage.clear()
        history.push('/intranet')
      }

  }

  return (
    <div className={classes.navBar}>
      <Paper className={classes.paper}>
          <ListItem 
            button={true} 
            selected={selectedIndex === 0}
            onClick={(event) => handleListItemClick(event, 0)}>
            <ListItemIcon >
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button={true}
            selected={selectedIndex === 1}
            onClick={(event) => handleListItemClick(event, 1)}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Clientes" />
          </ListItem>
        <ListItem
            button={true}
            selected={selectedIndex === 2}
            onClick={(event) => handleListItemClick(event, 2)}
          >
            <ListItemIcon>
              <CalendarTodayIcon />
            </ListItemIcon>
            <ListItemText primary="Gerenciador de Eventos" />
          </ListItem>
          <ListItem
            button={true}
            selected={selectedIndex === 2}
            disabled
            onClick={(event) => handleListItemClick(event, 2)}
          >
            <ListItemIcon>
              <SportsVolleyballIcon />
            </ListItemIcon>
            <ListItemText primary="Clubes... Em breve" />
          </ListItem>
          {/* <ListItem
            button={true}
            selected={selectedIndex === 2}
            disabled
            onClick={(event) => handleListItemClick(event, 2)}
          >
            <ListItemIcon>
              <ContactSupportIcon />
            </ListItemIcon>
            <ListItemText primary="Suporte - Em breve..." />
          </ListItem> */}
        <Divider />
        <List component="nav" aria-label="secondary mailbox folder">
        <ListItem
            button={true}
            selected={selectedIndex === 3}
            onClick={(event) => handleListItemClick(event, 3)}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Sair"/>
          </ListItem>
        </List>
      </Paper>
    </div>
  );
}