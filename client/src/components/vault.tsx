import { VaultItem } from "../pages/login";
import { useFieldArray, useForm } from "react-hook-form";
import FormWrapper from "./FormWrapper";
import { Box, Button, FormControl, FormLabel, Input, InputGroup, InputRightElement,AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  useDisclosure,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator, } from "@chakra-ui/react";
import { Console } from "console";
import { encryptVault } from "../crypto";
import { useMutation } from "react-query";
import { saveVault } from "../api";
import React from "react";
import { DeleteIcon,ChevronRightIcon  } from '@chakra-ui/icons';
import { NavLink, Route } from "react-router-dom";

function vault({
  vault = [],
  vaultKey = "",
}: {
  vault: VaultItem[];
  vaultKey: string;
}) {
  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      vault,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "vault",
  });
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const mutation = useMutation(saveVault);

  return (
    <>
    <FormWrapper
      onSubmit={handleSubmit(({ vault }) => {
        console.log({ vault });

        const encryptedVault = encryptVault({
          vault: JSON.stringify({ vault }),
          vaultKey,
        });
        window.sessionStorage.setItem("vault", JSON.stringify(vault));

        mutation.mutate({
          encryptedVault,
        });
      })}
    >
        {fields.map((field, index) => {
          return (
            <Box
              mt="4"
              mb="4"
              display="flex"
              key={field.id}
              alignItems="flex-end"
            >
              <FormControl>
                <FormLabel htmlFor="website">Website</FormLabel>
                <Input
                  type="url"
                  id="website"
                  placeholder="Website "
                  {...register(`vault.${index}.website`, {
                    required: "Website Is Required",
                  })} />
              </FormControl>
              <FormControl ml="2">
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input
                  id="username"
                  placeholder="Username "
                  {...register(`vault.${index}.username`, {
                    required: "Username Is Required",
                  })} />
              </FormControl>
              <InputGroup size='md' marginLeft="2">
                <Input
                  pr='4.5rem'
                  type={show ? 'text' : 'password'}
                  placeholder="Password "
                  {...register(`vault.${index}.password`, {
                    required: "Password  Is Required",
                  })} />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>

              <>
                <Button ml="1.5" colorScheme='red' onClick={onOpen}><DeleteIcon /></Button>

                <AlertDialog
                  isOpen={isOpen}
                  leastDestructiveRef={cancelRef}
                  onClose={onClose}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Delete Password
                      </AlertDialogHeader>

                      <AlertDialogBody>
                        Are you sure? You can't undo this action afterwards.
                      </AlertDialogBody>

                      <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                          Cancel
                        </Button>
                        <Button colorScheme='red' onClick={() => { onClose; remove(index); } } ml={3}>
                          Delete
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </>

            </Box>
          );
        })}

        <Button
          onClick={() => append({ website: "", username: "", password: "" })}
        >
          Add
        </Button>
        <Button type="submit" color="teal" ml="8">
          Save Vault
        </Button>
      </FormWrapper>
      <Breadcrumb textDecoration="none" spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
      <BreadcrumbItem>
        <BreadcrumbLink  href='/passwordGenerator' textDecoration="none" fontWeight="bold">Password Generator</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
    </>
  );
}
export default vault;
