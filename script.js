const calendar = document.getElementById('calendar');
const monthYear = document.getElementById('monthYear');
let date = new Date();

const checklistModal = document.getElementById('checklistModal');
const checklistTitle = document.getElementById('checklistTitle');
const checklistItems = document.getElementById('checklistItems');
const addItemBtn = document.getElementById('addItemBtn');
const newItemInput = document.getElementById('newItemInput');
const backToCalendar = document.getElementById('backToCalendar');

let selectedDayKey = null; // Format: MM-DD


function renderCalendar() {
  calendar.innerHTML = '';

  const year = date.getFullYear();
  const month = date.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay(); // 0 = Sunday
  const shiftedFirstDay = (firstWeekday + 6) % 7; // Make Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  // Show month name in German
  monthYear.textContent = date.toLocaleString('de-DE', { month: 'long', year: 'numeric' });

  // Fill initial blank days
  for (let i = 0; i < shiftedFirstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'aspect-square'; // keep empty cells square
    calendar.appendChild(emptyCell);
  }

  // Fill actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement('div');
    dayCell.textContent = day;
	dayCell.addEventListener('click', () => {
	  const dayStr = day.toString().padStart(2, '0');
	  const monthStr = (month + 1).toString().padStart(2, '0');
	  selectedDayKey = `${monthStr}-${dayStr}`;
	  showChecklist(selectedDayKey);
	});

    // ✅ New square + centering style
    dayCell.style.aspectRatio = '1 / 1'; // keeps it square
    dayCell.style.display = 'flex';
    dayCell.style.alignItems = 'center';
    dayCell.style.justifyContent = 'center';

    // Base classes
    let baseClasses = 'rounded text-center';
    let style = 'bg-white shadow';

    if (isCurrentMonth && day === today.getDate()) {
      // Highlight today
      style = 'bg-blue-500 text-white font-bold shadow-md border-2 border-blue-700';
    }

    dayCell.className = `${baseClasses} ${style}`;
    calendar.appendChild(dayCell);
  }
}



document.getElementById('prev').onclick = () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
};

document.getElementById('next').onclick = () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
};

renderCalendar();

const calendarContainer = document.getElementById('calendarContainer');

let startX = 0;
let endX = 0;

// --- Touch support ---
calendarContainer.addEventListener('touchstart', e => {
  if (e.touches.length === 1) {
    startX = e.touches[0].clientX;
  }
});

calendarContainer.addEventListener('touchend', e => {
  if (e.changedTouches.length === 1) {
    endX = e.changedTouches[0].clientX;
    handleSwipeOrDrag();
  }
});

// --- Mouse drag (already included previously) ---
calendarContainer.addEventListener('mousedown', e => {
  startX = e.clientX;
  isMouseDown = true;
});
calendarContainer.addEventListener('mouseup', e => {
  if (!isMouseDown) return;
  endX = e.clientX;
  isMouseDown = false;
  handleSwipeOrDrag();
});

function handleSwipeOrDrag() {
  const distance = endX - startX;
  if (Math.abs(distance) < 50) return;

  if (distance > 0) {
    date.setMonth(date.getMonth() - 1);
  } else {
    date.setMonth(date.getMonth() + 1);
  }
  renderCalendar();
}


function showChecklist(key) {
  checklistTitle.textContent = `Checkliste für ${key}`;
  checklistModal.classList.remove('hidden');
  renderChecklist();
}

function hideChecklist() {
  checklistModal.classList.add('hidden');
}

function getChecklist() {
  return JSON.parse(localStorage.getItem('checklist-' + selectedDayKey) || '[]');
}

function saveChecklist(items) {
  localStorage.setItem('checklist-' + selectedDayKey, JSON.stringify(items));
}

function renderChecklist() {
  const items = getChecklist();
  checklistItems.innerHTML = '';

  // Sort: unchecked first
  const sorted = items.sort((a, b) => a.checked - b.checked);

  sorted.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'flex items-center gap-2';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.checked;
    checkbox.addEventListener('change', () => {
      item.checked = checkbox.checked;
      saveChecklist(items);
      renderChecklist(); // re-render to reorder
    });

    const span = document.createElement('span');
    span.textContent = item.text;
    if (item.checked) span.classList.add('line-through', 'text-gray-400');

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑';
    deleteBtn.className = 'ml-auto';
    deleteBtn.addEventListener('click', () => {
      items.splice(index, 1);
      saveChecklist(items);
      renderChecklist();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    checklistItems.appendChild(li);
  });
}

addItemBtn.addEventListener('click', () => {
  const text = newItemInput.value.trim();
  if (!text) return;

  const items = getChecklist();
  items.push({ text, checked: false });
  saveChecklist(items);
  newItemInput.value = '';
  renderChecklist();
});

backToCalendar.addEventListener('click', () => {
  hideChecklist();
});

