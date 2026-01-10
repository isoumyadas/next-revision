import { OAuthProvider } from "@/auth/nextjs/action";
import { Cookies } from "../session";
import crypto from "crypto";
import z from "zod";
import { createDiscordOAuthClient } from "./discord";
import { createGithubOAuthClient } from "./github";

const STATE_COOKIE_KEY = "oAuthState";
const COOKIE_EXPIRATION_SECONDS = 60 * 10;
// const CODE_VERIFIER_COOKIE_KEY = "oAuthCodeVerifier";

export class OAuthClient<T> {
  private readonly provider: OAuthProvider;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly scopes: string[];
  private readonly urls: {
    auth: string;
    token: string;
    user: string;
  };
  private readonly userInfo: {
    schema: z.ZodSchema<T>;
    parser: (data: T) => { id: string; name: string; email: string };
  };

  constructor({
    provider,
    clientId,
    clientSecret,
    scopes,
    urls,
    userInfo,
  }: {
    provider: OAuthProvider;
    clientId: string;
    clientSecret: string;
    scopes: string[];
    urls: {
      auth: string;
      token: string;
      user: string;
    };
    userInfo: {
      schema: z.ZodSchema<T>;
      parser: (data: T) => { id: string; name: string; email: string };
    };
  }) {
    this.provider = provider;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.scopes = scopes;
    this.urls = urls;
    this.userInfo = userInfo;
  }

  private get redirectUrl() {
    return new URL(this.provider, process.env.OAUTH_REDIRECT_URL_BASE!); // api/oauth/discord | github | google
  }
  createAuthUrl(cookies: Pick<Cookies, "set">) {
    const state = createState(cookies);
    // const url = new URL("https://discord.com/oauth2/authorize");
    const url = new URL(this.urls.auth);
    url.searchParams.set("client_id", this.clientId);
    url.searchParams.set("redirect_uri", this.redirectUrl.toString());
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", this.scopes.join(" "));
    url.searchParams.set("state", state);

    // url.searchParams.set("client_id", process.env.DISCORD_CLIENT_ID!);
    // url.searchParams.set("redirect_uri", this.redirectUrl.toString());
    // url.searchParams.set("response_type", "code");
    // url.searchParams.set("scope", "identify email");
    // url.searchParams.set("state", state);

    return url.toString();
  }

  async fetchUser(code: string, state: string, cookies: Pick<Cookies, "get">) {
    const isValidState = await validateState(state, cookies);
    if (!isValidState) throw new Error("Incorrect State");

    console.log("here 1");

    const { accessToken, tokenType } = await this.fetchToken(code);

    // const fetchedData = await fetch("https://discord.com/api/users/@me", {
    //   headers: {
    //     Authorization: `${tokenType} ${accessToken}`,
    //   },
    // });

    console.log("2");

    const fetchedData = await fetch(this.urls.user, {
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
      },
    });

    const res = await fetchedData.json();
    if (!res) throw new Error("Invalid User");
    const user = await res;

    console.log("in base fetch user::> ", user);

    return this.userInfo.parser(user);

    // return {
    //   id: user.id,
    //   email: user.email,
    //   name: user.username ?? user.global_name,
    // };
  }

  private fetchToken(code: string) {
    // return fetch("https://discord.com/api/oauth2/token", {
    return fetch(this.urls.token, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        code,
        redirect_uri: this.redirectUrl.toString(),
        grant_type: "authorization_code",
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    })
      .then((res) => res.json())
      .then((rawData) => {
        console.log("rawData oauth::> ", rawData);
        // const {access_token, token_type} = rawData
        if (!rawData) throw new Error("Invalid Token");

        return {
          accessToken: rawData.access_token,
          tokenType: rawData.token_type,
        };
      });
  }
}

export function getOAuthClient(provider: OAuthProvider) {
  switch (provider) {
    case "discord":
      return createDiscordOAuthClient();
    case "github":
      return createGithubOAuthClient();
    case "google":
      return createDiscordOAuthClient();
    default:
      throw new Error(`Invalid provider: ${provider satisfies never}`);
  }
}

function createState(cookies: Pick<Cookies, "set">) {
  const state = crypto.randomBytes(64).toString("hex").normalize();

  cookies.set(STATE_COOKIE_KEY, state, {
    secure: true,
    httpOnly: true,
    sameSite: "lax", // used lax here because request coming from discord server to our server & if we kept strict, it only work because it is going from your server to your server. (cookie)
    expires: Date.now() + COOKIE_EXPIRATION_SECONDS * 1000,
  });

  return state;
}

function validateState(state: string, cookies: Pick<Cookies, "get">) {
  const cookieState = cookies.get(STATE_COOKIE_KEY)?.value;
  return cookieState === state;
}
