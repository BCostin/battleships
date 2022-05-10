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
    ship: IShipType | string,
    positions: TPosition[]
}

interface IGuess {
    uuid: string,
    position: TPosition
}

interface IGame {
    gameID: string,
    status: "pending" | "ongoing" | "finished",
    players: string[], // array of uuids
    ships: Record<string, unknown>,
    guesses: IGuess[],
    hits: [], // Store all correct guesses / direct hits
    misses: [], // Store all incorrect guesses / direct miss
    whoNext: string, // an existing uuid
}