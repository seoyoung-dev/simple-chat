import {
    SET_CURRENTCHATROOM,
    SET_PRIVATECHATROOM,
    SET_USERPOSTS
} from '../actions/types';

const initialUserState = { currentChatRoom: null, isPrivateChatRoom: false };

export default function (state = initialUserState, action) {
    switch (action.type) {
        case SET_CURRENTCHATROOM:
            return {
                ...state,
                currentChatRoom: action.payload
            };

        case SET_PRIVATECHATROOM:
            return {
                ...state,
                isPrivateChatRoom: action.payload
            };

        case SET_USERPOSTS:
            return {
                ...state,
                userPosts: action.payload
            };

        default:
            return state;
    }
}
