/*global $, navigator*/
import React from 'react';
import Ionicon from 'react-ionicons';
import Items from './Items';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';
import List, {
    ListItem,
    ListItemIcon,
    ListItemText
}
from 'material-ui/List';
import I18N from './I18N/I18N';
import ListSubheader from 'material-ui/List/ListSubheader';
import Button from 'material-ui/Button';
import TaskEdit from './TaskEdit';
import ListEdit from './ListEdit';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Storage from './Storage';
import AuxList from './AuxList';
import LOLists from './LOLists';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import Drawer from 'material-ui/Drawer';
import LanguageIcon from 'material-ui-icons/Language';
import ImportExportIcon from 'material-ui-icons/ImportExport';
import Divider from 'material-ui/Divider';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#00593b' }
  },
});

class ListTudu extends React.Component {
    constructor() {
        super();
        this.state = {
            activeList: {
                listLabel: 'Default List',
                id: '1'
            },
            language:navigator.language.toLowerCase(),
            cantSubmit: true,
            auxListOpen: false,
            newTaskOpen: false,
            listsOpen: false,
            newListOpen: false,
            snackOpen: false,
            drawerOpen: false,
        };
        this.toggleTaskEditModal = this.toggleTaskEditModal.bind(this);
        this.toggleListModal = this.toggleListModal.bind(this);
        this.toggleAuxListModal = this.toggleAuxListModal.bind(this);
        this.toggleLOListsModal = this.toggleLOListsModal.bind(this);
        this.changeActiveList = this.changeActiveList.bind(this);
        this.allowNewList = this.allowNewList.bind(this);
        this.allowNewTask = this.allowNewTask.bind(this);
        this.addTask = this.addTask.bind(this);
        this.addList = this.addList.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.reloadList = this.reloadList.bind(this);
        this.importTasks = this.importTasks.bind(this);
        this.toggleImportModal = this.toggleImportModal.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.copyTasks = this.copyTasks.bind(this);
        this.changeLanguage = this.changeLanguage.bind(this);
    }

    reloadList() {
        this.forceUpdate();
        $('#overlay-after').trigger('click');
    }

    addTask() {
        var task = {
            taskLabel: $('#task-label').val(),
            taskDesc: $('#task-description').val(),
            listId: this.state.activeList.id
        };
        Storage.setTask(task);
        $('#overlay-after').trigger('click');
        this.toggleTaskEditModal();
    }

    addList() {
        var list = {
            listLabel: $('#list-label').val()
        };
        Storage.setList(list);
        $('#overlay-after').trigger('click');
        this.toggleListModal();
    }

    allowNewTask(label, description) {
        if ((label.value && description.value && this.state.cantSubmit === true) || (!(label.value && description.value) && this.state.cantSubmit === false)) {
            this.setState({
                cantSubmit: !this.state.cantSubmit
            });
        }
    }

    allowNewList(label) {
        if ((label.value && this.state.cantSubmit === true) || (!(label.value) && this.state.cantSubmit === false)) {
            this.setState({
                cantSubmit: !this.state.cantSubmit
            });
        }
    }

    toggleTaskEditModal() {
        this.setState({
            cantSubmit: true
        });
        this.setState({
            newTaskOpen: !this.state.newTaskOpen
        });
    }

    toggleDrawer() {
        this.setState({
            drawerOpen: !this.state.drawerOpen
        });
    }

    toggleAuxListModal(currentAuxList) {
        this.setState({
            auxListOpen: !this.state.auxListOpen
        });

        if (currentAuxList === 'check')
            this.setState({
                currentAuxList: 'Done'
            });
        else if (currentAuxList === 'trash')
            this.setState({
                currentAuxList: 'Trash'
            });

    }

    toggleLOListsModal() {
        this.setState({
            listsOpen: !this.state.listsOpen
        });
    }

    toggleListModal() {
        this.setState({
            cantSubmit: true
        });
        this.setState({
            newListOpen: !this.state.newListOpen
        });
    }

    changeActiveList(list) {
        if (list !== undefined) {
            this.setState({
                activeList: list
            });
            this.toggleLOListsModal();
        } else {
            this.changeDefaultListName();
        }
    }

    copyTasks() {
        var $temp = $("<input>");
        $("body").append($temp);
        var data = {
            tasks: Storage.getTasks(),
            lists: Storage.getLists(),
        };
        data = JSON.stringify(data);
        $temp.val(data);
        $temp.select();
        document.execCommand("copy");
        this.setState({
            snackOpen: true
        });
        $('.floating').css({
            bottom: '70px'
        });
        $temp.remove();
    }

    handleClose() {
        this.setState({
            snackOpen: false,
            snackImportOpen: false
        });
        $('.floating').css({
            bottom: '10px'
        });
    }

    importTasks() {
        try{
            var importedData = Storage.importTasks(this.importData.value);
            this.setState({
                snackImportOpen: true,
                importReturn: importedData.listsAdded + ' List(s) and ' + importedData.tasksAdded + ' Task(s) Imported!'
            });
            this.toggleImportModal();
        }catch(err){
            this.setState({
                snackImportOpen: true,
                importReturn: 'Invalid Format, please export your data from other tudu account'
            });
        }
    }

    toggleImportModal() {
        this.setState({
            importOpen: !this.state.importOpen
        });
    }

    componentWillMount() {
        var defaultLang = navigator.language.toLowerCase();
        Storage.initStorage(defaultLang);
        I18N.config('../src/I18N/I18NWords.json', 'en-us');
        this.changeDefaultListName();
    }
    
    changeDefaultListName() {
        if(this.state.language === 'en-us')
            this.setState({activeList:{listLabel: 'Default List', id:'1'}});
        if(this.state.language === 'pt-br')
            this.setState({activeList:{listLabel: 'Lista Padrão', id:'1'}});
            
        setTimeout(function(){
            Storage.editList(this.state.activeList);
        }.bind(this),100);
    }
    
    changeLanguage(language){
        this.setState({language:language}, this.changeDefaultListName);
        this.toggleDrawer();
    }
    
    render() {
        return (
            <div>
                <div activeList={this.state.activeList.id} class="title-list-container">
                    <div class="export" onClick={() =>
                        {this.copyTasks()}} >
                        <Ionicon icon="ios-log-out" fontSize="25px" color="#022d1f"/>
                    </div>
                    <div class="settings" onClick={() =>
                        {this.toggleDrawer()}} >
                        <Ionicon icon="md-settings" fontSize="25px" color="#022d1f"/>
                    </div>
                    <h2 class="title-list" onClick={this.toggleLOListsModal}>{this.state.activeList.listLabel}</h2>
                    <div class="check" onClick={() =>
                        {this.toggleAuxListModal('check')}} >
                        <Ionicon icon="ios-checkmark-circle-outline" fontSize="30px" color="rgb(255, 255, 255)"/>
                    </div>
                    <div class="check-shake">
                        <Ionicon icon="ios-checkmark-circle-outline" shake={true} fontSize="30px" color="rgb(255, 255, 255)"/>
                    </div>
                    <div class="trash" onClick={() =>
                        {this.toggleAuxListModal('trash')}} >
                        <Ionicon icon="ios-trash-outline" fontSize="30px" color="rgb(255, 255, 255)"/>
                    </div>
                    <div class="trash-shake">
                        <Ionicon icon="ios-trash-outline" shake={true} fontSize="30px" color="rgb(255, 255, 255)"/>
                    </div>
                </div>
                <Items language={this.state.language} changeLanguage={this.changeLanguage} inTrash={false} activeList={this.state.activeList} reloadList={this.reloadList}/>
                <div>
                    <div class="floating" onClick={this.toggleTaskEditModal}>
                        <Ionicon icon="ios-add-circle" fontSize="50px" color="#022d1f"/>
                    </div>
                    {/*Dialogs*/}
                    <MuiThemeProvider  theme={theme}>
                        {/*New Task Dialog*/}
                        <Dialog
                            open={this.state.newTaskOpen}
                            onClose={this.toggleTaskEditModal}
                            aria-labelledby="form-dialog-title"
                            fullScreen = {true}
                            >
                            <DialogTitle id="form-dialog-title"><I18N language={this.state.language}>New Task</I18N></DialogTitle>
                            <DialogContent>
                                <TaskEdit language={this.state.language} allowNewTask={this.allowNewTask} />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.toggleTaskEditModal}>
                                <I18N language={this.state.language}>Cancel</I18N>
                                </Button>
                                <Button disabled={this.state.cantSubmit} onClick={this.addTask} color="primary" autoFocus>
                                <I18N language={this.state.language}>Add Task</I18N>
                                </Button>
                            </DialogActions>
                        </Dialog>
                        
                        {/*Auxiliar Lists Dialog(Trash and Done)*/}
                        <Dialog
                            open={this.state.auxListOpen}
                            onClose={this.toggleAuxListModal}
                            aria-labelledby="form-dialog-title"
                            fullScreen = {true}
                            >
                            <DialogTitle id="form-dialog-title">{<I18N language={this.state.language}>{this.state.currentAuxList}</I18N>} - {this.state.activeList.listLabel}</DialogTitle>
                            <DialogContent>
                                <AuxList language={this.state.language} mode={this.state.currentAuxList} reloadList={this.reloadList} toggleAuxListModal={this.toggleAuxListModal} activeList={this.state.activeList}/>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.toggleAuxListModal}>
                                <I18N language={this.state.language}>Close</I18N>
                                </Button>
                            </DialogActions>
                        </Dialog>
                        
                        {/*Lists*/}
                        <Dialog
                            open={this.state.listsOpen}
                            onClose={this.toggleLOListsModal}
                            aria-labelledby="form-dialog-title"
                            fullScreen = {true}
                            >
                            <DialogTitle id="form-dialog-title"><I18N language={this.state.language}>Lists</I18N></DialogTitle>
                            <DialogContent>
                                <LOLists language={this.state.language} changeActiveList = {this.changeActiveList}/>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.toggleLOListsModal}>
                                <I18N language={this.state.language}>Cancel</I18N>
                                </Button>
                                <Button onClick={this.toggleListModal} color="primary" autoFocus>
                                <I18N language={this.state.language}>Add List</I18N>
                                </Button>
                            </DialogActions>
                        </Dialog>
                        
                        {/*New List*/}
                        <Dialog
                            open={this.state.newListOpen}
                            onClose={this.toggleListModal}
                            aria-labelledby="form-dialog-title"
                            fullScreen = {true}
                            >
                            <DialogTitle id="form-dialog-title"><I18N language={this.state.language}>New List</I18N></DialogTitle>
                            <DialogContent>
                                <ListEdit language={this.state.language} allowNewList={this.allowNewList} />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.toggleListModal}>
                                <I18N language={this.state.language}>Cancel</I18N>
                                </Button>
                                <Button disabled={this.state.cantSubmit} onClick={this.addList} color="primary" autoFocus>
                                <I18N language={this.state.language}>Save</I18N>
                                </Button>
                            </DialogActions>
                        </Dialog>
                        
                        {/*SnackBar - Export Tasks*/}
                        <Snackbar
                        className='snack'
                        anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                        }}
                        open={this.state.snackOpen}
                        autoHideDuration={3000}
                        onClose={this.handleClose}
                        SnackbarContentProps={{
                        'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id"><I18N language={this.state.language}>Tasks And Lists copied to clipboard</I18N></span>}
                        />
                        <Snackbar
                        anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                        }}
                        open={this.state.snackImportOpen}
                        autoHideDuration={3000}
                        onClose={this.handleClose}
                        SnackbarContentProps={{
                        'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">{<I18N language={this.state.language} dynamic>{this.state.importReturn}</I18N>}</span>}
                        />
                        
                        {/*Import Task*/}
                        <Dialog
                            open={this.state.importOpen}
                            onClose={this.toggleImportModal}
                            aria-labelledby="form-dialog-title"
                            fullScreen = {true}
                            >
                            <DialogTitle id="form-dialog-title"><I18N language={this.state.language}>Import Tasks</I18N></DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="import"
                                    label={<I18N language={this.state.language}>Data</I18N>}
                                    type="text"
                                    fullWidth
                                    inputRef={el =>
                                this.importData = el}
                                onChange={() => {this.allowNewList(this.importData)}}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.toggleImportModal}>
                                <I18N language={this.state.language}>Cancel</I18N>
                                </Button>
                                <Button disabled={this.state.cantSubmit} onClick={this.importTasks} color="primary" autoFocus>
                                <I18N language={this.state.language}>Save</I18N>
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </MuiThemeProvider>
                    
                    {/*Drawer Settings*/}
                    <Drawer className="drawer" open={this.state.drawerOpen} onClose={this.toggleDrawer}>
                        <List
                        subheader={
                            <ListSubheader component="div">
                                <div style={{display: 'inline', position: 'absolute', top: '3px', left: '75px', paddingLeft:'142px'}}>
                                    <Ionicon icon="md-settings" fontSize="15px" color="#022d1f"/>
                                </div>
                                <I18N language={this.state.language}>Settings</I18N>
                            </ListSubheader>
                        }>
                            <ListItem style = {{width:'250px'}} button onClick={this.toggleImportModal}>
                                <ListItemIcon>
                                <ImportExportIcon />
                                </ListItemIcon>
                                <ListItemText primary={<I18N language={this.state.language}>Import Data</I18N>}/>
                            </ListItem>
                            <Divider />
                            <ListItem style = {{width:'250px'}} button onClick={() =>{this.setState({collapseLanguage:!this.state.collapseLanguage})}}>
                                <ListItemIcon>
                                <LanguageIcon />
                                </ListItemIcon>
                                <ListItemText inset primary={<I18N language={this.state.language}>Language</I18N>}/>
                                {this.state.open ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={this.state.collapseLanguage} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem button>
                                    <ListItemText inset primary="English" onClick={() => {this.changeLanguage('en-us')}}/>
                                    </ListItem>
                                    <ListItem button>
                                    <ListItemText inset primary="Português" onClick={() => {this.changeLanguage('pt-br')}}/>
                                    </ListItem>
                                </List>
                            </Collapse>
                             <Divider />
                        </List>
                    </Drawer>
                </div>
            </div>
        );
    }
}

export default ListTudu;
