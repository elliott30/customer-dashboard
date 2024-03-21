import Link from 'next/link';

import { Ticket } from './tickets/page';

import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text
} from '@tremor/react';

// User table from postgres

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export function UsersTable({ users }: { users: User[] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Username</TableHeaderCell>
          <TableHeaderCell>Email</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>
              <Text>{user.username}</Text>
            </TableCell>
            <TableCell>
              <Text>{user.email}</Text>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// Ticket Table



export function TicketsTable({ tickets }: { tickets: Ticket[] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Subject</TableHeaderCell>
          <TableHeaderCell>ID</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell>  <Link href={`/tickets/${ticket.id}`}>
    {ticket.subject}
  </Link></TableCell>
            <TableCell>{ticket.id}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}