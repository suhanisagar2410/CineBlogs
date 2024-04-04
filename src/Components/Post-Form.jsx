import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "./index";
import postServices from "../AppWrite/CreatePost";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import parse from "html-react-parser"


export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.Auth.userData);
    console.log(userData);

    const submit = async (data) => {
        if (post) {
            const file = data.image[0] ? await postServices.uploadFile(data.image[0]) : null;
            console.log(data);
            // console.log(parse(data.content.props.children));

            if (file) {
                postServices.deleteFile(post.featuredImage);
            }

            const dbPost = await postServices.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });

            if (dbPost) {
                
                navigate(`/post/${dbPost.$id}`)
                
            }
        } else {
            const file = await postServices.uploadFile(data.image[0]);

            if (file) {
                const fileId = file.$id;
                data.featuredImage = fileId;
                const dbPost = await postServices.createPost({ ...data  ,   userId: userData.$id}   );

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`)
                   
                }
            }
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex text-white flex-wrap justify-center items-center">
            <div className="sm:w-2/3 px-10 justify-center flex-col items-center w-full">
                <Input
                    label="Movie Title :"
                    placeholder="Title"
                    className="mb-4 mx-2 pl-2 rounded-[5px] text-black"
                    {...register("title", { required: true })}
                />
                {/* <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4 mx-2 pl-2 rounded-[5px] text-black"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                /> */}
                <RTE  label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="sm:w-1/3 w-full px-2 justify-center items-center">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4 rounded italic"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: post })}
                />
                {post && (
                    <div className="w-full mb-4 justify-center items-center">
                        <img
                            src={postServices.getImage(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["Active", "Inactive"]}
                    label="Status"
                    className="mb-4 sm:w-full w-[21rem] "
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="sm:w-full w-[5rem]">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
} 