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
    const { role, castVote, votingStarted } = context;

    const { toast } = useToast();
    const [votingHasStarted, setVotingStarted] = useState<boolean>(false);

    useEffect(() => {
        async function getter() {
            const res = await votingStarted();
            console.log(res);
            setVotingStarted(res);
        }
        getter();
    }, []);

    async function voteCandidate() {
        if (newCandidates == "" || !ethers.isAddress(newCandidates)) {
            return;
        }
        try {
            await castVote(newCandidates);
            toast({
                title: "Vote successfully",
            });
        } catch (err) {
            console.log(err);
            toast({
                title: "Could not cast vote",
                variant: "destructive",
            });
        } finally {
            setNewCandidates("");
        }
    }
    if (role != Role.VOTER) {
        return <>You are not voter, so you cannot really do anything here</>;
    } else {
        return (
            <>
                {votingHasStarted ? (
                    <div className="flex justify-center items-center">
                        Candidates Address to be voted
                        <Input
                            className="w-96 m-2 border-black"
                            value={newCandidates}
                            onChange={(e) => {
                                setNewCandidates(e.target.value);
                            }}
                        />
                        <Button onClick={voteCandidate}>Vote</Button>
                    </div>
                ) : (
                    <>Voting has not started yet</>
                )}
            </>
        );
    }
}
