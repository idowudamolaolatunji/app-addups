 
import React from 'react'
import Overlay from '../layout/Overlay'
import { AiOutlineClose } from 'react-icons/ai';

interface Props {
    children: React.ReactNode;
    handleClose: () => void;
    removeCloseAbility?: boolean;
}

function ExtraSmall({ children, handleClose, removeCloseAbility } : Props) {
    return (
        <React.Fragment>
            <Overlay handleClose={!removeCloseAbility ? handleClose : () => {}} />
            <div className="modal mini">
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