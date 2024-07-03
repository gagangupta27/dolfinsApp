import { useRealm } from "@realm/react";
import { BSON } from "realm";
import Contact from "../realm/models/Contact";

const useQuickNote = () => {
  const realm = useRealm();
  const quickNoteRef = realm.objectForPrimaryKey(
    Contact,
    new BSON.ObjectId("000000000000000000000000")
  );

  return quickNoteRef;
};

export default useQuickNote;
