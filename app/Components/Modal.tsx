'use client'
import styled from 'styled-components'

import { white } from '../util/styles'

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModalContent = styled.div`
  background-color: ${white};
  padding: 2rem;
  border-radius: 8px;
`

type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({onClose, children}: ModalProps) {
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>{children}</ModalContent>
    </ModalOverlay>
  );
}
