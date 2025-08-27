import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'done'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const UserModel =
  mongoose.models.TodoApp || mongoose.model("TodoApp", TodoSchema);

export default UserModel;