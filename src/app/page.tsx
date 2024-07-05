"use client";

import { VotingContext } from "@/context/VotingContext";
import { useContext } from "react";

export default function Home() {
    const context = useContext(VotingContext);
    if (!context) {
        return <div>Loading...</div>; // Or handle the undefined context appropriately
    }
    const { connectWallet } = context;
    return (
        <>
            <button onClick={connectWallet}>Connect</button>
        </>
    );
}
