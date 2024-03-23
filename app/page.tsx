import { sql } from '@vercel/postgres';
import { Card, Title, Text } from '@tremor/react';
import Search from './search';
import {UsersTable} from './tables';
import { auth } from "../auth"




export default async function IndexPage() {

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Welcome</Title>
      <Text>This is a fun test project.</Text>
    </main>
  );
}
