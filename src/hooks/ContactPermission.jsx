import * as Contacts from "expo-contacts";
import { useEffect, useState } from "react";

const useContactPermission = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({});
        const sortedData = data.sort((a, b) => {
          let nameA = a.name?.toUpperCase();
          let nameB = b.name?.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        setContacts(sortedData);
      }
    })();
  }, []);

  return contacts;
};

export default useContactPermission;
