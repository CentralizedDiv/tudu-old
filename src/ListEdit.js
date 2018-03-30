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

class ListEdit extends React.Component {
    constructor() {
        super();
        this.label = '';
    }
    
    onChange(){
      if(this.props.allowNewList(this.label)){
        this.props.list.listLabel = this.label.value;
      }
    }
    
    render() {
        return (
            <div>
              <TextField
                autoFocus
                label={<I18N language={this.props.language}>List Label</I18N>}
                errorText=""
                fullWidth={true}
                inputRef={el => this.label = el}
                onChange = {() => {this.onChange()}}
                underlineFocusStyle={styles.underlineStyle}
                floatingLabelStyle={styles.floatingLabelStyle}
                floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                id="list-label"
              /><br />
            </div>
        );
    }
}

export default ListEdit;
