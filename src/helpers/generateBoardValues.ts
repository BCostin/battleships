
export const generateBoardValues = () => {
    const boardValues: TPosition[] = [];
    
    for (let i = 0; i < 10; i ++) {
        for (let j = 0; j < 10; j ++) {
            boardValues.push([i, j]);
        }
    }

    return boardValues;
}