import React, { useEffect, useState } from 'react';

import { List } from 'antd'
import Item from "../components/Item";
import { Game } from "../types";
import { Center } from "../hoc/Center"
import { socketio } from '../socket'
import NewGame from "../components/NewGame";


function Home() {

    const [game, setGame] = useState<Game[]>([])

    useEffect(() => {
        const name = localStorage.getItem('username') ?? ''
        if (name === ''){
            const username = prompt('name -> ')
            localStorage.setItem('username', username!)
        }
    }, [])

    useEffect(() => {
        socketio.on('connect', () => {});

        socketio.on('disconnect', () => {});

        socketio.emit('games', (data: any) =>{
            setGame(JSON.parse(data))
        })

        socketio.on('ng', (d: any) =>{
            setGame([...d])
        })

    }, [])


    return (
        <>
            <Center>
                <NewGame />
                <List
                    header={<div style={{ textAlign: 'center' }}>Список ігор</div>}
                    footer={<div style={{ textAlign: 'center' }}>Хрестики нолики онлайн</div>}
                    bordered
                    dataSource={game}
                    renderItem={(item: Game, i: number) => (
                        <List.Item>
                            <Item idx={i} {...item}/>
                        </List.Item>
                    )}
                />
            </Center>
        </>
    );
}

export default Home;
