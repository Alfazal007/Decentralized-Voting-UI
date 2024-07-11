"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Role, VotingContext } from "@/context/VotingContext";
import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";

export default function () {
    const [newVoter, setNewVoter] = useState<string>("");
    const context = useContext(VotingContext);
    if (!context) {
        return <div>Loading...</div>; // Or handle the undefined context appropriately
    }
    const { role, addVoter } = context;

    const { toast } = useToast();
    const [VoterStarted, setVoterAddingStarted] = useState<boolean>(false);

    async function addVoterner() {
        if (newVoter == "" || !ethers.isAddress(newVoter)) {
            return;
        }
        try {
            await addVoter(newVoter);
            toast({
                title: "Added Voter successfully",
            });
        } catch (err) {
            console.log(err);
            toast({
                title: "Could not add new Voter",
                variant: "destructive",
            });
        } finally {
            setNewVoter("");
        }
    }
    if (role != Role.ADMIN) {
        return <>You are not admin, so you cannot really do anything here</>;
    } else {
        return (
            <>
                <div className="flex justify-center items-center">
                    New Voter Address
                    <Input
                        className="w-96 m-2 border-black"
                        value={newVoter}
                        onChange={(e) => {
                            setNewVoter(e.target.value);
                        }}
                    />
                    <Button onClick={addVoterner}>Add Voter</Button>
                </div>
            </>
        );
    }
}
