"use client";

import * as z from "zod";

import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@components/ui/form";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";

import { CommentValidation } from "@lib/validations/thread";
import { addCommentToThread } from "@lib/actions/thread.actions";
import Image from "next/image";

interface Props {
  threadId: string;
  currentUserId: string;
  currentUserImg: string;
  accountId: string;
}
const Comment = (props: Props) => {
  const { threadId, currentUserId, currentUserImg, accountId } = props;

  const router = useRouter();
  //   console.log(currentUserId);
  const pathname = usePathname();

  const [submiting, setSubmiting] = useState(false);
  //   const { startUpload } = useUploadThing("media");

  //   const [files, setFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    setSubmiting(true);

    try {
      //   console.log("loading...");
      await addCommentToThread({
        threadId,
        commentText: values.thread,
        userId: JSON.parse(currentUserId),
        path: pathname,
      });
      //   console.log("finished...");

      form.reset();
    } catch (error) {
      console.error(`Error updating account ${JSON.stringify(error)}`);
    } finally {
      setSubmiting(false);
    }
  };
  return (
    <Form {...form}>
      <form className="comment-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel>
                <div
                  className="cursor-pointer relative h-12 w-12"
                  onClick={() => router.push(`/profile/${accountId}`)}
                > 
                  <Image
                    src={currentUserImg}
                    alt="profile image"
                    fill
                    className="rounded-full"
                  />
                </div>
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Comment..."
                  className="text-light-1 no-focus outline-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {!submiting ? (
          <Button type="submit" className="comment-form_btn">
            Reply
          </Button>
        ) : (
          <Button disabled className="comment-form_btn">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Replying...
          </Button>
        )}
      </form>
    </Form>
  );
};

export default Comment;
