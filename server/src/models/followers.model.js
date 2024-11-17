import mongoose, { Schema } from "mongoose";

const followschema = new Schema(
  {
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    follower: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      profileImage: {
        type: String,
        default: "https://via.placeholder.com/150",
      },
    },
    followedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Follow = mongoose.model("Follow", followschema);
