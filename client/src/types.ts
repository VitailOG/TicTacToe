export interface    Creator {
    name: string,
    figure: 'x' | 'o',
    allow_move: boolean,
    user_id?: string
}

export interface Game{
    id: string,
    players: Creator[],
    start: boolean,
    winning: boolean
}

