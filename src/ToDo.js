import React from 'react'
import {database} from './firebase'

import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {List, ListItem} from 'material-ui/List';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';


const Task = (props) => (
    <ListItem
        style={
            props.taskDone === false ?
                {textDecoration: 'none'}
                :
                {textDecoration: 'line-through', color: '#999'}
        }
        primaryText={props.taskName}
        rightIcon={<ActionDelete onClick={() => props.deleteTask(props.taskId)}/>}
        leftIcon={
            props.taskDone === false ?
                <ActionFavoriteBorder onClick={() => props.toggleDoneTask(props.taskId, props.taskDone)}/>
                :
                <ActionFavorite onClick={() => props.toggleDoneTask(props.taskId, props.taskDone)}/>
        }
    />
)

class ToDo extends React.Component {
    state = {
        tasks: null,
        textFromInput: '',
    }

    componentWillMount() {
        database.ref('/ToDo')
            .on('value', (snapshot) => {
                    const arrTasks = Object.entries(
                        snapshot.val() || {}).map(([key, value]) => {
                        value.key = key;
                        return value
                    })
                    this.setState({tasks: arrTasks})
                }
            )
    }

    deleteTask = (taskId) => {
        database.ref('/ToDo/' + taskId)
            .remove()
    }

    toggleDoneTask = (taskId, taskDone) => {
        database.ref('/ToDo/' + taskId)
            .update({done: !taskDone})
            .then(() => console.log('toggleDoneTask resolved OK'))
    }


    handleAddTask = () => {
        if (!this.state.textFromInput) {
            alert('empty input');
            return
        }

        database.ref('/ToDo')
            .push(
                {
                    name: this.state.textFromInput,
                    done: false
                }
            )
        this.setState({textFromInput: ''})
    }

    render() {
        return (
            <div>
                <TextField
                    hintText={"Write your text..."}
                    fullWidth={true}
                    value={this.state.textFromInput}
                    onChange={(e, value) => this.setState({textFromInput: value})} // onChange={this.handleTextFromInput}
                />
                <RaisedButton
                    label={"add your task"}
                    secondary={true}
                    fullWidth={true}
                    onClick={this.handleAddTask}
                />

                <List style={{textAlign: 'left'}}>
                    {
                        this.state.tasks
                        &&
                        this.state.tasks.map((el) => (
                            <Task
                                taskId={el.key}
                                taskName={el.name}
                                taskDone={el.done}
                                deleteTask={this.deleteTask}
                                toggleDoneTask={this.toggleDoneTask}
                                key={el.key}
                            />
                        ))
                    }
                </List>
            </div>
        )
    }
}

export default ToDo