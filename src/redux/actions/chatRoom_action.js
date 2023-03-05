import { SET_CURRENTCHATROOM, SET_PRIVATECHATROOM } from './types';

export function setCurrentChatRoom(currentChatRoom) {
    return { type: SET_CURRENTCHATROOM, payload: currentChatRoom };
}

export function setPrivateChatRoom(isPrivateChatRoom) {
    return { type: SET_PRIVATECHATROOM, payload: isPrivateChatRoom };
}
