import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import ToDo from './ToDo'



class App extends Component {
    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <AppBar
                        title="ToDo"
                    />
                </div>

                    <ToDo/>

            </MuiThemeProvider>
        );
    }
}

export default App;