import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../store/actions/actionCreators';

import './Todo.css';

class Todo extends Component {

    // function to either update or add an item
    handleItem = (e) => {
        e.preventDefault();

        if(this.props.updating) { // update item visually
            
            let updatedList = this.props.listItems.slice();
            fetch('/api/item', { // here we update the db first before making it visual
                method:'PUT',
                body:JSON.stringify({key:this.props.itemToUpdateKey, itemToUpdate:this.props.listItem}),
                headers: new Headers({'Content-Type':'application/json'})
               
            }).then(res => res.json()).then(res=>console.log(res));

            updatedList[this.props.itemToUpdateKey] = this.props.listItem;
            this.props.onConfirmUpdate(updatedList);
        }

        if(this.props.listItem!=='' && !this.props.updating) { 
            this.props.onAddItem(this.props.listItem);
        }
    }

    // fetch the items from the database
    componentWillMount() {
        this.props.onFetchItems();
    }

    render() {
    
        return (
        <div>
            <h1 className="article-title">Paper To Do App</h1>
            <span className="article-meta">By Christian T. <i className="em em-ok_hand"/><i className="em em-thinking_face"/><i className="em em-ok_hand"/></span>
            <h2><i className="em em-spiral_note_pad"></i> My List <i className="em em-spiral_note_pad"></i></h2>
            <div className="container">
                <ul>
                    {this.props.listItems && this.props.listItems.map((item,key)=>
                    <li key={key}> 
                        <button onClick={()=> this.props.onDeleteItem(key)} className="btn-danger btn-small "><i className="em em-x"></i></button>
                        <button onClick={()=> this.props.onUpdateItem(item,key)} className="btn-success btn-small "><i className="em em-pencil2"></i></button>
                        <p className="item ">{item}</p>
                    </li>)}
                </ul>
            </div>
            <div className="row">
                <form className="input-flex-container" onSubmit={this.handleItem}>
                    <input type="text" value={this.props.listItem} onChange={(e)=>this.props.onInputChange(e.target.value)} placeholder="what to do... " />
                    <button type="button" onClick={this.handleItem} className={this.props.listItem===''?"btn-secondary disabled":'btn-secondary'}>{this.props.updating?'Update':'Add'}</button>
                </form>
            </div>
        </div>
    )
}
}

const mapStateToProps = state => {
    return {
        updating: state.updating,
        listItems: state.listItems,
        itemToUpdateKey: state.itemToUpdateKey,
        listItem: state.listItem
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onFetchItems:() => dispatch(actionCreators.fetchItems()),
        onAddItem:(item) => dispatch(actionCreators.addItem(item)),
        onDeleteItem: (key) => dispatch(actionCreators.deleteItem(key)),
        onInputChange:(input) => dispatch(actionCreators.inputChange(input)),
        onUpdateItem: (elem,key) => dispatch(actionCreators.updatingItem(elem,key)),
        onConfirmUpdate: (updatedList) => dispatch(actionCreators.confirmUpdate(updatedList))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Todo);