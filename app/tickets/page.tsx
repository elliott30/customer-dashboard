import axios from 'axios';
import { Card, Title, Text } from '@tremor/react';
import { TicketsTable } from '../tables';
import Search from '../search';

export interface Ticket {
    id: string;
    subject: string;
}

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const search = searchParams.q ?? '';

  let tickets: Ticket[] = []; // Initialize tickets as an empty array

  try {
    const requestBody = JSON.stringify({
      "query": search,
      "limit": 5,
      "sorts": ["createdate"],
      "properties": ["subject"]
    });

    const response = await axios({
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.hubapi.com/crm/v3/objects/tickets/search',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATEAPP_TOKEN}`
      },
      data: requestBody
    });

    tickets = response.data.results;
    
    tickets.forEach(ticket => {
        ticket.subject = ticket.properties.subject;
        ticket.properties = null;
      });

    console.log(JSON.stringify(tickets));
  } catch (error) {
    console.log(error);
    // Handle the error (e.g., display an error message to the user)
  }

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Tickets</Title>
      <Text>A list of tickets retrieved from HubSpot.</Text>
      <Search />
      <Card className="mt-6">
        <TicketsTable tickets={tickets} />
      </Card>
    </main>
  );
}