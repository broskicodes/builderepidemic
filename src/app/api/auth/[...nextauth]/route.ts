import { users, twitterHandles } from "@/lib/db-schema";
import { db } from "@/lib/drizzle";
import { TwitterScrapeType } from "@/lib/types";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

const handler = NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.userId;
      }
      return session;
    },
    async jwt({ token, user, account, profile, session }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      console.log("signIn", user, account, profile);

      if (user && user.id && profile) {
        try {
          let twitterHandleId: bigint;

        // Check if the Twitter handle exists
        const existingHandle = await db
          .select()
          .from(twitterHandles)
          .where(eq(twitterHandles.handle, profile.data.username as string))
          .limit(1);

          if (existingHandle.length === 0) {
            // Twitter handle doesn't exist, add it
            try {
              const [newHandle] = await db
                .insert(twitterHandles)
                .values({
                  id: BigInt(user.id),
                  handle: profile.data.username as string,
                  url: profile.data.url as string,
                  pfp: profile.data.image as string,
                })
                .returning({ id: twitterHandles.id });

              twitterHandleId = newHandle.id;
              console.log("New Twitter handle added:", profile.data.username);
            } catch (error) {
              console.error("Error adding new Twitter handle:", error);
              return false; // Prevent sign in if we can't add the Twitter handle
            }
          } else {
            twitterHandleId = existingHandle[0].id;
            console.log("Existing Twitter handle found:", profile.data.username);
          }

          // Check if there's a user associated with this Twitter handle
          const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.twitter_handle_id, twitterHandleId))
            .limit(1);

          if (existingUser.length === 0) {
            // No user associated with this Twitter handle, add them to the database
            try {
              await db.insert(users).values({
                name: user.name || '',
                email: user.email || '',
                twitter_handle_id: twitterHandleId,
              });
              console.log("New user added to the database:", user.id);
            } catch (error) {
              console.error("Error adding new user:", error);
              return false; // Prevent sign in if we can't add the user
            }

            console.log("Initializing Twitter handle:", profile.data.username);
            fetch(`${process.env.NEXT_PUBLIC_ENV_URL}/api/scrape/twitter`, {
              method: 'POST',
              body: JSON.stringify({ scrapeType: TwitterScrapeType.Initialize, handles: [profile.data.username] }),
            });

          } else {
            console.log("User already exists for this Twitter handle:", twitterHandleId);
          }

          return true; // Sign in successful
        } catch (error) {
          console.error("Unexpected error during sign in:", error);
          return false; // Prevent sign in on unexpected errors
        }
      }

      return false; // Prevent sign in if user or profile is missing
    },
  },
});

export { handler as GET, handler as POST };
