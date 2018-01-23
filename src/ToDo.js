import React from 'react'
import {database} from './firebase'

import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {List, ListItem} from 'material-ui/List';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Card, CardHeader, CardText} from 'material-ui/Card';


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

        taskName:'',
        tasksSelect:0,
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
                    done: false,
                    dateAdd: Date.now()
                }
            )
        this.setState({textFromInput: ''})
    }

    handleTaskName = (event, value) => {
        this.setState({taskName: value});
    };

    handleTasksSelect = (event, index, value) => this.setState({tasksSelect: value})

    render() {
        return (
            <div>
                <TextField
                    hintText={"Add your task..."}

                    value={this.state.textFromInput}
                    onChange={(e, value) => this.setState({textFromInput: value})}

                />
                <RaisedButton
                    label={"add"}
                    secondary={true}
                    onClick={this.handleAddTask}
                />

                <List style={{textAlign: 'left'}}>
                    {
                        this.state.tasks
                        &&
                        this.state.tasks
                            .filter((el) => el.name.indexOf(this.state.taskName) !== -1)
                            .filter((el) => (
                                this.state.tasksSelect === 0 ?
                                    true
                                    :
                                    this.state.tasksSelect === 1 ?
                                        el.done===false
                                        :
                                        el.done===true
                            ))
                            .map((el) => (
                                <Task
                                    taskId={el.key}
                                    taskName={el.name}
                                    taskDone={el.done}
                                    taskDate={el.dateAdd}
                                    deleteTask={this.deleteTask}
                                    toggleDoneTask={this.toggleDoneTask}
                                    key={el.key}
                                />
                            ))
                    }
                </List>

                <Card>
                    <CardHeader
                        title="Your Tasks"
                        actAsExpander={true}
                        showExpandableButton={true}
                        secondary={true}
                        style={{backgroundColor: "pink"}}
                    />
                    <CardText expandable={true} style={{textAlign: 'left'}}>
                        <TextField
                            floatingLabelText="Find your Task ..."
                            fullWidth={true}
                            onChange={this.handleTaskName}
                            primary={true}
                            style={{backgroundColor: "pink"}}
                        />
                        <SelectField
                            floatingLabelText="Tasks"
                            value={this.state.tasksSelect}
                            onChange={this.handleTasksSelect}
                            style={{backgroundColor: "pink"}}
                        >
                            <MenuItem value={0} primaryText="All Tasks" style={{color: "#BDBDBD"}}/>
                            <MenuItem value={1} primaryText="Undone"/>
                            <MenuItem value={2} primaryText="Done"/>
                        </SelectField>
                    </CardText>
                </Card>
            </div>
        )
    }
}

export default ToDo