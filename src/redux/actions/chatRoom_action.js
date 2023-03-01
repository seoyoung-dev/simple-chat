import { SET_CURRENTCHATROOM } from './types';

export function setCurrentChatRoom(currentChatRoom) {
    return { type: SET_CURRENTCHATROOM, payload: currentChatRoom };
}
