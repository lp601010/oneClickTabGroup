const tabs = await chrome.tabs.query({});
let isCollapsed = true;

const group_button = document.getElementById("group_tabs");
const clear_group_button = document.getElementById("clear_group");
const toggle_group_button = document.getElementById("toggle_group");

function getSecondLevelDomain(url) {
  const domain = new URL(url).hostname.split(".").slice(-2, -1);
  return domain;
}

group_button.addEventListener("click", async () => {
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
});

toggle_group_button.addEventListener("click", async () => {
  const tabIds = tabs.map(({ id }) => id);
  const groups = await chrome.tabGroups.query({});

  if (tabIds.length && groups.length) {
    isCollapsed = !isCollapsed;
    groups.forEach(async (group) => {
      await chrome.tabGroups.update(group.id, { collapsed: isCollapsed });
    });
  }
});

clear_group_button.addEventListener("click", async () => {
  const tabIds = tabs.map(({ id }) => id);
  if (tabIds.length) {
    await chrome.tabs.ungroup(tabIds);
  }
});
