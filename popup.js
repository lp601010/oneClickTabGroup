const tabs = await chrome.tabs.query({});
let isCollapsed = true;

const groupButton = document.getElementById("group_tabs");
const clearGroupButton = document.getElementById("clear_group");
const toggleAllGroupsButton = document.getElementById("expand_all_groups");
const expandGroupButton = document.getElementById("expand_group");
const groupNameInput = document.getElementById("group_name_input");
const groupNamesDatalist = document.getElementById("group_names");

console.log("popup.js loaded");
console.log(chrome.i18n.getMessage("groupTabs"));
groupButton.textContent = chrome.i18n.getMessage("groupTabs");
toggleAllGroupsButton.textContent = chrome.i18n.getMessage("expandAllGroups");
expandGroupButton.textContent = chrome.i18n.getMessage("expandSpecificGroup");
groupNameInput.placeholder = chrome.i18n.getMessage("enterGroupName");
clearGroupButton.textContent = chrome.i18n.getMessage("clearAllGroups");

document.addEventListener("keydown", (event) => {
  const focusableElements = document.querySelectorAll("button, input");
  const focusArray = Array.prototype.slice.call(focusableElements);
  const currentIndex = focusArray.indexOf(document.activeElement);

  if (event.key === "ArrowDown") {
    event.preventDefault();
    const nextIndex = (currentIndex + 1) % focusArray.length;
    focusArray[nextIndex].focus();
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    const prevIndex = (currentIndex - 1 + focusArray.length) % focusArray.length;
    focusArray[prevIndex].focus();
  }
});

function getSecondLevelDomain(url) {
  const domain = new URL(url).hostname.split(".").slice(-2, -1);
  return domain;
}

groupButton.addEventListener("click", async () => {
  const tabGroups = {};
  const singleTabs = [];
  tabs.forEach((tab) => {
    const domain = getSecondLevelDomain(tab.url);
    if (!tabGroups[domain]) {
      tabGroups[domain] = [];
    }
    tabGroups[domain].push(tab.id);
  });

  let index = 0;
  for (const [domain, tabIds] of Object.entries(tabGroups)) {
    if (tabIds.length > 1) {
      const group = await chrome.tabs.group({ tabIds });
      await chrome.tabGroups.update(group, { title: domain, collapsed: true });
      index += tabIds.length;
    } else {
      singleTabs.push(tabIds[0]);
    }
  }
  for (const tabId of singleTabs) {
    await chrome.tabs.move(tabId, { index: index++ });
  }
  window.close();
});

toggleAllGroupsButton.addEventListener("click", async () => {
  const tabIds = tabs.map(({ id }) => id);
  const groups = await chrome.tabGroups.query({});

  if (tabIds.length && groups.length) {
    isCollapsed = !isCollapsed;
    groups.forEach(async (group) => {
      await chrome.tabGroups.update(group.id, { collapsed: isCollapsed });
    });
  }
  window.close();
});

clearGroupButton.addEventListener("click", async () => {
  const tabIds = tabs.map(({ id }) => id);
  if (tabIds.length) {
    await chrome.tabs.ungroup(tabIds);
  }
  window.close();
});

expandGroupButton.addEventListener("click", async () => {
  expandGroupButton.style.display = "none";
  groupNameInput.style.display = "block";
  groupNameInput.focus();

  const groups = await chrome.tabGroups.query({});
  groupNamesDatalist.innerHTML = "";
  groups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group.title;
    groupNamesDatalist.appendChild(option);
  });

  groupNameInput.addEventListener("change", async () => {
    const groupName = groupNameInput.value;
    const group = groups.find((g) => g.title === groupName);
    if (group) {
      await chrome.tabGroups.update(group.id, { collapsed: !group.collapsed });
    }
    groupNameInput.style.display = "none";
    groupNameInput.value = "";
    expandGroupButton.style.display = "block";
    window.close();
  });
});

document.addEventListener("blur", () => {
  window.close();
});
