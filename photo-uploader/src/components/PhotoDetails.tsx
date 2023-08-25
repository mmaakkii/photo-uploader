import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';

import axios from 'axios'

import { Button, Center, Heading, Image, Input, InputGroup, InputRightElement, ListItem, Text, Textarea, UnorderedList } from '@chakra-ui/react';

export const PhotoDetails = (): JSX.Element => {
  const router = useRouter();
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [commentText, setCommentText] = useState<string>('')
  const [commentsList, setCommentsList] = useState<Array<string>>([])

  const getPhotoId = (): string => {
    let {
      query: { id },
    } = router;
    if (!id) {
      const { location: {pathname} } = window
      id = pathname.split('/')[pathname.split('/').length - 1]
    }
    return id as string
  }

  const fetchComments = async (id: string) => {
    try {
      const url = `http://localhost:4000/comments/${id}`
      const response = await axios.get(url);
      const { success, comments } = response.data
      if (success) {
        setCommentsList(comments)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const addComment = async () => {
    if (commentText) {
      const id = getPhotoId()
      try {
        const payload = {
          photo: id,
          comment: commentText
        }
        const url = 'http://localhost:4000/comments';
        const response = await axios.post(url, payload)
        const { success, comments } = response.data
        if (success) {
          setCommentsList(comments)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  const handleCommentInput = (e: ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value)
  }

  useEffect(() => {
    const id = getPhotoId()
    const url = `http://localhost:4000/photos/${id}`;
    setPhotoUrl(url);
    fetchComments(id as string)
  }, []);

  return (
    <>
      <Center m={6}>
        <Image src={photoUrl} height={300} alt="photo" borderRadius="2xl" />
      </Center>
      <Center mb={2}>
        <div>
          <InputGroup size="md">
            <Input onChange={handleCommentInput} pr="10rem" placeholder='Add a comment...' />
            <InputRightElement width="7rem">
              <Button colorScheme='blue' h='1.75rem' size='sm' onClick={addComment}>Comment</Button>
            </InputRightElement>
          </InputGroup>
        </div>
      </Center>
      <Center>
        <Heading>Comments</Heading>
      </Center>
      <Center>
        <UnorderedList>
          {commentsList?.map((item, index) => <ListItem key={index}>{item}</ListItem>)}
        </UnorderedList>
      </Center>
    </>
  );
};
