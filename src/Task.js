/*global $*/
import React from 'react';
import Ionicon from 'react-ionicons';
import Storage from './Storage';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TaskEdit from './TaskEdit';
import I18N from './I18N/I18N';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#00593b' }
  },
});


class Task extends React.Component {
    
    constructor(props, context) {
        super(props);
        this.state = {
            cantSubmit:true,
            editTaskOpen:false
        };
        this.toggleEditTaskModal = this.toggleEditTaskModal.bind(this);
        this.editTask = this.editTask.bind(this);
        this.allowEditTask = this.allowEditTask.bind(this);
    }
    
    /*Get height until selected task*/
    calculateHeight(task) {
        var windowHeight = window.innerHeight;
        return ((task.position().top * 100) / windowHeight) + '%';
    }
    
    hideIcons(task) {
        task.siblings('.markTaskIcon, .deleteTaskIcon').css({
            opacity: 0,
            'pointer-events': 'none'
        });
    }
    
    openSwipe(option) {
        var task           = $(".task#" + this.props.task.id);
        var swipe          = task.siblings('.'+option);
        var overlay_before = $("#overlay-before");
        var overlay_after  = $("#overlay-after");
        task.addClass('editing');
        $('body').css({overflow:'hidden'});
        
        this.hideIcons(task);
        overlay_before.css({
            display: 'block',
            height: this.calculateHeight(task)
        });
        overlay_after.css({
            display: 'block',
            top: task.position().top + 60 + 'px'
        });
        swipe.css({
            right: 0
        });
    }
    
    animateActionDelete(){
        var id = this.props.task.id;
        var listId = this.props.taskListId;
        Storage.removeTask(id, listId, false);
        var task  = $('#'+id);
        var swipe = task.siblings('.swipe-delete');
        swipe.css({
            width:'100%'
        });
        setTimeout(function(){
            /*Prevent li bug*/
            swipe.css({
                width:'60px',
                right: '-60px',
                transition: 'width 0s ease-out',        
                transition: 'right 0s ease-out'
            }); 
            $('.trash').css({
                opacity:0
            });
            
            $('.trash-shake').css({
                opacity:1
            });
            
            setTimeout(function(){
                $('.trash').css({
                    opacity:1
                });
                $('.trash-shake').css({
                    opacity:0
                });    
                swipe.css({
                    transition: 'right .3s ease-out',
                    transition: 'width .4s ease-out',
                });
            }.bind(this), 500);
        
            this.props.reloadList();
            $('#overlay-after').trigger('click');
        }.bind(this),400);
    }
    
    animateActionMark(){
        var id = this.props.task.id;
        var listId = this.props.taskListId;
        Storage.markTaskAsDone(id, listId);
        var task  = $('#'+id);
        var swipe = task.siblings('.swipe-mark');
        swipe.css({
            width:'100%',
            right:0
        });
        task.find('.markTaskIcon, .deleteTaskIcon').each(function(){
            $(this).css({
                opacity:0,
                'pointer-events':'none'
            });
        });
        setTimeout(function(){
            $('.check').css({
                opacity:0
            });
            
            $('.check-shake').css({
                opacity:1
            });
            
            setTimeout(function(){
                $('.check').css({
                    opacity:1
                });
                $('.check-shake').css({
                    opacity:0
                }); 
            }.bind(this), 500);
            
            this.props.reloadList();
            $('#overlay-after').trigger('click');
        }.bind(this),400);    
    }
    
    editTask() {
        var task = this.props.task;
        Storage.editTask(task);
        $('#overlay-after').trigger('click');
        this.toggleEditTaskModal();
    }
    
    toggleEditTaskModal(backup) {
        if(backup === true){
            this.props.task.taskLabel = this.props.task.backupRow.label;
            this.props.task.taskDesc  = this.props.task.backupRow.desc;
        }
        this.setState({cantSubmit: true});
        this.setState({editTaskOpen: !this.state.editTaskOpen});
    }
    
    allowEditTask(label, description){
        if((label.value && description.value && this.state.cantSubmit === true) || (!(label.value && description.value) && this.state.cantSubmit === false)){
            this.setState({cantSubmit: !this.state.cantSubmit});
        }    
        return !this.state.cantSubmit;
    }
    
    render() {
        return (
            <div>
            <li onClick={this.toggleEditTaskModal} className={"task"+(this.props.task.done === true ? ' done': '')} id={this.props.task.id}>{this.props.task.taskLabel}
            </li>
            <div className="markTaskIcon" onClick={() => {this.openSwipe('swipe-mark')}}>
                <Ionicon icon="ios-checkmark-circle-outline" fontSize="35px" color="rgb(125, 176, 24)"/>
            </div>
            <div className="deleteTaskIcon" onClick={() => {this.openSwipe('swipe-delete')}}>
                <Ionicon icon="ios-trash-outline" fontSize="35px" color="rgb(125, 176, 24)"/>
            </div>
            <div className="swipe-mark" onClick={() => {this.animateActionMark()}}>
                <Ionicon icon="md-checkmark" fontSize="35px" color="rgb(255, 255, 255)"/>
            </div>
            <div className="swipe-delete" onClick={() => {this.animateActionDelete()}}>
                <Ionicon icon="md-close" fontSize="35px" color="rgb(255, 255, 255)"/>
            </div>
            <MuiThemeProvider theme= {theme}>
                <Dialog
                          open={this.state.editTaskOpen}
                          onClose={this.toggleEditTaskModal}
                          aria-labelledby="form-dialog-title"
                          fullScreen = {true}
                        >
                          <DialogTitle id="form-dialog-title"><I18N language={this.props.language}>Edit Task</I18N></DialogTitle>
                          <DialogContent>
                            <TaskEdit language={this.props.language} task={this.props.task} allowNewTask={this.allowEditTask} />
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={() => {this.toggleEditTaskModal(true)}}>
                              <I18N language={this.props.language}>Back</I18N>
                            </Button>
                            <Button disabled={this.props.cantSubmit} onClick={this.editTask} color="primary" autoFocus>
                              <I18N language={this.props.language}>Save</I18N>
                            </Button>
                          </DialogActions>
                        </Dialog>
            </MuiThemeProvider>
            </div>
        );
    }
}

export default Task;
