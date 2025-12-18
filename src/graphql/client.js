"use client"

import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { HttpLink } from "@apollo/client/link/http";

const httpLink = new HttpLink({
  uri: "/api/graphql",
});

const client=new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(), // client side caching (browser)

})
export {client};


export default function ApolloWrapper({children}){
    return (<ApolloProvider client={client}>{children}</ApolloProvider>)
}