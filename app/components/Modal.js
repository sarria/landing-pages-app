import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        width: '80%',
        height: '80%',
        margin: '0 auto',
        transform: 'translate(-50%, -50%)',
        // border: 'solid 3px red',
    },
}

const MyModal = ({ isOpen, onRequestClose, contentLabel, children }) => {
    // useEffect(() => {
    //     Modal.setAppElement('#__next') // Ensure this runs after the DOM is fully loaded
    // }, [])

    return (
        <Modal
            ariaHideApp={false}
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
            contentLabel={contentLabel}
        >
            {children}
            {/* <button onClick={onRequestClose}>Close</button> */}
        </Modal>
    )
}

MyModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    contentLabel: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default MyModal
