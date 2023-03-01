import { SET_CURRENTCHATROOM } from '../actions/types';

const initialUserState = { currentChatRoom: null };

export default function (state = initialUserState, action) {
    switch (action.type) {
        case SET_CURRENTCHATROOM:
            return {
                ...state,
                currentChatRoom: action.payload
            };

        default:
            return state;
    }
}
