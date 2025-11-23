// // import { Client, Databases, ID, Query } from "appwrite";

// // const DATABASE_ID=import.meta.env.VITE_APPWRITE_DATABASE_ID;
// // const TABLE_ID=import.meta.env.VITE_APPWRITE_TABLE_ID;
// // const PROJECT_ID=import.meta.env.VITE_APPWRITE_PROJECT_ID;
// // const client =new Client()
// //     .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
// //     .setProject(PROJECT_ID);

// //     const database=new Databases(client)
// // export const updateSearchCount = async (searchTerm, movie) => {
// //     console.log(DATABASE_ID, PROJECT_ID, TABLE_ID);
// //     // use Appwrite SDK to update search count in the database
// //     try {
// //         const response = await database.listDocuments(DATABASE_ID, TABLE_ID, [
// //             Query.equal('searchTerm', searchTerm)
// //         ]);
// //         // if it does update the count else create a new entry
// //         if (response.documents.length > 0) {
// //             const doc = response.documents[0]; 
// //             await database.updateDocument(DATABASE_ID, TABLE_ID, doc.$id, {
// //                 count: doc.count + 1
// //             });
// //         } else {
// //             await database.createDocument(DATABASE_ID, TABLE_ID, ID.unique(), {
// //                 searchTerm: searchTerm,
// //                 count: 1,
// //                 movie_id: movie.id,
// //                 poster_url:`https://image.tmdb.org/t/p/w500${movie.poster_path}`
// //             });
// //         }
// //     } catch (error) {
// //         console.error(error);
// //     }
// // };

// Appwrite client and database initialization removed here to avoid duplicate declarations;
// the client/db are defined later in this file (single initialization).

import { Client, Databases, ID, Query } from "appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    // Query existing entry using indexed searchTerm
    const response = await database.listRows(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_TABLE_ID,
      [Query.equal("searchTerm", searchTerm)]
    );

    if (response.rows.length > 0) {
      const existingRow = response.rows[0];

      return await database.updateRow(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_TABLE_ID,
        existingRow.$id,
        {
          count: existingRow.count + 1,
        }
      );
    } else {
      return await database.createRow(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_TABLE_ID,
        {
          searchTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }
      );
    }
  } catch (error) {
    console.error("Appwrite Error:", error.message);
  }
};
