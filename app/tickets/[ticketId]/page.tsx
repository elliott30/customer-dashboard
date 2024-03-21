import axios from 'axios';
import {
  Card,
  Title,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text
} from '@tremor/react';

export interface Email {
  id: string;
  subject: string;
}

export default async function Page({ params }: { params: { ticket: string } }) {
 
  let fetchedEmails: Email[] = []; // Initialize fetchedEmails as an empty array

try {
  const initialEmailResponse = await axios({
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.hubapi.com/crm/v4/objects/ticket/${params.ticketId}/associations/email`,
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATEAPP_TOKEN}`
    },
  });

  console.log("Initial Email Response:", initialEmailResponse.data);

  // Extract email ID's from the initial email response
  const emailIds = initialEmailResponse.data.results;

  console.log("Email IDs:", emailIds);

  const emailIdInputs = emailIds.map(email => ({
    id: email.toObjectId.toString()
  }));
  
  const emailBodyResponse = await axios({
    method: 'post',
    url: 'https://api.hubapi.com/crm/v3/objects/emails/batch/read',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATEAPP_TOKEN}`
    },
    data: JSON.stringify({
      idProperty: 'hs_object_id',
      inputs: emailIdInputs,
      properties: [
        'hs_email_subject',
        'hs_email_text'
      ]
    })
  });

  console.log("Email Body Response:", emailBodyResponse.data);

  // Process response to extract hs_email_subject and hs_email_text properties
  fetchedEmails = emailBodyResponse.data.results.map(result => ({
    subject: result.properties.hs_email_subject,
    id: result.properties.hs_email_text
  }));

  console.log("Fetched Emails:", fetchedEmails);

} catch (error) {
  console.log(error);
  // Handle the error (e.g., display an error message to the user)
}

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Ticket ID: {params.ticketId}</Title>
      <Text>A list of emails from this ticket retrieved from HubSpot.</Text>
      <Card className="mt-6">
      <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Subject</TableHeaderCell>
          <TableHeaderCell>Body</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
      {fetchedEmails.map((email) => (
  <TableRow key={email.id}>
    <TableCell>{email.subject}</TableCell>
    <TableCell>{email.id}</TableCell>
  </TableRow>
        ))}
      </TableBody>
    </Table>
      </Card>
    </main>
  );
}