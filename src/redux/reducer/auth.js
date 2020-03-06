import * as actionsType from '../actions/types';

const initialState={
    "Email":'',
    "token":null,
    "isAuth":false,

}

const authReducer=(state=initialState,action)=>{

  switch (action.type) {
    case actionsType.USER_LOGEDIN: {
      return {
        ...state,
        token: localStorage.getItem("token"),
        isAuth: true
      };
    }

    case actionsType.USER_LOGEDIN_FAILED: {
      return {
        ...state,
        token: null,
        isAuth: false
      };
    }

    default:
         return state;
  }

}

export default authReducer;