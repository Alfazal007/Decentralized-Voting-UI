"use client";

import { Button } from "@/components/ui/button";
import { Role, VotingContext } from "@/context/VotingContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function Home() {
    const context = useContext(VotingContext);
    const router = useRouter();
    if (!context) {
        return <div>Loading...</div>; // Or handle the undefined context appropriately
    }
    const { connectWallet, currentAccount, role } = context;
    return (
        <>
            {currentAccount ? (
                <></>
            ) : (
                <Button onClick={connectWallet}>Connect</Button>
            )}
            {role == Role.OWNER ? (
                <>
                    <Button
                        onClick={() => {
                            router.push("/add-admin");
                        }}
                    >
                        Add new admins
                    </Button>
                </>
            ) : (
                <></>
            )}
            {role == Role.ADMIN ? (
                <>
                    <Button
                        onClick={() => {
                            router.push("/add-candidates");
                        }}
                    >
                        Add new candidates
                    </Button>
                    <Button
                        onClick={() => {
                            router.push("/add-voters");
                        }}
                    >
                        Add new voters
                    </Button>
                </>
            ) : (
                <></>
            )}
            {role == Role.VOTER ? (
                <>
                    <Button
                        onClick={() => {
                            router.push("/cast-vote");
                        }}
                    >
                        Cast vote
                    </Button>
                </>
            ) : (
                <></>
            )}
        </>
    );
}
