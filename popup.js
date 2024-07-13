const tabs = await chrome.tabs.query({});
let isCollapsed = true;

const group_button = document.getElementById("group_tabs");
const clear_group_button = document.getElementById("clear_group");
const toggle_all_groups_button = document.getElementById("toggle_all_groups");
const expand_group_button = document.getElementById("expand_group");
const group_name_input = document.getElementById("group_name_input");
const group_names_datalist = document.getElementById("group_names");

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

toggle_all_groups_button.addEventListener("click", async () => {
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

expand_group_button.addEventListener("click", async () => {
  expand_group_button.style.display = "none";
  group_name_input.style.display = "block";
  group_name_input.focus();

  const groups = await chrome.tabGroups.query({});
  group_names_datalist.innerHTML = "";
  groups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group.title;
    group_names_datalist.appendChild(option);
  });

  group_name_input.addEventListener("change", async () => {
    const groupName = group_name_input.value;
    const group = groups.find((g) => g.title === groupName);
    if (group) {
      await chrome.tabGroups.update(group.id, { collapsed: !group.collapsed });
    }
    group_name_input.style.display = "none";
    group_name_input.value = "";
    expand_group_button.style.display = "block";
  });
});
