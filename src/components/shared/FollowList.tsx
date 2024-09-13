// // Create a new document in the "following" collection when a user follows another user
// export async function followUser(event) {
//     const followerId = event.userId;
//     const followeeId = event.followeeId;
  
//     const followingCollection = await appwrite.database.listDocuments('following');
//     const existingDocument = await followingCollection.find((doc) => doc.follower_id === followerId && doc.followee_id === followeeId);
  
//     if (!existingDocument) {
//       await appwrite.database.createDocument('following', {
//         follower_id: followerId,
//         followee_id: followeeId,
//       });
//     }
//   }
  
//   // Delete a document in the "following" collection when a user unfollows another user
//   export async function unfollowUser(event) {
//     const followerId = event.userId;
//     const followeeId = event.followeeId;
  
//     const followingCollection = await appwrite.database.listDocuments('following');
//     const existingDocument = await followingCollection.find((doc) => doc.follower_id === followerId && doc.followee_id === followeeId);
  
//     if (existingDocument) {
//       await appwrite.database.deleteDocument('following', existingDocument.$id);
//     }
//   }