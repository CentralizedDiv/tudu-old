import React from 'react';
import TextField from 'material-ui/TextField';
import I18N from './I18N/I18N';

const styles = {
  errorStyle: {
    color: '#022d1f',
  },
  underlineStyle: {
    borderColor: '#022d1f',
  },
  floatingLabelStyle: {
    color: '#022d1f',
  },
  floatingLabelFocusStyle: {
    color: '#022d1f',
  },
};

class TaskEdit extends React.Component {
    constructor() {
        super();
        this.label = '';
        this.description = '';
        this.backupRow = '';
    }
    
    onChange(){
      if(this.props.allowNewTask(this.label, this.description)){
        this.props.task.taskLabel = this.label.value;
        this.props.task.taskDesc  = this.description.value;
      }
    }
    
    componentDidMount() {
      if(this.props.task){
        this.props.task.backupRow = {
          label:this.props.task.taskLabel,
          desc :this.props.task.taskDesc
        }
      }  
    }
    
    render() {
        return (
            <div>
              <TextField
                autoFocus
                label={<I18N language={this.props.language}>Task Label</I18N>}
                errorText=""
                defaultValue = {this.props.task ? this.props.task.taskLabel : ''}
                fullWidth={true}
                inputRef={el => this.label = el}
                onChange = {() => {this.onChange()}}
                underlineFocusStyle={styles.underlineStyle}
                floatingLabelStyle={styles.floatingLabelStyle}
                floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                id="task-label"
              /><br />
              <br />
              <TextField
                label={<I18N language={this.props.language}>Task Description</I18N>}
                errorText=""
                defaultValue = {this.props.task ? this.props.task.taskDesc : ''}
                multiLine={true}
                fullWidth={true}
                rows={5}
                inputRef={el => this.description = el}
                onChange = {() => {this.onChange()}}
                underlineFocusStyle={styles.underlineStyle}
                floatingLabelStyle={styles.floatingLabelStyle}
                floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                id="task-description"
              /><br />
            </div>
        );
    }
}

export default TaskEdit;
