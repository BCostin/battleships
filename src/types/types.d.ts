interface IPlayer {
    uuid: string,
    username: string,
}

type TPosition = [x: number, y: number];

interface IShipType {
    size: number,
    count: number,
}

interface IShipLayout {
    ship: string,
    positions: TPosition[] | undefined,
    size?: number,
}

interface IGuess {
    uuid: string,
    uuidTarget: string,
    position: TPosition,
    hit: number,
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
}

interface IBoard {
    player: IPlayer,
    ships: unknown,
}

interface IBoardItem {
    playerUUID: string,
    playerShips: IShipLayout[],
    value: TPosition,
    guessData?: IGuess,
    actionDisabled?: boolean,
    shipFragment?: boolean,
    index?: number,
    checkHandler?: (uuid: string, position: TPosition) => void,
}

interface IAddGuess {
    uuid: string,
    uuidTarget: string,
    position: TPosition,
    hit: number,
}