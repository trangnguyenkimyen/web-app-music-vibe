import { createContext, useEffect, useReducer } from "react";

const INITIAL_STATE = {
    currentQueue: JSON.parse(localStorage.getItem("currentQueue")) || null,
};

export const QueueContext = createContext(INITIAL_STATE);

const QueueReducer = (state, action) => {
    switch (action.type) {
        case "SET_CURRENTQUEUE":
            return {
                currentQueue: action.payload,
            };
        default:
            return state;
    }
};

export const QueueContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(QueueReducer, INITIAL_STATE);

    useEffect(() => {
        localStorage.setItem("currentQueue", JSON.stringify(state.currentQueue));
    }, [state.currentQueue]);

    return (
        <QueueContext.Provider
            value={{
                currentQueue: state.currentQueue,
                dispatch,
            }}
        >
            {children}
        </QueueContext.Provider>
    )
}
