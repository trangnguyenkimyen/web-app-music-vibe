import { createContext, useEffect, useReducer } from "react";

const INITIAL_STATE = {
    player: JSON.parse(localStorage.getItem("player")) || null,
};

export const AudioPlayerContext = createContext(INITIAL_STATE);

const AudioPlayerReducer = (state, action) => {

    switch (action.type) {
        case "SET_PLAYER":
            return {
                player: action.payload,
            };
        default:
            return state;
    }
};

export const AudioPlayerContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AudioPlayerReducer, INITIAL_STATE);

    useEffect(() => {
        localStorage.setItem("player", JSON.stringify(state.player));
    }, [state.player]);

    return (
        <AudioPlayerContext.Provider
            value={{
                player: state.player,
                dispatch,
            }}
        >
            {children}
        </AudioPlayerContext.Provider>
    )
}
