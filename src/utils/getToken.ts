import { Jwt } from "hono/utils/jwt";

const getToken = (id: string) => {
  return Jwt.sign(
    { id, exp: Math.floor(Date.now() / 1000) + 60 * 2 },
    Bun.env.JWT_SECRET || ""
  );
};

export default getToken;
