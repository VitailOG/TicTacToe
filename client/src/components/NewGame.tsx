import React, { FC, useState } from 'react';
import { Button, Modal } from "antd";
import { socketio } from "../socket";
import { useNavigate } from "react-router-dom"


const NewGame: FC = () => {

    const navigate = useNavigate()

    const [isModalVisible, setIsModalVisible] = useState(false)
    const [figure, setFigure] = useState<'X' | 'O' | null>(null)

    const showModal = () => {
        setIsModalVisible(true)
    };

    const handleCancel = () => {
        setIsModalVisible(false)
    };

    const handleOk = async () => {
        await socketio.emit('new_game', figure, (res: any) => {
            navigate(res)
        })
        setIsModalVisible(false);
        setFigure(prevState => null)
    }

    return (
        <>
            <Button type="primary" size={'large'} className={'add-button'} onClick={showModal}>
                Створити гру
            </Button>
            <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Button
                    type="primary"
                    size={figure !== 'X' ? 'middle' : 'large'}
                    className={'add-button'}
                    onClick={() => setFigure('X')}
                    shape="circle"
                >
                    X
                </Button>
                <Button
                    type="primary"
                    size={figure !== 'O' ? 'middle' : 'large'}
                    className={'add-button'}
                    onClick={() => setFigure('O')}
                    shape="circle"
                >
                    O
                </Button>
            </Modal>
        </>
    );
}

export default NewGame;
