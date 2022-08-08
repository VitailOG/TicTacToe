import React, { useState } from 'react';

import { List } from 'antd'
import Item from "../components/Item";
import { Game } from "../types";
import { Center } from "../hoc/Center"


function Home() {

    const gameList: Game[] = [
        {
            id: 1,
            creator: "Player 1"
        },
        {
            id: 2,
            creator: "Player 2"
        },
        {
            id: 3,
            creator: "Player 3"
        }
    ]

    const [game, setGame] = useState<Game[]>(gameList)

    return (
        <>
            <Center>
                <List
                    header={<div style={{ textAlign: 'center' }}>Список ігор</div>}
                    footer={<div style={{ textAlign: 'center' }}>Хрестики нолики онлайн</div>}
                    bordered
                    dataSource={game}
                    renderItem={(item: Game) => (
                        <List.Item>
                            <Item {...item}/>
                        </List.Item>
                    )}
                />
            </Center>
        </>
    );
}

export default Home;
