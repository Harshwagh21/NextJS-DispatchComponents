import { ReactNode } from "react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface ChartDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trigger: ReactNode;
    title: string;
    description?: string;
    children: ReactNode;
    contentClassName?: string;
}

export default function ChartDialog({
    open,
    onOpenChange,
    trigger,
    title,
    description,
    children,
    contentClassName = "max-w-4xl w-full",
}: ChartDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className={contentClassName}>
                <DialogTitle>{title}</DialogTitle>
                {description && <DialogDescription>{description}</DialogDescription>}
                <div>
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
} 