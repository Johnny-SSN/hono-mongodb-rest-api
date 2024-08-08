import { Context } from "hono";
import { User } from "../models";
import { getToken } from "../utils";
import mongoose from "mongoose";

export const getUsers = async (c: Context) => {
  const users = await User.find().select("-password");

  return c.json({ users });
};

export const getOneUser = async (c: Context) => {
  const id = c.req.param("id");

  if (!mongoose.Types.ObjectId.isValid(id)) {
    // return c.json({ error: "User not found" }, 404);
    c.status(404);
    throw new Error("User not found");
  }

  const user = await User.findOne({ _id: id });

  if (!user) {
    c.status(404);
    throw new Error("User not found");
  }

  return c.json({
    success: true,
    data: {
      _id: user?._id,
      name: user?.name,
      email: user?.email,
      isAdmin: user?.isAdmin,
    },
  });
};

export const createUser = async (c: Context) => {
  const { name, email, password, isAdmin } = await c.req.json();

  // Check for existing user
  const userExists = await User.findOne({ email });
  if (userExists) {
    c.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    isAdmin,
  });

  if (!user) {
    c.status(400);
    throw new Error("Invalid user data");
  }

  const token = await getToken(user._id as string);

  return c.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    token,
    message: "User created successfully",
  });
};

export const loginUser = async (c: Context) => {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    c.status(401);
    throw new Error("Please provide an email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    c.status(401);
    throw new Error("No user found with this email");
  }

  if (!(await user.mathPassword(password))) {
    c.status(401);
    throw new Error("Invalid credentials");
  } else {
    const token = await getToken(user._id as string);

    return c.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token,
      message: "User logged in successfully",
    });
  }
};

export const updateUser = async (c: Context) => {
  const { name, email, isAdmin } = await c.req.json();
  const id = c.req.param("id");

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return c.json({ error: "User not found" }, 404);
  }

  const user = await User.findOneAndUpdate(
    { _id: id },
    {
      name,
      email,
      isAdmin,
    },
    { new: true, select: "-password" }
  );

  return c.json({
    success: true,
    data: {
      _id: user?._id,
      name: user?.name,
      email: user?.email,
      isAdmin: user?.isAdmin,
    },
    message: "User updated successfully",
  });
};

export const deleteUser = async (c: Context) => {
  const id = c.req.param("id");

  if (!mongoose.Types.ObjectId.isValid(id)) {
    c.status(404);
    throw new Error("User not found");
  }
  await User.findByIdAndDelete(id);

  return c.json({ message: "User deleted successfully" });
};
