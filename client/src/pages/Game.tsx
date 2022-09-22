import React, { useState, MouseEvent, useEffect, useRef, FC } from 'react';

import { Row, Col, message } from 'antd';
import { Center } from "../hoc/Center";
import { useParams } from "react-router-dom";
import {socketio} from "../socket";
import {Creator, Game as GameType} from '../types'


const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

interface INum{
    num: number,
    error: boolean
}

interface JoinToGameValues{
    username: string,
    game_id: string
}

const Game: FC = () => {

    const [currentGame, setCurr] = useState<GameType>({} as GameType)

    const [user, setUser] = useState<Creator>({} as Creator)
    const [start, setStart] = useState<boolean>(false)

    const [numHover, setNumHover] = useState<INum | null>(null)

    const { id } = useParams()

    const ref = useRef<HTMLDivElement[]>([])

    useEffect(() =>{
        console.log('srart')
        socketio.emit('detail_game', id, (game: GameType) => {
            setCurr(game)
            const user = game.players.find(x => x.name === localStorage.getItem('username')) ?? false

            if (!user){
                const data: JoinToGameValues = {
                    username: localStorage.getItem('username')!,
                    game_id: game.id
                }

                socketio.emit('join_to_game', data, (d: any) =>{
                    setCurr(d)
                })
            }
        })

        socketio.on('start_or_finish_game', (d: any) =>{
            setStart(d)
        })

        socketio.on('set_user_data', (d: any) =>{
            setUser({...d})
        })

        socketio.on('set_figure', (d: any) =>{
            ref.current[+d.cell].innerText = d.figure
        })

        socketio.on('block_step', (data: any) =>{
            setUser( {...data, allow_move: false})
        })

        socketio.on('allow_step', (data: any) =>{
            setUser( {...data, allow_move: true})
        })

        socketio.on('win', () =>{
            console.log('=====')
            message.success('You win');
        })

        socketio.on('loss', () =>{
            message.error('You loss');
        })

        socketio.on('draw', () =>{
            message.warning('Draw');
        })

        return () => {}

    }, [id])

    console.log(user)

    const hovering = (e: MouseEvent<HTMLDivElement>, id: number) => {
        if (!start || !user.allow_move) return

        const target = e.target as HTMLDivElement
        const hoveredCell = target.innerText

        if (hoveredCell !== ''){
            setNumHover({
                num: id,
                error: true
            })
        }else{
            setNumHover({
                num: id,
                error: false
            })
        }
    }

    const setFigure = (e: any) =>{
        if (!start || !user.allow_move) return

        const d = {
            figure: user.figure,
            cell: e.target.id,
            game_id: currentGame.id
        }

        socketio.emit('step', d)
    }

    const resetNumHover = () => setNumHover(null)

    return (
        <>
            <Center>
                <br/>
                <br/>
                { currentGame?.players && currentGame?.players[0].name } <br/>
                { !start ? "Гра заблокована": "Можна грати" }
                <br/>
                <br/>
                {
                    matrix.map(e => (
                        <>
                            <Row>
                                {e.map(i =>(
                                    <Col
                                        ref={(element: any) => {
                                            ref.current[i] = element;
                                        }}
                                        id={String(i)}
                                        span={8}
                                        onMouseEnter={(e) => hovering(e, i)}
                                        onClick={setFigure}
                                        onMouseLeave={resetNumHover}
                                        className={
                                            !start
                                                ? "game-disable"
                                                :
                                                numHover?.num === i
                                                    ?
                                                    numHover.error
                                                        ? 'cell-error'
                                                        :
                                                        'cell-hover'
                                                    :
                                                    'cell'
                                        }
                                    ></Col>
                                ))}
                            </Row>
                        </>
                    ))
                }
            </Center>
        </>
    );
}

export default Game;
