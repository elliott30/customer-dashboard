import NextAuth from 'next-auth';
import HubSpot from "@auth/core/providers/hubspot";

export const {
  handlers: { GET, POST },
  auth
} = NextAuth({
  providers: [HubSpot({ clientId: process.env.HUBSPOT_CLIENT_ID, clientSecret: process.env.HUBSPOT_CLIENT_SECRET })],
//  pages: {
 //   signIn: '/sign-in'
 // }
});
