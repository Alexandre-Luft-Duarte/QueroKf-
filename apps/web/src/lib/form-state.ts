/** Estado compartilhado pelos formulários do admin (usado com `useActionState`). */
export type FormState = { status: "idle" | "success" | "error"; message?: string };

export const initialFormState: FormState = { status: "idle" };
