"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Role, VotingContext } from "@/context/VotingContext";
import { ethers } from "ethers";
import { useContext, useState } from "react";

export default function () {
    const [newAdmin, setNewAdmin] = useState<string>("");
    const context = useContext(VotingContext);
    if (!context) {
        return <div>Loading...</div>; // Or handle the undefined context appropriately
    }
    const { role, addAdmin } = context;

    const { toast } = useToast();

    async function addAdminner() {
        if (newAdmin == "" || !ethers.isAddress(newAdmin)) {
            return;
        }
        try {
            await addAdmin(newAdmin);
            toast({
                title: "Added admin successfully",
            });
        } catch (err) {
            console.log(err);
            toast({
                title: "Could not add new admin",
                variant: "destructive",
            });
        } finally {
            setNewAdmin("");
        }
    }
    if (role != Role.OWNER) {
        return <>You are not owner, so you cannot really do anything here</>;
    } else {
        return (
            <>
                <div className="flex justify-center items-center h-screen">
                    New Admin Address
                    <Input
                        className="w-96 m-2 border-black"
                        value={newAdmin}
                        onChange={(e) => {
                            setNewAdmin(e.target.value);
                        }}
                    />
                    <Button onClick={addAdminner}>Add admin</Button>
                </div>
            </>
        );
    }
}
