import { Fragment } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import NewMeetupForm from "../../components/meetups/NewMeetupForm"

function newMeetupPage() {
  const router = useRouter();

  async function addMeetupHandler(enteredMeetupData) {
    // console.log(enteredMeetupData);
    const response = await fetch('/api/new-meetup', {
      method: 'POST',
      body: JSON.stringify(enteredMeetupData),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();

    console.log(data);

    router.push('/');
  }

  return (
    <Fragment>
      <Head>
        <title>Add a New Meetup</title>
        <meta
          name='description'
          content='Add your own meetups!'
        />
      </Head>
      <NewMeetupForm onAddMeetup={addMeetupHandler} />
    </Fragment>
  )
}

export default newMeetupPage