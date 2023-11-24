export interface Message {
    id: string;
    sender: string;
    chain: {
        id: string,
        name: string
    };
    time_data: {
        iat: Date
    };
    message: string;
    isLoading?: boolean;
}

export interface MessageComponentProps {
    message: Message;
    forceSender?: boolean;
    noAvatar?: boolean;
    doGlass?: boolean;
}