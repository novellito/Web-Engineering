import React, {Component} from 'react';
import './Todo.css';

class Todo extends Component {

    state  = {
        listItem:'',
        listItems:[],
        updating:false,
        itemToUpdateKey:''
    }

    // add an item visually & update database also handles the updating of item
    addItem = (e) => {
        e.preventDefault();

        if(this.state.updating) { // update item visually
            let updatedList = this.state.listItems.slice();

            fetch('/api/item', { // here we update the db first before making it visual
                method:'PUT',
                body:JSON.stringify({key:this.state.itemToUpdateKey, itemToUpdate:this.state.listItem}),
                headers: new Headers({'Content-Type':'application/json'})
               
            }).then(res => res.json()).then(res=>console.log(res));

            updatedList[this.state.itemToUpdateKey] = this.state.listItem;
            this.setState({listItems: updatedList, listItem:'',updating:false});
         
        }

        if(this.state.listItem!=='' && !this.state.updating) { 
            this.setState({listItems: [...this.state.listItems,this.state.listItem],listItem:'',updating:false});

            fetch('/api/item', {
                method:'POST',
                body:JSON.stringify({item:this.state.listItem}),
                headers: new Headers({'Content-Type':'application/json'})
               
            }).then(res => res.json()).then(res=>console.log(res))
        }
    }

    // delete an item visually & update database
    deleteItem = (key) => {
        this.setState({listItems:this.state.listItems.filter((item,index)=> index !== key )});

        fetch('/api/item', {
            method:'DELETE',
            body:JSON.stringify({key}),
            headers: new Headers({'Content-Type':'application/json'})
           
        }).then(res => res.json()).then(res=>console.log(res))

    }
    // helper method to set the key of the item to update & fill out input field
    updateItem = (elem,key) => {
        this.setState({listItem:elem,updating:true,itemToUpdateKey:key});
    }

    // updates the current input fields value to state
    onInputChange = (e) => {
        this.setState({listItem:e.target.value});
    }

    // fetch the items from the database
    componentWillMount() {
        fetch(`/api/item`)
            .then(res => res.json())
            .then(data => this.setState({ listItems: data.items }, () => console.log("items received...", data)));
    }

    render() {
    
        return (
            <div>
            <h1 className="article-title">Paper To Do App</h1>
            <span className="article-meta">By Christian T. <i className="em em-ok_hand"/><i className="em em-thinking_face"/><i className="em em-ok_hand"/></span>
            <h2><i className="em em-spiral_note_pad"></i> My List <i className="em em-spiral_note_pad"></i></h2>

            <div className="container">
                <ul>
                    {this.state.listItems && this.state.listItems.map((item,key)=> 
                    <li key={key}> 
                        <button onClick={()=>this.deleteItem(key)} className="btn-danger btn-small "><i className="em em-x"></i></button>
                        <button onClick={()=>this.updateItem(item,key)} className="btn-success btn-small "><i className="em em-pencil2"></i></button>
                        <p className="item ">{item}</p>
                    </li>)}
                </ul>
            </div>

            <div className="row">
                <form className="input-flex-container" onSubmit={this.addItem}>
                    <input type="text" value={this.state.listItem} onChange={this.onInputChange} placeholder="what to do... " />
                    <button type="button" onClick={this.addItem} className={this.state.listItem===''?"btn-secondary disabled":'btn-secondary'}>{this.state.updating?'Update':'Add'}</button>
                </form>
            </div>

        </div>
    )
}
}

export default Todo;