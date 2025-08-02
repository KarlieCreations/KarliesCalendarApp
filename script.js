const calendar = document.getElementById('calendar');
const monthYear = document.getElementById('monthYear');
let date = new Date();

function renderCalendar() {
  calendar.innerHTML = '';

  const year = date.getFullYear();
  const month = date.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay(); // 0 = Sunday
  const shiftedFirstDay = (firstWeekday + 6) % 7; // Shift so Monday = 0, Sunday = 6
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  monthYear.textContent = date.toLocaleString('de-DE', { month: 'long', year: 'numeric' });

  // Add empty slots for the offset
  for (let i = 0; i < shiftedFirstDay; i++) {
    calendar.innerHTML += '<div></div>';
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement('div');
    dayCell.textContent = day;
dayCell.style.aspectRatio = '1 / 1'; // Keeps them square

    let baseClasses = 'p-2 rounded text-center';
    let style = 'bg-white shadow';

    if (isCurrentMonth && day === today.getDate()) {
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
