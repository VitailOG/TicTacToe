import React, { FC } from 'react';

import {Link} from 'react-router-dom'

import { Typography } from "antd";
import { Game } from "../types";


const { Text } = Typography;

const Item: FC<Game> = ({id, creator}) => {
    return (
        <>
            <Link to={String(id)}>
                <Typography.Text>
                    <Text keyboard>{id}</Text> {creator}
                </Typography.Text>
            </Link>
        </>
    );
}

export default Item;
