import { Fragment } from 'react';
import { MongoClient, ObjectId } from 'mongodb';
import Head from 'next/head';

import MeetupDetail from '../../components/meetups/MeetupDetail';

function MeetupDetails(props) {
  const { image, title, address, description } = props.meetupData;
  const metaDescription = (description.length > 156) ? description.substr(0, 155) + "\u2026" : description;
  return (
    <Fragment>
    <Head>
      <title>React Meetup Detail: {title}</title>
      <meta
          name='description'
          content={metaDescription}
        />
    </Head>
    <MeetupDetail
      image={image}
      title={title}
      address={address}
      description={description}
    />
    </Fragment>
  );
}

export async function getStaticPaths() {
  // it is safe to store credentials here, because this code will never
  // end up on the client-side
  const client = await MongoClient.connect(
    process.env.NEXT_PUBLIC_API_URL
  );
  const db = client.db();
  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();
  
  return {
    // set fallback to 'false' if you define ALL supported paths below
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  // fetch API data for a single meetup details

  const meetupId = context.params.meetupId;

  // it is safe to store credentials here, because this code will never
  // end up on the client-side
  const client = await MongoClient.connect(
    process.env.NEXT_PUBLIC_API_URL
  );
  const db = client.db();
  const meetupsCollection = db.collection('meetups');

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId)
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetupDetails;
