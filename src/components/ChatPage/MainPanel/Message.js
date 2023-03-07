import moment from 'moment';

function Message({ message, user }) {
    const timeFromNow = (timestamp) => moment(timestamp).fromNow();
    const isImage = (message) => {
        return (
            message.hasOwnProperty('image') &&
            !message.hasOwnProperty('content')
        );
    };
    const isMessageMine = (message, user) => {
        if (user) {
            return message.user.id === user.uid;
        }
    };

    return (
        <div className="d-flex" style={{ marginBottom: '4px' }}>
            <img
                src={message.user.image}
                alt={message.user.image}
                className="me-3 "
                style={{ width: '60px', height: '60px', borderRadius: '10px' }}
            />
            <div
                style={{
                    backgroundColor: isMessageMine(message, user) && '#ECECEC',
                    width: '100%'
                }}
            >
                <h5 className="fw-bold">
                    {message.user.name}
                    <span
                        style={{
                            marginLeft: '5px',
                            fontSize: '13px',
                            color: 'gray'
                        }}
                    >
                        {timeFromNow(message.timestamp)}
                    </span>
                </h5>
                {isImage(message) ? (
                    <img
                        style={{ maxWidth: '300px' }}
                        alt="image"
                        src={message.image}
                    ></img>
                ) : (
                    <p>{message.content}</p>
                )}
            </div>
        </div>
    );
}

export default Message;
