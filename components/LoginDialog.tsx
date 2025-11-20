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
                // store a non-HttpOnly cookie with basic user info so other apps on localhost can read it (demo only)
                try {
                    const safe = { id: j.user?.id, email: j.user?.email, name: j.user?.name };
                    document.cookie = `tb_user=${encodeURIComponent(JSON.stringify(safe))}; path=/; max-age=${60 * 60 * 24}; samesite=lax`;
                } catch (e) { /* ignore */ }
                // stay on TalentBridge after login (do not redirect back to Learning)
                alert('Login successful');
                onClose();
                // reload the current page so AuthProvider picks up the new cookie/session
                try { window.location.reload(); } catch (e) { /* ignore */ }
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
                <div className="flex items-center justify-center py-2">
                    <button
                        onClick={() => {
                            try {
                                const target = (process.env.NEXT_PUBLIC_LEARNING_URL || 'http://localhost:5173') + '/?openLogin=1';
                                // navigate in same tab instead of opening a new tab
                                window.location.href = target;
                            } catch (e) { /* ignore */ }
                        }}
                        className="px-3 py-2 rounded-md border border-border bg-card hover:bg-accent/5"
                    >
                        Sign in on Learning
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
