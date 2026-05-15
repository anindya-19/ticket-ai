import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { inngest } from "../inngest/client.js";

export const signup = async (req, res) => {
  const { email, password, skills = [] } = req.body;
  try {
    const hashedPassword = bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, skills });

    //fire inngest event
    await inngest.send({
      name: "user/signup", //name of the event was also user/signup
      data: {
        email,
      },
    });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
    ); //sign(payload: string | Buffer | object, secretOrPrivateKey: null),

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "Signup failed", msg: error.message });
  }
};

//Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
    );
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "Login failed", msg: error.message });
  }
};

//Log out
export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    });

    res.json({ message: "Logout succesfully" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed", details: error.message });
  }
};

//Update user
export const updateUser = async (req, res) => {
  const { skills = [], role, email } = req.body;

  //only admin can update
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "User not found" });

    await User.updateOne(
      { email },
      { skills: skills.length ? skills : user.skills, role },
    );
    return res.json({ msg: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Update failed", details: error.message });
  }
};

//to get all the users
export const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const users = await User.find().select("-password"); //get all the users but remove their passwords
    return res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Fetching failed", details: error.message });
  }
};
