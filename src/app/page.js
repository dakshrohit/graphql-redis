"use client";

import { useMutation, useLazyQuery } from "@apollo/client/react";
import { useState } from "react";
import { CREATE_USER } from "../graphql/mutations.js";
import { GET_USER } from "../graphql/queries.js";

export default function Home() {
  const [userId, setUserId] = useState("");

  const [createUser] = useMutation(CREATE_USER);
  const [getUser, { data, loading }] = useLazyQuery(GET_USER, {
    fetchPolicy: "network-only", // Bypass Apollo cache to test Redis
  });

  const handleCreateUser = async () => {
    const res = await createUser({
      variables: {
        input: {
          name: "Daksh Rohit",
          email: "dakshrohit@test.com",
        },
      },
    });
    setUserId(res.data.createUser.id);
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={handleCreateUser}>Create User</button>

      <br />
      <br />

      <button onClick={() => getUser({ variables: { id: userId } })}>
        Fetch User
      </button>

      {loading && <p>Loading...</p>}

      {data && (
        <div>
          <h3>{data.user.name}</h3>
          <p>{data.user.email}</p>

          <h4>Posts:</h4>
          <ul>
            {data.user.posts.map((p, i) => (
              <li key={i}>{p.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
