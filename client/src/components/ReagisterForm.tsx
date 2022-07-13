import FormWrapper from "./FormWrapper";
import {
  FormControl,
  Heading,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { generateVaultKey, hashPassword } from "../crypto";
import { useMutation } from "react-query";
import { registerUser } from "../api";
import { generateKey } from "crypto";
import { Dispatch, SetStateAction } from "react";
import { VaultItem } from "../pages/login";
import Link from "next/link";

function RegisterForm({
  setVaultKey,
  setStep,
}: {
  setVaultKey: Dispatch<SetStateAction<string>>;
  setStep: Dispatch<SetStateAction<"login" | "register" | "vault">>;
}) {
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string; password: string; hashedPassword: string }>();

  const mutation = useMutation(registerUser, {
    onSuccess: ({ salt, vault }) => {
      const hashedPassword = getValues("hashedPassword");
      const email = getValues("email");
      const vaultKey = generateVaultKey({
        hashedPassword,
        email,
        salt,
      });

      window.sessionStorage.setItem("vk", vaultKey);
      window.sessionStorage.setItem("vault", "");

      setStep("vault");
      setVaultKey(vaultKey);
    },
  });

  return (
    <FormWrapper
     backgroundColor="#EC7063"
      onSubmit={handleSubmit(() => {
        const password = getValues("password");
        const email = getValues("email");

        const hashedPassword = hashPassword(password);

        setValue("hashedPassword", hashedPassword);

        mutation.mutate({
          email,
          hashedPassword,
        });
      })}
    >
      <Heading color="#D0D3D4">Reagister</Heading>

      <FormControl mt="4">
        <FormLabel htmlFor="email" color="#D0D3D4">Email</FormLabel>
        <Input
        backgroundColor="white"
          id="email"
          placeholder="Email"
          {...register("email", {
            required: "Email Is Required",
            minLength: { value: 4, message: "Email Must be 4 Characters Long" },
          })}
        />
        <FormErrorMessage>
          {errors.password && errors.password.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl mt="4">
        <FormLabel htmlFor="password" color="#D0D3D4">PassWord</FormLabel>
        <Input
        backgroundColor="white"
          id="password"
          placeholder="Password"
          type="password"
          {...register("password", {
            required: "Password Is Required",
            minLength: {
              value: 8,
              message: "PassWord Must be 8 Characters Long",
            },
          })}
        />
        <FormErrorMessage>
          {errors.password && errors.password.message}
        </FormErrorMessage>
      </FormControl>

      <Button type="submit"  id="loginButton">Register</Button>
      <Link href="/login" >
      <a id="register">Login</a>
      </Link>
    </FormWrapper>
  );
}

export default RegisterForm;
