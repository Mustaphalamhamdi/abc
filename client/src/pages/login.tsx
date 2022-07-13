import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import LoginForm from "../components/LoginFrom";
import RegisterForm from "../components/ReagisterForm";
import vault from "../components/vault";
import styles from "../styles/Home.module.css";
import Vault from "../components/vault";

export interface VaultItem {
  website: string;
  username: string;
  password: string;
}

const Home: NextPage = () => {
  const [step, setStep] = useState<"login" | "register" | "vault"> ("login");
  const [vault, setVault] = useState<VaultItem[]>([]);
  const [vaultKey, setVaultKey] = useState("");



  return (
    <div className={styles.container}>
      <Head>
        <title>My Password Manager</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {step === "login" && (
          <LoginForm
            setVault={setVault}
            setStep={setStep}
            setVaultKey={setVaultKey}
          />
        )}
         {step === "vault" && <Vault vault={vault} vaultKey={vaultKey} />}
      </main>
    </div>
    
  );
};

export default Home;
