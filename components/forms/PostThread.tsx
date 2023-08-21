"use client";

import * as z from "zod";

import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

import { useOrganization } from "@clerk/nextjs";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Button } from "@components/ui/button";
import { Textarea } from "@components/ui/textarea";

import { ThreadValidation } from "@lib/validations/thread";
// import { updateUser } from "@lib/actions/user.actions";
import { createThread } from "@lib/actions/thread.actions";

interface ThreadParams {
  userId: string;
}

const PostThread = (props: ThreadParams) => {
  const { userId } = props;
  const router = useRouter();
  const pathname = usePathname();

  const { organization } = useOrganization();

  const [submiting, setSubmiting] = useState(false);
  //   const { startUpload } = useUploadThing("media");

  //   const [files, setFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: JSON.parse(userId),
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    setSubmiting(true);

    try {
      await createThread({
        text: values.thread,
        author: values.accountId,
        communityId: organization ? organization.id : null,
        path: pathname,
      });

      router.push("/");
    } catch (error) {
      console.error(`Error updating account ${JSON.stringify(error)}`);
    } finally {
      setSubmiting(false);
    }
  };
  return (
    <Form {...form}>
      <form
        className="mt-10 flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="border border-dark-4 bg-dark-3 text-light-1 no-focus">
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!submiting ? (
          <Button type="submit" className="bg-primary-500">
            Post Thread
          </Button>
        ) : (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Posting...
          </Button>
        )}
      </form>
    </Form>
  );
};

export default PostThread;
