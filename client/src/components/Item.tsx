import React, { FC } from 'react';

import {Link} from 'react-router-dom'

import { Typography } from "antd";
import { Game } from "../types";


const { Text } = Typography;

interface IPropsGame extends Game{
    idx: number
}

const Item: FC<IPropsGame> = ({idx, id, players}) => {
    return (
        <>
            <Link to={id}>
                <Typography.Text>
                    <Text keyboard>{idx + 1}</Text> {players && players[0].name}
                </Typography.Text>
            </Link>
        </>
    );
}

export default Item;
