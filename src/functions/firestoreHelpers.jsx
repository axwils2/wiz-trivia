// @flow
export function mapQuerySnapshot(querySnapshot: *) {
  return querySnapshot.docs.map(doc => {
    return docDataWithId(doc);
  });
}

export function mapQuerySnapshotChanges(querySnapshot: *) {
  return querySnapshot.docChanges().map(change => {
    return docDataWithId(change.doc);
  });
}

export function docDataWithId(doc: *) {
  return { ...doc.data(), uid: doc.id };
}
