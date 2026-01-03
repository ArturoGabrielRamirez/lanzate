import { Mail } from "lucide-react";

import { InputField } from "@/features/global/components/form";

function LoginPage() {
    return (
        <div className="container mx-auto">
            <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="example@mail.com"
                startIcon={<Mail/>}
                isRequired
                tooltip="This should be the email you used to register your account."
            />
        </div>
    );
}

export default LoginPage;