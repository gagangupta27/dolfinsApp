import { BSON } from "realm";
import Contact from "../realm/models/Contact";
import { useRealm } from "@realm/react";

const useQuickNote = () => {
  const realm = useRealm();
  const quickNoteRef = realm.objectForPrimaryKey(
    Contact,
    new BSON.ObjectId("000000000000000000000000")
  );

  return quickNoteRef;
};

export default useQuickNote;
