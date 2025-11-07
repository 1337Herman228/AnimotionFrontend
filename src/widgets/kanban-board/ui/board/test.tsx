"use client";

import { useState } from "react";
import { Delete, Edit, MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function TestDialog() {
    const [showNewDialog, setShowNewDialog] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        className={"cursor-pointer"}
                        variant="ghost"
                        size="icon"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setShowNewDialog(true)}>
                        <div className="flex items-center gap-2 w-full grow-1 font-normal cursor-pointer">
                            <Edit className="shrink-0 w-4 h-4" />
                            Edit card
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive">
                        <div className="flex items-center gap-2 w-full grow-1 font-normal cursor-pointer text-red-500">
                            <Delete className="text-red-500 shrink-0 w-4 h-4" />
                            Delete Card
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create New File</DialogTitle>
                        <DialogDescription>
                            Provide a name for your new file. Click create when
                            you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Share File</DialogTitle>
                        <DialogDescription>
                            Anyone with the link will be able to view this file.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Send Invite</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
