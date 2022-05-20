import { MAX_BOARD_UNITS } from "../components/Board";
import { shipTypes } from "../screens/Boards";
import { getDirection } from "./methods";

export const shiptTypesArr = ["carrier", "battleship", "cruiser", "submarine", "destroyer"];

export const generateAllCoords = (startCoords: TPosition, shipLen: number) => {
    if (!startCoords.length) return [startCoords];
    
    let newPos: TPosition[] = [];
        newPos = [startCoords];

    // const startCoords = newPos[0];
    const updatedShipLen = shipLen - 1;
    const isHoriz = getDirection() === 'horizontal';
            
    const toRight = isHoriz && Number(startCoords[0]) + (updatedShipLen - 1) >= MAX_BOARD_UNITS - 1 ? false : true;
    const toBottom = !isHoriz && Number(startCoords[1]) + (updatedShipLen - 1) >= MAX_BOARD_UNITS - 1 ? false : true;
    
    for (let i = 0; i < updatedShipLen; i ++) {
        const xVal = newPos[newPos.length - 1][0];
        const yVal = newPos[newPos.length - 1][1];

        const x = isHoriz ?  xVal + (toRight ? 1 : -1) : xVal;
        const y = !isHoriz ? yVal + (toBottom ? 1 : -1) : yVal;
        
        newPos.push([x, y]);
    }

    return newPos;
};

export const checkIntersection = (allShips: IShipLayout[], newPos: TPosition[]) => {
    const intersection = allShips.filter((el) => {
        if (el.positions) {
            let exists: any = [];
            newPos.forEach(newEl => {
                if (JSON.stringify(el.positions).includes(JSON.stringify(newEl))) {
                    exists.push(newEl);
                }
            });
            return exists.length > 0; 
        }
    });

    return intersection.length;
};

export const generatePlayerShips = (
    playerIDs: string[], 
    generatePositions: ((shipLen: number, allShips: IShipLayout[]) => any)
) => {
    let newShips: IGame["ships"] = {}; // Object containing ships for each Player UUID

    playerIDs.forEach((el) => {
        let playerShips: IShipLayout[] = [];
        shiptTypesArr.forEach((el) => {
            // Start generating the positions
            const { size, color } = shipTypes[el];
            let positions = generatePositions(size, playerShips);
            
            const newShip: IShipLayout = {
                ship: el,
                size: size,
                color: color !== undefined ? color : '',
                hits: 0,
                positions: positions,
            };

            playerShips.push(newShip);
        });
        
        // Add ships to each player uuid
        newShips[el] = playerShips;
        
        // Release var
        playerShips = [];
    });
    
    return newShips;
};