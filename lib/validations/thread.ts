import { string, object } from "zod";

export const ThreadValidation = object({
  thread: string().nonempty().min(3, { message: "Mininum 3 characters" }),
  accountId: string(),
});

export const CommentValidation = object({
  thread: string().nonempty().min(3, { message: "Mininum 3 characters" }),
});
