const { ApolloServer, gql } = require('apollo-server');
const { v4: uuidv4 } = require('uuid');

const User= [
    {
        id: "1",
        name: "frame sudlor",
        age: "25",
        email: "frame.sudlor@gmail.com"
    },
    {
        id: "2",
        name: "Jane Doe",
        age: "26",
        email: "jane.doe@gmail.com"
    },
    {
        id: "3",
        name: "Bob Smith",
        age: "27",
        email: "bob.smith@gmail.com"
    }
];

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    age: String!
    email: String!
  }

  input CreateUserInput {
    name: String!
    age: String!
    email: String!
  }

  input UpdateUserInput {
    name: String
    age: String
    email: String
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(user: CreateUserInput!): User!
    updateUser(id: ID!, user: UpdateUserInput!): User!
    deleteUser(id: ID!): User
  }
`;

const resolvers = {
  Query: {
    users: () => User,
    user: (_, { id }) => User.find((u) => u.id === id)
  },
  Mutation: {
    createUser(_, args) {
      const newUser = {
        id: uuidv4(),
        name: args.user.name,
        age: args.user.age,
        email: args.user.email
      };
      User.push(newUser);
      return newUser;
    },
    updateUser(_, { id, user: updateData }) {
      const userIndex = User.findIndex((u) => u.id === id);
      if (userIndex === -1) throw new Error(`User with id "${id}" not found`);
      User[userIndex] = { ...User[userIndex], ...updateData };
      return User[userIndex];
    },
    deleteUser(_, { id }) {
      const index = User.findIndex((u) => u.id === id);
      if (index === -1) throw new Error(`User with id "${id}" not found`);
      const [deleted] = User.splice(index, 1);
      return deleted;
    }
  },
};

const server = new ApolloServer({
  typeDefs, 
  resolvers, 
  cors: {
    origin: '*',
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});








// import { ApolloServer, gql } from 'apollo-server';
// import { v4 as uuidv4 } from 'uuid';
// import { User } from '../data';
// import { PubSub } from 'graphql-subscriptions'

// const pubsub = new PubSub()
// const USER_CREATED = 'USER_CREATED';

// type UserType = {
//   id: string
//   name: string
//   age: string
//   email: string
// }

// const typeDefs = gql`
//   type User {
//     id: ID!
//     name: String!
//     age: String!
//     email: String!
//   }
//   input CreateUserInput {
//     name: String!
//     age: String!
//     email: String!
//   }
//   type Query {
//     users: [User]
//     user(id: ID!): User
//   }
//   type Mutation {
//     createUser(user: CreateUserInput!): User
//     updateUser(id: ID!, user: UpdateUserInput!): User!
//     deleteUser(id: ID!): User
//   }
// `;

// const resolvers = {
//   Query: {
//     users: () => User,
//     user: (_parent: unknown, { id }: { id: string }) => User.find((u) => u.id === id)
//   },
//   Mutation: {
//     createUser(_parent: unknown, args: UserType) {
//       const newUser = {
//         id: uuidv4(),
//         name: args.name,
//         age: args.age,
//         email: args.email
//       };
//       User.push(newUser);
//       pubsub.publish(USER_CREATED, { userCreated: newUser });
//       return newUser;
//     },
//     updateUser(_parent: unknown, { id, name, age, email }: UserType) {
//       const user = User.find((u) => u.id === id);
//       if (!user) throw new Error(`User with id "${id}" not found`);


//       return Object.assign(user, { name, age, email });
//     },
//     deleteUser(_parent: unknown, { id }: { id: string }) {
//       const index = User.findIndex((u) => u.id === id);
//       if (index === -1) throw new Error(`User with id "${id}" not found`);
//       const [deleted] = User.splice(index, 1);
//       return deleted;
//     }
//   },
// };

// const server = new ApolloServer({
//   typeDefs, resolvers, cors: {
//     origin: '*',
//   }
// });

// server.listen().then(({ url }: { url: string }) => {
//   console.log(`Server ready at ${url}`);
// });
