import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(password, saltRounds);
  return hashed;
};

export const verifyPasswordHash = async (password, hash) => {
  const verified = await bcrypt.compare(password, hash);
  return verified;
};
