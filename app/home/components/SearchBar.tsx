import React, { useState } from "react";
import { db, Collections } from "@/app/firebase/client";
import {
  query,
  collection,
  where,
  getDocs,
  limit,
  FirestoreDataConverter,
} from "firebase/firestore";

interface SearchProps {}

interface User {
  uid: string;
  displayName: string;
}

const Search: React.FC<SearchProps> = ({}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const usersConverter: FirestoreDataConverter<any> = {
    toFirestore: (data: any) => data,
    fromFirestore: (snapshots, options) => {
      const data = snapshots.data(options);

      return {
        uid: snapshots.id,
        ...data,
      };
    },
  };

  const handleSearch = async () => {
    setLoading(true);
    // Adjust the query to match your user data structure, especially the field to be searched
    const usersRef = collection(db, Collections.users).withConverter(
      usersConverter
    );
    const q = query(
      usersRef,
      where("displayName", ">=", searchTerm),
      where("displayName", "<=", searchTerm + "\uf8ff"),
      limit(10)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      setNoResults(true);
      setSearchResults([]);
    } else {
      const results = querySnapshot.docs.map((doc) => doc.data());
      setNoResults(false);
      setSearchResults(results);
    }
    setLoading(false);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for teammates..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2"
      />
      <button onClick={handleSearch} className="p-2 bg-blue-500 text-white">
        Search
      </button>
      {loading && <p>Searching...</p>}
      {noResults && <p>No results found.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchResults.map((user) => (
          // Here, you'd render your user card component or similar
          <div key={user.uid}>User: {user.displayName}</div>
        ))}
      </div>
    </div>
  );
};

export default Search;
