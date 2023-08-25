import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Text,
  Card,
  CardBody,
  Image,
  SimpleGrid,
  Box,
  Stack,
  Button,
} from '@chakra-ui/react';
import { UploadPhotoModal } from './UploadPhotoModal';
import Link from 'next/link';

type ImageCardProps = {
  imageId: string
  imageUrl: string;
  commentsCount: number;
};

const ImageCard = ({
  imageId,
  imageUrl,
  commentsCount,
}: ImageCardProps): JSX.Element => {
  return (
    <Link href={`/photos/${imageId}`}>
      <Card maxW="sm" cursor="pointer">
        <CardBody>
          <Image height={200} width={250} src={imageUrl} alt="photo" borderRadius="lg" />
          <Stack mt="6" spacing="3">
            <Text>Comments: {commentsCount}</Text>
          </Stack>
        </CardBody>
      </Card>
    </Link>
  );
};

export const HomePage = () => {
  const [photosList, setPhotosList] = useState<Array<Record<string, any>>>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  const toggleUploadModal = () => setIsUploadModalOpen(prevState => !prevState)

  const handleFileUpload = async (file: File) => {
    const url = 'http://localhost:4000/upload/';
    const payload = new FormData()
    payload.append('file', file)
    try {
      const response = await axios.post(url, payload)
      if (response.data.success) {
        toggleUploadModal()
        fetchPhotos()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchPhotos = () => {
    const url = 'http://localhost:4000/photos/';
    try {
      axios
        .get(url)
        .then((response) => {
          const {
            data: { photos },
          } = response;
          setPhotosList(photos);
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchPhotos()
  }, []);

  return (
    <Box p={6}>
      <Box p={6} alignItems="flex-end">
        <Button variant="solid" colorScheme="blue" onClick={toggleUploadModal}>
          Upload Photo
        </Button>
      </Box>
      <SimpleGrid
        column={3}
        spacing={12}
        templateColumns="repeat(5, 1fr)"
        gap={6}
      >
        {photosList.map((item, index) => (
          <ImageCard
            imageId={item.imageId}
            imageUrl={item.imageUrl}
            commentsCount={item.commentsCount}
            key={index}
          />
        ))}
      </SimpleGrid>
      <UploadPhotoModal handleFileUpload={handleFileUpload} isOpen={isUploadModalOpen} onClose={toggleUploadModal} />
    </Box>
  );
};
