const graphql = require('graphql');
const _ = require('lodash');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull } = graphql;
const Book = require('../models/book');
const Author = require('../models/author');

// // dummy data
// var books = [
//   {name: 'Name of the Wind 1', genre: 'Fantacy', id: '1', authorId: '1'},
//   {name: 'Name of the Wind 2', genre: 'Fantacy', id: '2', authorId: '2'},
//   {name: 'Name of the Wind 3', genre: 'Sci-Fi', id: '3', authorId: '3'},
//   {name: 'Name of the Wind 4', genre: 'Sci-Fi', id: '3', authorId: '2'},
//   {name: 'Name of the Wind 5', genre: 'Sci-Fi', id: '3', authorId: '1'},
//   {name: 'Name of the Wind 6', genre: 'Sci-Fi', id: '3', authorId: '3'}
// ];

// var authors = [
//   { name: 'Patric Rothfuss 1', age: 44, id: '1'},
//   { name: 'Patric Rothfuss 2', age: 42, id: '2'},
//   { name: 'Patric Rothfuss 3', age: 64, id: '3'},
// ]

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        // return _.find(authors, { 'id': parent.authorId });
        return Author.findById(parent.authorId);
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return _.filter(books, { authorId: parent.id });
        return Book.find({ authorId: parent.id });
      }
    }
  })
});

// how we jump in the graph
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } }, // one of the argument should be id
      resolve(parent, args) {
        // code to get data form db/other sources
        // return _.find(books, { id: args.id });
        return Book.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: { id: {type: GraphQLID} },
      resolve(parent, args) {
        // return _.find(authors, { id: args.id })
        return Author.findById(args.id);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return books;
        return Book.find({});
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        // return authors;
        return Author.find({});
      }
    }
  }
})

// mutation is what allow us to mutate(add, delete, edit) data in GraphQL
// need to explicitly specify
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    }
  }
});

// define what query from frontend side to call
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
