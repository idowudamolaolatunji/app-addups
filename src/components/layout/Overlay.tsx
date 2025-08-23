 
interface Props {
  handleClose: () => void;
  custom?: any;
}

function Overlay({ handleClose, custom } : Props) {
  return (
    <div className='global--overlay' style={custom} onClick={handleClose}>&nbsp;</div>
  )
}

export default Overlay
