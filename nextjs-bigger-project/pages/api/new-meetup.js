import { MongoClient } from 'mongodb';

// /api/new-meetup
// POST /api/new-meetup

async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;

    // it is safe to store credentials here, because this code will never
    // end up on the client-side
    const client = await MongoClient.connect(
      process.env.NEXT_PUBLIC_API_URL
    );
    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    // const { title, image, address, description } = data
    const result = await meetupsCollection.insertOne(data);

    console.log(result);

    client.close();

    res.status(201).json({ message: 'Meetup inserted!' });
  }
}

export default handler;