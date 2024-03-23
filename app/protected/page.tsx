import { auth } from "../auth"
import { redirect } from 'next/navigation';
import axios from 'axios';

export default async function Page() {
  const session = await auth();

  if (!session) {
    return redirect("api/auth/signin");
  }

  try {
    console.log(session.accessToken);
    const response = await axios.get(
      "https://api.hubapi.com/contacts/v1/lists/all/contacts/all?count=1",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log({'contact':response.data.contacts[0]});

    if (response.data.contacts[0]) {
      return <p>Here's a contact: {response.data.contacts[0].properties.firstname.value}!</p>
    }
  } catch (error) {
    console.log({'Protected page error':error.response.data.message});
    return <p>Sorry, something went wrong. Please try again later. {error.response.data.message} </p>;
  }
}
