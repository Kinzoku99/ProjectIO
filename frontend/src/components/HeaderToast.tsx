import React, {useState} from "react";
import {Toast} from 'react-bootstrap'

interface IProps {
    toastHeader: string
    toastMessage: string
    imageURL?: string
}

const HeaderToast: React.FC<IProps> = (props) => {
    let [visible, setVisible] = useState(true);

    const toggleVisibility = () => setVisible(!visible);

    return (
        <Toast show={visible} onClose={toggleVisibility} animation={true}>
            <Toast.Header>
                <svg className="bd-placeholder-img rounded me-2" width="20" height="20"
                     xmlns={props.imageURL ?? "http://www.w3.org/2000/svg"} aria-hidden="true" preserveAspectRatio="xMidYMid slice"
                     focusable="false">
                    <rect width="100%" height="100%" fill="#007aff"/>
                </svg>
                <strong className="me-auto">{props.toastHeader}</strong>
            </Toast.Header>
            <Toast.Body>{props.toastMessage}</Toast.Body>
        </Toast>
    )
}

export default HeaderToast;