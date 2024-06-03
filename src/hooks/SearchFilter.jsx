import { useState } from "react";

const useSearchFilter = (contacts, mentionData) => {
  const [searchText, setSearchText] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);

  const searchFilter = (text) => {
    setSearchText(text);
    searchFilterWithout(text);
  };

  const searchFilterWithout = (text) => {
    const textData = text.toUpperCase();
    const newData = contacts
      .map((item) => {
        const itemData = item.name ? item.name.toUpperCase() : "";
        const matchIndex = itemData.indexOf(textData);
        return {
          ...item,
          matchIndex,
        };
      })
      .filter((item) => item.matchIndex > -1)
      .filter((item) => {
        return mentionData.filter((m) => m.id == item.id).length == 0;
      })
      .slice(0, 5);

    setFilteredContacts(newData);
  };

  return { searchText, setSearchText, searchFilter, filteredContacts };
};

export default useSearchFilter;
