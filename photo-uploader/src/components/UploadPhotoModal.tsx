import {
  Button,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Text,
  ModalHeader,
  ModalOverlay,
  VisuallyHiddenInput,
} from '@chakra-ui/react';
import { ChangeEvent, useRef, useState } from 'react';

type UploadPhotoModalProps = {
  handleFileUpload: (file: File) => void;
  onClose: () => void;
  isOpen: boolean;
};

export const UploadPhotoModal = ({
  onClose,
  handleFileUpload,
  isOpen,
}: UploadPhotoModalProps): JSX.Element => {
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File>();

  const handleUploadClick = () => {
    photoInputRef?.current?.click();
  };

  const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setSelectedFile(e.target.files[0]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload a Photo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Center>
            <VisuallyHiddenInput
              ref={photoInputRef}
              type="file"
              onChange={handleSelectFile}
            />
            <Button
              variant="solid"
              colorScheme="green"
              onClick={handleUploadClick}
            >
              Select a photo
            </Button>
          </Center>
          <Center>
            <Text m={4}>{selectedFile?.name}</Text>
          </Center>
          <Center m={6}>
            <Button isLoading={false} onClick={() => handleFileUpload(selectedFile as File)} colorScheme="blue" mr={3}>
              Upload
            </Button>
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
