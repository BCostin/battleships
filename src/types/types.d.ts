interface IPlayer {
    uuid: string,
    username: string,
}

type TPosition = [x: number, y: number];

interface IShipType {
    size: number,
    count: number,
    color?: string,
    image?: string,
}

interface IShipLayout {
    ship: string,
    positions: TPosition[] | undefined,
    color: string,
    hits: number,
    size?: number,
}

interface IGuess {
    uuid: string,
    uuidTarget: string,
    position: TPosition,
    hit: number,
    shipType?: string
}

interface IGame {
    gameID: string,
    status: "pending" | "ongoing" | "finished",
    players: IPlayer[], // array of uuids
    ships: Record<string, IShipLayout[]>,
    guesses: IGuess[],
    hits: [], // Store all correct guesses / direct hits
    misses: [], // Store all incorrect guesses / direct miss
    whoNext: string, // an existing uuid
    winner: IPlayer | null,
}

interface IBoard {
    player: IPlayer,
    ships?: unknown,
}

interface IMyHitHandler {
    uuid: string, position: TPosition, shipType?: string
}

interface IBoardItem {
    playerUUID: string,
    playerShips: IShipLayout[],
    value: TPosition,
    actionDisabled?: boolean,
    shipFragment?: boolean,
    index?: number,
    checkHandler?: (props: IMyHitHandler) => void,
}
