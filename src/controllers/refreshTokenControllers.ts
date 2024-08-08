import { Context } from "hono";
import { getToken } from "../utils";
import { decode } from "hono/utils/jwt/jwt";
import { Jwt } from "hono/utils/jwt";

export const refreshToken = async (c: Context) => {
  let expiredToken = c.req.header("Authorization")?.replace(/Bearer\s+/i, "");

  if (!expiredToken) {
    return c.json({ message: "No token provided" });
  }
  try {
    const tokenCheckValid = await Jwt.verify(
      expiredToken,
      Bun.env.JWT_SECRET || ""
    );

    if (tokenCheckValid && tokenCheckValid.id) {
      return c.json({ message: "Token is still valid" });
    }
  } catch (err: any) {
    if (err.name === "JwtTokenExpired") {
      const { payload } = decode(expiredToken);
      const refreshToken = await getToken(payload.id as string);
      return c.json({
        success: true,
        refresh_token: refreshToken,
        message: "Refresh token is successfully",
      });
    }
    return c.json({ message: "Token is still valid" });
  }
};
