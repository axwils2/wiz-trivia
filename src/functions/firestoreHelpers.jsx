// @flow
export function mapQuerySnapshot(querySnapshot: *) {
  return querySnapshot.docs.map(doc => {
    return docDataWithId(doc);
  });
}

export function docDataWithId(doc: *) {
  return { ...doc.data(), uid: doc.id };
}
