"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { GoogleLogin } from "@react-oauth/google";

interface LoginDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
    type GoogleResponse = { credential?: string } | undefined | null;
    const success = async (credentialResponse: GoogleResponse) => {
        try {
            const credential = credentialResponse && typeof credentialResponse === 'object' ? credentialResponse.credential : undefined;
            if (!credential) return alert('Missing credential from Google');

            const res = await fetch('/api/auth/google', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credential }) });
            const j = await res.json();
            if (j && j.success) {
                alert('Login successful');
                onClose();
                // refresh page to pick up cookie-based auth
                window.location.reload();
            } else {
                alert(j?.message || 'Login failed');
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            alert(message);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Login to Your Account</DialogTitle>
                    <DialogDescription>Choose your preferred login method</DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center py-4">
                    <GoogleLogin
                        width="100%"
                        size="large"
                        text="continue_with"
                        onSuccess={success}
                        onError={() => alert('Login Failed')}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
