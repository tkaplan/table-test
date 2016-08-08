require('normalize.css/normalize.css');
require('styles/App.css');

let chance = new (require('chance'))(0)
import React from 'react';

let Store = function() {
    let reg = []
    this.unregister = (key) => {
        delete reg[key]
    }
    this.register = (key, fxn) => {
        reg[key] = fxn
    }
    this.call = (key, params) => {
        if (reg[key])
            reg[key](params)
    }
}

let store = new Store()

let Checkbox = React.createClass({
    getInitialState: function() {
        return {value: false}
    },
    toggle: function() {
        store.call('filter65', {value: !this.state.value})
        this.setState({value: !this.state.value})
    },
    render: function() {
        let check = (<div></div>)
        if (this.state.value) {
            check = (
                <div className={'inner-checkbox'}>
                </div>
            )
        }
        return (
            <div onClick={this.toggle} className={'checkbox'}>
                {check}
            </div>
        )
    }
})

let Table = React.createClass({
    getInitialState: function() {
        let people = []
        for (var i = 0; i < 10; i++) {
            people.push({
                'age': Math.floor(Math.random()*100),
                'name': chance.name()
            })
        }
        store.register('filter65', (filter) => {
            // filter
            if (!filter.value) {
                this.state.order = !this.state.order
                this.state.peopleSorted = this.state.people;
                this.sort()
            } else {
                this.state.peopleSorted = this.state.people.filter((person) => {
                    return person.age > 64
                })
                this.setState(this.state)
            }
        })
        return {
            'people': people,
            'peopleSorted': people,
            'order': true
        }
    },
    sort: function() {
        let people = this.state.people
        let order = this.state.order
        let peopleSorted = []

        // True if ascending
        switch (order) {
            case true:
                peopleSorted = people.sort((person0, person1) => {
                    return person0.age - person1.age
                })
                order = false
                break;
            case false:
                peopleSorted = people.sort((person0, person1) => {
                    return person1.age - person0.age
                })
                order = true
        }

        this.setState({
            'people': people,
            'peopleSorted': peopleSorted,
            'order': order
        })
    },
    render: function() {
        let people = []
        let mode = this.state.order ? 'fa fa-angle-up' : 'fa fa-angle-down'
        let style = {
            fontWeight: 800
        }
        let styleH = {
            background: '#908E92',
            color: 'white'
        }
        for (var i = 0; i < this.state.peopleSorted.length; i ++) {
            people.push((
                <tr key={i}>
                    <td>{this.state.peopleSorted[i].age}</td>
                    <td>{this.state.peopleSorted[i].name}</td>
                </tr>
            ))
        }
        return (
            <table>
                <thead>
                    <tr style={styleH}>
                        <td onClick={this.sort}>Age <span style={style} className={mode}></span></td>
                        <td>Name</td>
                    </tr>
                </thead>
                <tbody>
                    {people}
                </tbody>
            </table>
        )
    }
})

let AppComponent = React.createClass({
  render() {
    return (
        <div>
            <div className={'filter'}>
                <Checkbox />
                <span className={'filter'}>Show only people 65+</span>
            </div>
            <div>
                <Table/>
            </div>
        </div>
    );
  }
})

AppComponent.defaultProps = {
};

export default AppComponent;
