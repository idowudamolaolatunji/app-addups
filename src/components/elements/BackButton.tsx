import { MdKeyboardBackspace } from 'react-icons/md';

function BackButton({ handleBack } : { handleBack: () => void }) {
    return (
        <button className='page__section-back' onClick={handleBack} >
            <MdKeyboardBackspace />
        </button>
    )
}

export default BackButton