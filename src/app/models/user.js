import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    desc: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserModel =
  mongoose.models.TodoApp || mongoose.model("TodoApp", TodoSchema);

export default UserModel;
