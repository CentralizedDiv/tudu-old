import React from 'react';
import Task from './Task';
import Storage from './Storage';

class Items extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {open: false, cantSubmit: true};
    }
    
    getItemsFromActiveList(inTrash){
        var tasks = Storage.getTasks();    
        var tasksList = tasks.map((task, index) => {
            if(task.listId === this.props.activeList.id && task.inTrash === inTrash && task.done !== true)
                return <Task  language={ this.props.language } changeLanguage={ this.props.changeLanguage } task={ task } taskListId={ this.props.activeList.id } reloadList={ this.props.reloadList }></Task>;
        }).filter(function(i){if(typeof i !== "undefined") return i;});
        return tasksList;
    }
    
    render() {
        var inTrash = this.props.inTrash || false;
        var tasksList = this.getItemsFromActiveList(inTrash);
        return (<div>
                    <ul className="list">{ tasksList }</ul>
                </div>);
    }
}

export default Items;