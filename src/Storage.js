/*global localStorage*/
import React from 'react';

class Storage extends React.Component {
    
    static initStorage(defaultLang){
        var defaultListLabel;
        if(defaultLang === 'en-us')
            defaultListLabel = 'Default List';
        if(defaultLang === 'pt-br')
            defaultListLabel = 'Lista Padrão';
        
        if(localStorage.getItem('tasks') === null)
            localStorage.setItem('tasks', '[]');  
        if(localStorage.getItem('tasksMaxId') === null)
            localStorage.setItem('tasksMaxId', 1);  
        if(localStorage.getItem('listsMaxId') === null)
            localStorage.setItem('listsMaxId', 2);  
        if(localStorage.getItem('lists') === null)
            localStorage.setItem('lists', JSON.stringify([{id:'1', listLabel:defaultListLabel}]));  
    }
    
    static setTask(task){
        var tasks = this.getTasks();
        task.id = this.getId();
        task.inTrash = task.inTrash || false;
        tasks.push(task);
        tasks = JSON.stringify(tasks);
        localStorage.setItem('tasks', tasks);    
    }  
    
     static setList(list){
        var lists = this.getLists();
        list.id = this.getIdLists();
        lists.push(list);
        lists = JSON.stringify(lists);
        localStorage.setItem('lists', lists);    
    }  
    
    static editTask(task){
        var tasks = this.getTasks();
        tasks.forEach(function(oldTask, index){
            if(oldTask.id === task.id && oldTask.listId === task.listId){
                tasks[index] = task;
            }
        });
        tasks = JSON.stringify(tasks);
        localStorage.setItem('tasks', tasks);    
    }
    
    static editList(list){
        var lists = this.getLists();
        lists.forEach(function(oldList, index){
            if(oldList.id === list.id){
                lists[index] = list;
            }
        });
        lists = JSON.stringify(lists);
        localStorage.setItem('lists', lists);    
    }
    
    static getTasks(){
        return JSON.parse(localStorage.getItem('tasks'));
    }
    
    static getLists(){
        return JSON.parse(localStorage.getItem('lists'));
    }
    
    static removeTask(id, listId, forever){
        var tasks = this.getTasks();
        tasks.forEach(function(task, index){
            if(task.id === id && task.listId === listId){
                task.inTrash = true;
                task.done = false;
                if(forever === true)
                    tasks.splice(index, 1);
            }
        });
        tasks = JSON.stringify(tasks);
        localStorage.setItem('tasks', tasks);  
    }
    
    static removeList(id){
        var lists = this.getLists();
        lists.forEach(function(list, index){
            if(list.id === id){
                var tasks = this.getTasks();
                tasks.forEach(function(task){
                    this.removeTask(task.id, list.id, true);    
                }.bind(this));
                lists.splice(index, 1);
            }
        }.bind(this));
        lists = JSON.stringify(lists);
        localStorage.setItem('lists', lists);  
    }
    
    static restoreTask(id, listId){
        var tasks = this.getTasks();
        tasks.forEach(function(task, index){
            if(task.id === id && task.listId === listId){
                task.inTrash = false;
                task.done = false;
            }
        });
        tasks = JSON.stringify(tasks);
        localStorage.setItem('tasks', tasks);     
    } 
    
    static getId(){
        var maxId = localStorage.getItem('tasksMaxId');
        localStorage.setItem('tasksMaxId', parseInt(maxId, 10)+1);
        return maxId;
    }
    
    static getIdLists(){
        var maxId = localStorage.getItem('listsMaxId');
        localStorage.setItem('listsMaxId', parseInt(maxId, 10)+1);
        return maxId;
    }
    
    static markTaskAsDone(id, listId){
        var tasks = this.getTasks();
        tasks.forEach(function(task, index){
            if(task.id === id && task.listId === listId){
                task.done = true;
            }
        });
        tasks = JSON.stringify(tasks);
        localStorage.setItem('tasks', tasks);        
    }
    
    static importTasks(data){
        var listsAdded =  0;
        var tasksAdded = 0;
        try{
            data = JSON.parse(data);
        }catch(err){
            throw 'WRONG_FORMAT';
        }
        var {tasks, lists} = data;
        if(tasks === undefined || lists === undefined)
            throw 'WRONG_FORMAT';
        else{
            lists.forEach(function(list, index){
                if(list.id !== "1"){
                    this.setList(list);
                    listsAdded++;
                }
            }.bind(this));
            tasks.forEach(function(task, index){
                this.setTask(task);
                tasksAdded++;
            }.bind(this));
        }
        return {tasksAdded:tasksAdded, listsAdded:listsAdded};
    }
    
    
}

export default Storage;