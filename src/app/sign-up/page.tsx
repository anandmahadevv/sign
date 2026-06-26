import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1a1c]">
      <SignUp routing="hash" />
    </div>
  );
}
