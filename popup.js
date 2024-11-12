// Function to add the current tab to the reading list
async function addCurrentTab() {
    // Get the current active tab
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let url = tab.url;
    let title = tab.title;
  
    // Retrieve the current reading list from storage
    chrome.storage.sync.get("readingList", (data) => {
      let readingList = data.readingList || [];
      
      // Add the current tab's URL and title
      readingList.push({ url, title });
      
      // Save the updated reading list back to storage
      chrome.storage.sync.set({ readingList }, renderList);
    });
  }
  
  // Function to render the reading list
  function renderList() {
    chrome.storage.sync.get("readingList", (data) => {
      let readingList = data.readingList || [];
      const listElement = document.getElementById("readingList");
  
      // Clear the current list
      listElement.innerHTML = "";
  
      // Add each link as a list item
      readingList.forEach((item, index) => {
        let listItem = document.createElement("li");
        let link = document.createElement("a");
        let deleteButton = document.createElement("span");
  
        link.href = item.url;
        link.textContent = item.title;
        link.target = "_blank"; // Open link in a new tab
        
        deleteButton.textContent = "❌";
        deleteButton.classList.add("delete");
        deleteButton.onclick = () => deleteLink(index);
  
        listItem.appendChild(link);
        listItem.appendChild(deleteButton);
        listElement.appendChild(listItem);
      });
    });
  }
  
  // Function to delete a link from the reading list
  function deleteLink(index) {
    chrome.storage.sync.get("readingList", (data) => {
      let readingList = data.readingList || [];
      
      // Remove the item at the specified index
      readingList.splice(index, 1);
      
      // Save the updated list back to storage
      chrome.storage.sync.set({ readingList }, renderList);
    });
  }
  
  // Add event listener to the "Add Current Tab" button
  document.getElementById("addLink").addEventListener("click", addCurrentTab);
  
  // Render the reading list when the popup loads
  document.addEventListener("DOMContentLoaded", renderList);  