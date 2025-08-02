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


const calendarContainer = document.getElementById('calendarContainer');

let touchStartX = 0;
let touchEndX = 0;

calendarContainer.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

calendarContainer.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleGesture();
});

function handleGesture() {
  const swipeDistance = touchEndX - touchStartX;

  if (Math.abs(swipeDistance) < 50) return; // ignore small swipes

  if (swipeDistance > 0) {
    // Swipe Right → Previous month
    date.setMonth(date.getMonth() - 1);
  } else {
    // Swipe Left → Next month
    date.setMonth(date.getMonth() + 1);
  }

  renderCalendar();
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
