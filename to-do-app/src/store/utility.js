export const updateState = (oldState,updateState) => {
    return {
        ...oldState,
        ...updateState
    }
}