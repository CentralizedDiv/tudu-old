/*global $*/
import React from 'react';
import Storage from './Storage';
import Button from 'material-ui/Button';
import List, {
    ListItem,
    ListItemSecondaryAction,
    ListItemText
}
from 'material-ui/List';
import DeleteForeverIcon from 'material-ui-icons/DeleteForever';
import IconButton from 'material-ui/IconButton';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import { MuiThemeProvider } from 'material-ui/styles';
import Divider from 'material-ui/Divider';
import I18N from './I18N/I18N';

class LOLists extends React.Component {
    constructor(props) {
        super(props);
        this.removeList = this.removeList.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            open: false
        };
    }
    
    handleClose(agree) {
        this.setState({ open: false });
        if(agree === true){
            Storage.removeList(this.state.currentList, true);
            this.props.changeActiveList()
        }
    }
    
    removeList(id){
        this.setState({currentList:id});
        this.setState({open:true});
    }
    
    render() {
        var lists = Storage.getLists();
        return (
            <div>
                <MuiThemeProvider> 
                    <Dialog
                      open={this.state.open}
                      onClose={this.handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                      disableBackdropClick
                    >
                      <DialogTitle id="alert-dialog-title"><I18N language={this.props.language}>Delete List?</I18N></DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          <I18N language={this.props.language}>Do you really want to remove this list and its tasks permanently?</I18N>
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => {this.handleClose(false)}} color="primary">
                          <I18N language={this.props.language}>Disagree</I18N>
                        </Button>
                        <Button onClick={() => {this.handleClose(true)}} color="primary" autoFocus>
                          <I18N language={this.props.language}>Agree</I18N>
                        </Button>
                      </DialogActions>
                    </Dialog>
                </MuiThemeProvider>
                    <List>
                        {lists.map(list => (
                        <div>
                            <ListItem key={list.id} button onClick={() => {this.props.changeActiveList(list)}}>
                                <ListItemText primary={list.listLabel}/>
                                <ListItemSecondaryAction style={{ display: list.id === "1" ? 'none' : "block" }} >
                                    <IconButton onClick={() => {this.removeList(list.id)}}>
                                        <DeleteForeverIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                        </div>
                        ))}
                    </List>
            </div>
        );
    }
}

export default LOLists;

