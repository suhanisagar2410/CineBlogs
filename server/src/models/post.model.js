import mongoose, { Schema } from "mongoose";

const postschema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      // required: true,
      // index: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      profileImage: {
        type: String,
      },
      email: {
        type: String
      },
      username: {
        type: String
      }
    }],
    dislikes: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      profileImage: {
        type: String,
      },
      email: {
        type: String
      },
      username: {
        type: String
      }
    }],
    image: {
      type: String,
    },
    status: {
      type: Boolean,
      required: true,
    }
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postschema);
