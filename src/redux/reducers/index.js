// combineReducers를 통해서 여러가지 다른 종류의 Reducer들을 하나로 합친다. rootReducer와 같은 역할
import { combineReducers } from 'redux';
// import user from './user_reducer';
// import comment from './coemment_reducer';

const rootReducer = combineReducers({
    user,
    comment
});

export default rootReducer;
