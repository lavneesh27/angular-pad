import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private afs: AngularFirestore) {}

  //tweet
  addNote(note: any) {
    note.createdAt = new Date().toLocaleString();
    note.id = this.afs.createId();
    return this.afs.collection('/Notes').doc(note.id).set(note);
  }
  getAllNotes() {
    return this.afs.collection('/Notes').snapshotChanges();
  }
  likeTweet(tweet: any, userId: string) {
    const postRef = this.afs.collection('/Tweets').doc(tweet.id).ref;

    return this.afs.firestore.runTransaction(async (transaction) => {
      const postDoc = await transaction.get(postRef);

      if (!postDoc.exists) {
        throw new Error('Post does not exist!');
      }

      const likes = postDoc.get('likes') || [];
      likes.push(userId);

      transaction.update(postRef, { likes });
    });
  }
  unlikeTweet(tweet: any, userId: string) {
    const postRef = this.afs.collection('/Tweets').doc(tweet.id).ref;

    return this.afs.firestore.runTransaction(async (transaction) => {
      const postDoc = await transaction.get(postRef);

      if (!postDoc.exists) {
        throw new Error('Post does not exist!');
      }

      const likes = postDoc.get('likes') || [];
      const updatedLikes = likes.filter((id: string) => id !== userId);

      transaction.update(postRef, { likes: updatedLikes });
    });
  }

  async getNote(id: string): Promise<any> {
    try {
      const doc = await this.afs.collection('/Notes').doc(id).ref.get();

      if (doc.exists) {
        return doc.data();
      } else {
        return null;
      }
    } catch (error) {
      console.error('There was an error getting your document:', error);
      throw error; 
    }
  }

  //user
  addUser(user: any) {
    return this.afs.collection('/Users').doc(user.id).set(user);
  }
  getAllUsers() {
    return this.afs.collection('/Users').snapshotChanges();
  }
  async getUser(id: string): Promise<any> {
    try {
      const doc = await this.afs.collection('/Users').doc(id).ref.get();

      if (doc.exists) {
        return doc.data();
      } else {
        return null; 
      }
    } catch (error) {
      console.error('There was an error getting your document:', error);
      throw error; 
    }
  }
  updateUser(user: any) {
    this.afs.collection('/Users').doc(user.id).update({
      firstName: user.firstName,
      lastName: user.lastName,
      bio:user.bio,
      location:user.location,
      website:user.website,
      userName: user.userName,
      dob: user.dob,
      image:user.image,
      banner:user.banner
    })
  }

  follow(user1:string, user2:string){
    const postRef = this.afs.collection('/Users').doc(user2).ref;
    const postRef2 = this.afs.collection('/Users').doc(user1).ref;

    return this.afs.firestore.runTransaction(async (transaction) => {
      const postDoc = await transaction.get(postRef);
      const postDoc2 = await transaction.get(postRef2);

      if (!postDoc.exists) {
        throw new Error('Post does not exist!');
      }

      const followers = postDoc.get('followers') || [];
      const following = postDoc2.get('following') || [];
      followers.push(user1);
      following.push(user2);

      transaction.update(postRef, { followers });
      transaction.update(postRef2, { following });
    });
  }

  unFollow(user1:string, user2:string) {
    const postRef = this.afs.collection('/Users').doc(user2).ref;
    const postRef2 = this.afs.collection('/Users').doc(user1).ref;

    return this.afs.firestore.runTransaction(async (transaction) => {
      const postDoc = await transaction.get(postRef);
      const postDoc2 = await transaction.get(postRef2);

      if (!postDoc.exists) {
        throw new Error('Post does not exist!');
      }

      const followers = postDoc.get('followers') || [];
      const following = postDoc2.get('following') || [];
      const updatedFollowers = followers.filter((id: string) => id !== user1);
      const updatedFollowings = following.filter((id: string) => id !== user2);

      transaction.update(postRef, { followers: updatedFollowers });
      transaction.update(postRef2, { following: updatedFollowings });
    });
  }

  //bookmarks

  addBookmark(bookmark: any) {
    bookmark.id = this.afs.createId();
    
    return this.afs.collection('/Bookmarks').add(bookmark);
  }
  getAllBookmarks(id: number) {
    return this.afs
      .collection('/Bookmarks', (ref) => ref.where('userId', '==', id))
      .snapshotChanges();
  }
}
