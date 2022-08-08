import React, { useState, MouseEvent, useEffect } from 'react';
import { Row, Col } from 'antd';
import { Center } from "../hoc/Center";
import io from 'socket.io-client';

const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]


interface INum{
    num: number;
    error: boolean
}

const socketio = io('http://127.0.0.1:8000/', {
    transports: ['websocket'],
    upgrade: false
})

function Game() {

    const [numHover, setNumHover] = useState<INum | null>(null)

    useEffect(() => {
        socketio.on('connect', () => {
            console.log('connected')
        });

        socketio.on('disconnect', () => {
            console.log('disconnected')
        });
        
    }, [])

    const hovering = (e: MouseEvent<HTMLDivElement>, id: number) => {
        const target = e.target as HTMLDivElement
        const hoveredCell = +target.innerText

        if (hoveredCell % 2 === 0){
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

    const resetNumHover = () => setNumHover(null)

    return (
        <>
            <Center>
                {
                    matrix.map(e => (
                        <>
                            <Row>
                                {e.map(i =>(
                                    <Col
                                        span={8}
                                        onMouseEnter={(e) => hovering(e, i)}
                                        onMouseLeave={resetNumHover}
                                        className={
                                            numHover?.num === i
                                                ?
                                                numHover.error
                                                    ? 'cell-error'
                                                    :
                                                'cell-hover'
                                                :
                                                'cell'
                                        }
                                    >{i}</Col>
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
