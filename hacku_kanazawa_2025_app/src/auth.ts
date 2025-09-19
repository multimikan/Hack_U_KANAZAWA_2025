import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: "810236665389-gs7jomo2jh2803k0rk2miihuvoiivfg0.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
  secret: "k2aGQZUg8Un8kKj5y5Aniea6upxx23yl6v8g5ePMpgI=",
});
