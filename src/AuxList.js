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
import RestoreIcon from 'material-ui-icons/Restore';
import IconButton from 'material-ui/IconButton';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import { MuiThemeProvider } from 'material-ui/styles';
import I18N from './I18N/I18N';

class AuxList extends React.Component {
    constructor(props) {
        super(props);
        this.restoreTask = this.restoreTask.bind(this);
        this.removeTask = this.removeTask.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            open: false,
            agreeDelete:false
        };
    }
    
    handleClose(agree) {
        this.setState({ open: false });
        if(agree === true){
            Storage.removeTask(this.state.currentTask, this.props.activeList.id, true);
            this.props.toggleAuxListModal();
        }
    }
    
    restoreTask(id){
        Storage.restoreTask(id, this.props.activeList.id);
        this.props.reloadList();
        this.props.toggleAuxListModal();
    }
    
    removeTask(id){
        this.setState({currentTask:id});
        this.setState({open:true});
    }
    
    render() {
        var tasksInTrash = Storage.getTasks();
        var done  = this.props.mode === 'Done'  ? true : false;
        var trash = this.props.mode === 'Trash' ? true : false;
        tasksInTrash = tasksInTrash.filter(function(t){
           if(t.inTrash === trash && t.done === done && t.listId === this.props.activeList.id)
            return t;
        }.bind(this));
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
                      <DialogTitle id="alert-dialog-title"><I18N language={this.props.language}>Delete Task?</I18N></DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          <I18N language={this.props.language}>Do you really want to remove this task permanently?</I18N>
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
                    {tasksInTrash.map(task => (
                        <ListItem key={task.id} divider>
                            <ListItemText primary={task.taskLabel} secondary={task.taskDesc}/>
                            <ListItemSecondaryAction>
                                <IconButton onClick={() => {this.restoreTask(task.id)}}>
                                    <RestoreIcon />
                                </IconButton>
                                <IconButton onClick={() => {this.removeTask(task.id)}}>
                                    <DeleteForeverIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                    </List>
            </div>
        );
    }
}

export default AuxList;

