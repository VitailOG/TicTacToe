import React, { FC, ReactNode } from 'react';

import { Row, Col } from 'antd'


interface CenterProps{
    children: ReactNode,
}


export const Center: FC<CenterProps> = ({ children }) => {
    return (
        <>
            <Row>
                <Col span={12} offset={6}>
                    {children}
                </Col>
            </Row>
        </>
    );
}
