const CHANGES_ELEMENT_VALUE = 'issue-history.ui.history-items.generic-history-item.history-item';

const HISTORY_BTN_ID = 'issue-activity-feed.ui.buttons.History'

function buildOpenableWrapper(textA, textB) {

  const wrapper = document.createElement("div");
  const backgroundImg = document.createElement("img");
  const fragment = document.createElement("div");

  backgroundImg.setAttribute('src', 'https://cdn-icons-png.flaticon.com/128/3793/3793562.png')

  wrapper.classList.add("wrapper-container");
  fragment.classList.add("tooltip-text");
  backgroundImg.classList.add('change-img')

  wrapper.append(fragment);
  wrapper.append(backgroundImg);

  backgroundImg.addEventListener('click', () => {
    let isOpened = wrapper.getAttribute('opened') === 'true';
    if (isOpened) {
      doClose(wrapper);
    } else {
      doOpen(wrapper, textA, textB);
    }
  });

  return wrapper;
}

function doOpen(wrapper, textA, textB) {
  displayTextDifference(textA, textB, getTextHolder(wrapper));
  wrapper.setAttribute('opened', 'true');
}

function doClose(wrapper) {
  getTextHolder(wrapper).innerHTML = '';
  wrapper.setAttribute('opened', 'false');
}

function getTextHolder(wrapper) {
  return wrapper.getElementsByClassName("tooltip-text")[0];
}

function displayTextDifference(textA, textB, fragment) {
  const diff = Diff.diffChars(textA, textB);
  diff.forEach((part) => {
    if (part.added || part.removed) {
      const span = document.createElement("span");
      span.style.backgroundColor = part.added ? "#e6ffec" : "#ffebe9";
      span.appendChild(document.createTextNode(part.value));
      fragment.appendChild(span)
    } else {
      fragment.appendChild(document.createTextNode(part.value));
    }
  });
}

function closeWrappersOnClickOutside(clickedElement) {
  document
    .querySelectorAll("div.wrapper-container[opened=true]")
    .forEach((openedWrapper) => {
      if (!openedWrapper.contains(clickedElement)) {
        doClose(openedWrapper);
        console.log('global', openedWrapper, clickedElement);
      }
    });
}

function createShowTextDifferenceButtons() {
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
    if (!isOneEmpty) {
      el.append(buildOpenableWrapper(oldVersionText, changedText));
    }
  });
}

function addButtonsEvents() {
  const elements = document.querySelectorAll("button[data-testid]");
  const historyBtn = [...elements].find(el => el.getAttribute("data-testid") === HISTORY_BTN_ID)
  if (historyBtn) {
    historyBtn.addEventListener('click', () => setTimeout(createShowTextDifferenceButtons, 2000));
    document.addEventListener('click', (event) => closeWrappersOnClickOutside(event.target));
  }
}

function main() {
  addButtonsEvents();
}

setTimeout(main, 5000);
