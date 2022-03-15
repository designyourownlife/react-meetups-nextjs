import { Fragment } from 'react';
import { MongoClient } from 'mongodb';
import Head from 'next/head';

import MeetupList from '../components/meetups/MeetupList';

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name='description'
          content='Browse a huge list of highly active React meetups!'
        />
      </Head>
      <MeetupList meetups={props.meetups} />;
    </Fragment>
  );
}

// // code will not run during the build process but instead always
// // on the server after deployment
// // regenerates content with every incoming request
// // disadvantage: unnecessary waiting time
// // advantage: better solution when changes happen frequently
// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   // fetch data from an API
//   return {
//     props: DUMMY_MEETUPS
//   };
// }

// the code of 'getStaticProps()' runs during the build process;
// it will never execute on the client-side!!!!!
// advantage: cacheable & faster response
// disadvantage: does not work for update intervals less than 1s
export async function getStaticProps() {
  // fetch data from Mongo
  // (Remember: code will be never exposed to the client
  const client = await MongoClient.connect(
    process.env.NEXT_PUBLIC_API_URL
  );

  const db = client.db();
  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 3600,
  };
}

export default HomePage;
