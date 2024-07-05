"use client";
import { ethers } from "ethers";
import React, { createContext, useEffect, useState } from "react";
// import Web3Modal from "web3modal";
import { VotingAddress, votingAbi } from "./constants";
import axios from "axios";
declare var window: any;

interface VotingContextType {
    connectWallet: () => void;
    currentAccount: string;
    role: Role;
    fetchRoles: () => Promise<void>;
}

const fetchContract = (signerOrProvider: ethers.ContractRunner) =>
    new ethers.Contract(VotingAddress, votingAbi, signerOrProvider);

export const VotingContext = createContext<VotingContextType | undefined>(
    undefined
);

enum Role {
    OWNER,
    ADMIN,
    CANDIDATE,
    VOTER,
    VIEWER,
}

export const VotingProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [role, setRole] = useState<Role>(Role.VIEWER);
    const [loadingRole, setLoadingRole] = useState<boolean>(false);
    const checkIfWalletIsConnected = async () => {
        if (!window.ethereum) {
            return alert("Please install metamask");
        }
        const accounts = await window.ethereum.request({
            method: "eth_accounts",
        });
        console.log({ accounts });
        if (accounts.length) {
            setCurrentAccount(accounts[0]);
        } else {
            console.log("No accounts found");
        }
    };
    useEffect(() => {
        checkIfWalletIsConnected();
        fetchRoles();
    }, [currentAccount]);

    const connectWallet = async () => {
        if (!window.ethereum) {
            return alert("Please install metamask");
        }
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        setCurrentAccount(accounts[0]);
        window.location.reload();
    };

    const fetchRoles = async () => {
        setLoadingRole(true);
        const provider = new ethers.JsonRpcProvider(
            "https://sepolia.drpc.org",
            "sepolia"
        );
        const contract = fetchContract(provider);
        const ownerAddress = await contract.owner();
        if (ownerAddress.toLowerCase() === currentAccount.toLowerCase()) {
            setRole(Role.OWNER);
            setLoadingRole(false);
            return;
        }
        if (currentAccount) {
            const isAdmin = await contract.hasAdmin(currentAccount);
            if (isAdmin == true) {
                setRole(Role.ADMIN);
                setLoadingRole(false);
                return;
            }
            const isCandidate = await contract.hasCandidates(currentAccount);
            if (isCandidate == true) {
                setRole(Role.CANDIDATE);
                setLoadingRole(false);
                return;
            }
            const isVoter = await contract.hasVoter(currentAccount);
            if (isVoter == true) {
                setRole(Role.VOTER);
                setLoadingRole(false);
                return;
            }
        }
        setLoadingRole(false);
    };

    return (
        <VotingContext.Provider
            value={{
                connectWallet,
                currentAccount,
                role,
                fetchRoles,
            }}
        >
            {children}
        </VotingContext.Provider>
    );
};
