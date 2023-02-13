const CHANGES_ELEMENT_VALUE =
  "issue-history.ui.history-items.generic-history-item.history-item";

const HISTORY_BTN_ID = 'issue-activity-feed.ui.buttons.History'


function getChangeItemElement(textA, textB) {
  const diff = Diff.diffChars(textA, textB);

  const wrapper = document.createElement("div");
  const backgroundImg = document.createElement("img");
  const fragment = document.createElement("div");

  backgroundImg.setAttribute('src', 'https://cdn-icons-png.flaticon.com/128/3793/3793562.png')


  diff.forEach((part) => {
    const color = part.added ? "#17B169" : part.removed ? "#E31837" : "black";
    const span = document.createElement("span");
    span.style.color = color;
    span.appendChild(document.createTextNode(part.value));
    fragment.appendChild(span);
  });

  fragment.classList.add("tooltip-text");
  backgroundImg.classList.add('change-img')

  wrapper.append(fragment);
  wrapper.append(backgroundImg);
  wrapper.classList.add("wrapper-container");
  return wrapper;
}

function parseHistoryItems () {
  const elements = document.querySelectorAll("div[data-test-id]");
  const filteredById = [...elements].filter((el) => {
    return el.getAttribute("data-test-id") === CHANGES_ELEMENT_VALUE;
  });
  filteredById.forEach((el) => {
    const historyBlock = el.children[1].children[1].children;
    el.style.position = "relative";
    const oldVersionText = historyBlock[0].children[0].innerHTML;
    const changedText = historyBlock[2].children[0].innerHTML;
    const isOneEmpty = oldVersionText.includes('None') || changedText.includes('None');
    if(!isOneEmpty) {
      el.append(getChangeItemElement(oldVersionText, changedText));
    }
  });
}

function addButtonsEvents () {
  const elements = document.querySelectorAll("button[data-testid]");
  const historyBtn =  [...elements].find(el => el.getAttribute("data-testid") === HISTORY_BTN_ID)
  if(historyBtn) {
    historyBtn.addEventListener('click', () => setTimeout(parseHistoryItems, 2000))
  }
}

function main() {
  addButtonsEvents();
}

setTimeout(main, 5000);
