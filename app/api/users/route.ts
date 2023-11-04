import { Collections, db } from "@/app/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function POST(request: Request) {
  const body = await request.json();

  // check if the user already exists in the database
  const usersData = await getDoc(doc(db, Collections.users, body.uid));

  if (usersData.exists()) {
    return new Response(JSON.stringify(usersData.data()));
  }

  const user = await setDoc(doc(db, Collections.users, body.uid), {
    displayName: body.displayName,
    photoUrl: body.photoUrl,
    role: body.role,

    // extra urls
    linkedinUrl: null,
    githubProfileUrl: null,
    devpostProfileUrl: null,
  });

  console.log(`POST /api/users/: Created user`);

  return new Response(JSON.stringify(user), { status: 201 });
}
