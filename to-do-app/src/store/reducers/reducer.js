import * as actionTypes from '../actions/actionTypes';
import {updateState} from '../utility'

const initialState = {
    listItem:'',
    listItems:[],
    updating:false,
    itemToUpdateKey:''
}

const reducer = (state=initialState,action) => {
    switch(action.type) {
        case actionTypes.ADD_ITEM:
            return updateState(state, {
                listItems:state.listItems.concat(action.value),
                listItem:'',
                updating:false
            });

        case actionTypes.CONFIRM_UPDATE:
            return updateState(state,{
                listItems: action.updatedList,
                updating:false,
                listItem:''
            });

        case actionTypes.UPDATING_ITEM:
            return updateState(state,{
                listItem: action.elem,
                updating:true,
                itemToUpdateKey: action.key
            });

        case actionTypes.INPUT_CHANGE:
            return updateState(state,{listItem: action.value});
        case actionTypes.DELETE_ITEM:
            return updateState(state,{listItems:state.listItems.filter((item,index)=>index!==action.key)});
        case actionTypes.LOAD_ITEMS:
            return updateState(state,{listItems:action.items});
      
       
        default: return state;
    }
};

export default reducer;