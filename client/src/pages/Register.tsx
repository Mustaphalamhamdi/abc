
import { useState, useEffect } from "react";
import LoginForm from "../components/LoginFrom";
import RegisterForm from "../components/ReagisterForm";
import Vault from "../components/vault";
import { Head } from "next/document";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";

export interface VaultItem {
  website: string;
  username: string;
  password: string;
}

const Home: NextPage = () => {
  const [step, setStep] = useState<"login" | "register" | "vault"> ("register");
  const [vault, setVault] = useState<VaultItem[]>([]);
  const [vaultKey, setVaultKey] = useState("");

  useEffect(() => {
    const vault = window.sessionStorage.getItem("vault");
    const vaultKey = window.sessionStorage.getItem("vk");
    if (vault) {
      setVault(JSON.parse(vault));
    }

    if (vaultKey) {
      setVaultKey(vaultKey);
      setStep("vault");
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>My Password Manager</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {step === "register" && (
          <RegisterForm setStep={setStep} setVaultKey={setVaultKey} />
        )}
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
