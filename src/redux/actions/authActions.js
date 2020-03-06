import { USER_LOGEDIN } from "./types";
export const login=(dispatch)=>{
    return {
      login: () => dispatch({ type:USER_LOGEDIN })
    };
}