import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifiedCode: string;
  verifiedCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "username is required"],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    match: [
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      "Please enter a valid email",
    ],
    required: [true, "email is required"],
    trim: true,
  },
  password: {
    type: String,
    unique: true,
    required: [true, "password is required"],
    trim: true,
  },
  verifiedCode: {
    type: String,
    required: [true, "verified code is required"],
  },
  verifiedCodeExpiry: {
    type: Date,
    required: [true, "verified code expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
