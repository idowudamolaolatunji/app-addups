 
import React from 'react'
import Overlay from '../layout/Overlay'
import { AiOutlineClose } from 'react-icons/ai';

interface Props {
    children: React.ReactNode;
    handleClose?: () => void;
    removeCloseAbility?: boolean;
    shouldScrollBackground?: boolean; // we used this instead
}

function ExtraSmall({ children, handleClose, removeCloseAbility, shouldScrollBackground=false } : Props) {
    return (
        <React.Fragment>
            <Overlay handleClose={!removeCloseAbility ? (handleClose ?? (() => {})) : (() => {})} />
            <div className={`modal mini ${shouldScrollBackground ? "" : "non-scroll"}`}>
                {!removeCloseAbility && (
                    <button className='modal--close' onClick={handleClose}>
                        <AiOutlineClose />
                    </button>
                )}

                {children}
            </div>
        </React.Fragment>
    )
}

export default ExtraSmall