const calendar = document.getElementById('calendar');
const monthYear = document.getElementById('monthYear');
let date = new Date();

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
let isMouseDown = false;

// --- Touch support ---
calendarContainer.addEventListener('touchstart', e => {
  startX = e.changedTouches[0].screenX;
});
calendarContainer.addEventListener('touchend', e => {
  endX = e.changedTouches[0].screenX;
  handleSwipeOrDrag();
});

// --- Mouse support ---
calendarContainer.addEventListener('mousedown', e => {
  isMouseDown = true;
  startX = e.screenX;
});
calendarContainer.addEventListener('mouseup', e => {
  if (!isMouseDown) return;
  endX = e.screenX;
  isMouseDown = false;
  handleSwipeOrDrag();
});

// --- Shared logic ---
function handleSwipeOrDrag() {
  const distance = endX - startX;

  if (Math.abs(distance) < 50) return; // Ignore small movements

  if (distance > 0) {
    // Drag/swipe right
    date.setMonth(date.getMonth() - 1);
  } else {
    // Drag/swipe left
    date.setMonth(date.getMonth() + 1);
  }

  renderCalendar();
}