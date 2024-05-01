import { z } from "zod";

export const emailSchema = z.string().email("This is not a valid email");
export const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters")
    .superRefine((password, checkPassComplexity) => {
        const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
        const containsLowercase = (ch: string) => /[a-z]/.test(ch);
        const containsSpecialChar = (ch: string) =>
            /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
        let countOfUpperCase = 0,
            countOfLowerCase = 0,
            countOfNumbers = 0,
            countOfSpecialChar = 0;
        for (let i = 0; i < password.length; i++) {
            let ch = password.charAt(i);
            if (!isNaN(+ch)) countOfNumbers++;
            else if (containsUppercase(ch)) countOfUpperCase++;
            else if (containsLowercase(ch)) countOfLowerCase++;
            else if (containsSpecialChar(ch)) countOfSpecialChar++;
        }
        if (countOfLowerCase < 1) {
            checkPassComplexity.addIssue({
                code: "custom",
                message: "Password must contain at least one lowercase letter",
            });
        }
        if (countOfUpperCase < 1) {
            checkPassComplexity.addIssue({
                code: "custom",
                message: "Password must contain at least one uppercase letter",
            });
        }
        if (countOfNumbers < 1) {
            checkPassComplexity.addIssue({
                code: "custom",
                message: "Password must contain at least one number",
            });
        }
        if (countOfSpecialChar < 1) {
            checkPassComplexity.addIssue({
                code: "custom",
                message: "Password must contain at least one special character",
            });
        }
    });

export const credentialsValidator = z.object({
    email: emailSchema,
    password: passwordSchema,
});
