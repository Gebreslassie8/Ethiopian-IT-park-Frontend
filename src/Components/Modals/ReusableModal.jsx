// Components/Modal/ReusableModal.jsx

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

const ReusableModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  body = "Are you sure you want to proceed?",
  cancelText = "Cancel",
  confirmText = "Confirm",
  showCancel = true,
  confirmColor = "blue",
}) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>{body}</ModalBody>
      <ModalFooter>
        {showCancel && (
          <Button variant="ghost" mr={3} onClick={onClose}>
            {cancelText}
          </Button>
        )}
        <Button colorScheme={confirmColor} onClick={onConfirm}>
          {confirmText}
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

ReusableModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  body: PropTypes.string,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  showCancel: PropTypes.bool,
  confirmColor: PropTypes.string,
};

export default ReusableModal;
