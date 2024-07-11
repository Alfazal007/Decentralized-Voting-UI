"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Role, VotingContext } from "@/context/VotingContext";
import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";

export default function () {
    const [newCandidates, setNewCandidates] = useState<string>("");
    const context = useContext(VotingContext);
    if (!context) {
        return <div>Loading...</div>; // Or handle the undefined context appropriately
    }
    const {
        role,
        addCandidates,
        candidatesAddingStarted,
        startAddingCandidates,
        stopAddingCandidates,
        startVoting,
        votingStarted,
        stopVoting,
    } = context;

    const { toast } = useToast();
    const [candidatesStarted, setCandidatesAddingStarted] =
        useState<boolean>(false);
    const [votingHasStarted, setVotingHasStarted] = useState<boolean>(false);

    useEffect(() => {
        async function getter() {
            const res = await candidatesAddingStarted();
            console.log(res);
            setCandidatesAddingStarted(res);
            const res1 = await votingStarted();
            setVotingHasStarted(res1);
        }
        getter();
    }, []);

    async function addCandidatesner() {
        if (newCandidates == "" || !ethers.isAddress(newCandidates)) {
            return;
        }
        try {
            await addCandidates(newCandidates);
            toast({
                title: "Added Candidates successfully",
            });
        } catch (err) {
            console.log(err);
            toast({
                title: "Could not add new Candidates",
                variant: "destructive",
            });
        } finally {
            setNewCandidates("");
        }
    }
    if (role != Role.ADMIN) {
        return <>You are not admin, so you cannot really do anything here</>;
    } else {
        return (
            <>
                <div className="font-mono text-2xl flex justify-center items-center mt-4 mb-4">
                    {candidatesStarted ? (
                        <Button onClick={stopAddingCandidates}>
                            End adding candidates
                        </Button>
                    ) : (
                        <>
                            <Button onClick={startAddingCandidates}>
                                Start adding candidates
                            </Button>
                        </>
                    )}
                </div>
                <div className="flex justify-center items-center">
                    New Candidates Address
                    <Input
                        className="w-96 m-2 border-black"
                        value={newCandidates}
                        onChange={(e) => {
                            setNewCandidates(e.target.value);
                        }}
                    />
                    <Button onClick={addCandidatesner}>Add Candidates</Button>
                    {votingHasStarted ? (
                        <Button onClick={stopVoting}>End voting</Button>
                    ) : (
                        <>
                            <Button onClick={startVoting}>Start voting</Button>
                        </>
                    )}
                </div>
            </>
        );
    }
}
