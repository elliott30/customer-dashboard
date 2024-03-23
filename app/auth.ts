import NextAuth from 'next-auth';
import HubSpot from "@auth/core/providers/hubspot";
import axios from 'axios';
import qs from 'qs';

export const {
  handlers: { GET, POST },
  auth
} = NextAuth({
  debug: true,
  strategy: "jwt",
  providers: [HubSpot({ 
    clientId: process.env.HUBSPOT_CLIENT_ID, 
    clientSecret: process.env.HUBSPOT_CLIENT_SECRET,
    authorization: { params: { scope: "oauth content forms crm.objects.deals.read crm.objects.contacts.read tickets" } }, 
  })],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Log the token before the first if condition
      console.log('Async jwt callback started. Token:', token);
    
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.hub_id = profile.hub_id,
        token.accessToken = account.access_token,
        token.expiresAt = Math.floor(Date.now() / 1000 + account.expires_in - 60),
        token.refreshToken = account.refresh_token
      }
      // Checks if token is valid
      let tokenValid = Date.now() / 1000 < token.expiresAt;
      // tokenValid = false; // Force refresh each time
      console.log(`Token valid: ${tokenValid}`);

      
      if (tokenValid == false) {
        console.log("Getting new token")
        const formData = {
          grant_type: 'refresh_token',
          client_id: process.env.HUBSPOT_CLIENT_ID,
          client_secret: process.env.HUBSPOT_CLIENT_SECRET,
          refresh_token: token.refreshToken
        };
        const data = qs.stringify(formData);

        const config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://api.hubapi.com/oauth/v1/token',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: data
        };

        try {
          const response = await axios.request(config);
          console.log(response.data);
          token.accessToken = response.data.access_token;
          token.expiresAt = Math.floor(Date.now() / 1000 + response.data.expires_in);
          token.refreshToken = response.data.refresh_token;
          console.log('Refresed token:', response.data);

        } catch (error) {
          console.log('Error while refreshing the token:', error);
        }
      }
    
      // Log the token again after the first if condition ends
      console.log('Async jwt callback ended. Token:', token);
    
      return token;
    },
    
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      if (token.hub_id) {
        session.hub_id = token.hub_id
      }
      session.accessToken = token.accessToken,
      console.log("Async session callback ended. Session:",session)
      return session
    }
  }
});