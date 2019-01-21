import React, { Component } from 'react';
import { Table } from 'reactstrap';

export default class TimeTable extends Component {
    constructor(props) {
        super(props);

        this.UserStore = this.props.UserStore;
        this.DB = this.props.DB;

        this.state = {
            signed_in: [],
            hidden_id: ''
        };

        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleKeyPress(event) {
        if (event.which === 13) {
            const match = this.DB.query({
                id: this.state.hidden_id
            });

            if (match) {
                const index = this.state.signed_in.findIndex(user => user.id === match.id);

                if (index === -1) {
                    this.UserStore.signInUser(match);
                } else {
                    this.UserStore.signOutUser(match);
                }
            }

            this.setState({
                hidden_id: ''
            });
        } else {
            this.setState({
                hidden_id: this.state.hidden_id + String.fromCharCode(event.which)
            });
        }
    }

    componentDidMount() {
        document.addEventListener('keypress', this.handleKeyPress, false);

        setInterval(this.tick.bind(this), 1000);

        this.UserStore.onAddUser(() => {
            this.setState({
                hidden_id: ''
            });
        });

        this.UserStore.onSignInUser(user => {
            this.setState({
                signed_in: this.state.signed_in.concat([Object.assign(user, {
                    time_in: 0
                })])
            });
        });

        this.UserStore.onSignOutUser(user => {
            const index = this.state.signed_in.findIndex(user_ => user_.id === user.id);

            const newUsers = this.state.signed_in.slice();

            newUsers.splice(index, 1);

            this.setState({
                signed_in: newUsers
            });
        });

        this.UserStore.signInUser(this.DB.query({
            name: 'Brandon Lou'
        }));
    }

    tick() {
        this.setState({
            members: this.state.signed_in.map(user =>
                Object.assign(user, {
                time_in: user.time_in + 1
            }))
        });
    }

    static formatTime(seconds) {
        const date = new Date(null);
        date.setSeconds(seconds);
        return date.toISOString().substr(11, 8);
    }

    render() {
        return (
            <Table className='TimeTable'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Time In</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.signed_in.map((user, idx) => (
                            <tr key={ idx }>
                                <td>{ user.name }</td>
                                <td>{ TimeTable.formatTime(user.time_in) }</td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        );
    }
}